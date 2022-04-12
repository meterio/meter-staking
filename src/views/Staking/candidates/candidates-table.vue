<template>
  <div class="data-table-content">
    <b-row class="p-3">
      <b-col
        ><button @click="listMeAsCandidate" type="button" class="btn btn-primary">
          <b-icon icon="plus" />
          New Candidate
        </button></b-col
      >
      <b-col cols="12" md="auto"></b-col>
      <b-col col lg="3"
        ><b-form-group label-size="sm" class="mb-0">
          <b-input-group>
            <b-form-input id="filter-input" v-model="filter" type="search" placeholder="Search here"></b-form-input>
          </b-input-group> </b-form-group
      ></b-col>
    </b-row>

    <Divider />
    <b-row class="p-3">
      <b-col cols="12">
        <b-table
          :busy="getCandidatesloading"
          :items="computedData"
          :fields="fields"
          :current-page="currentPage"
          :per-page="perPage"
          :filter="filter"
          stacked="md"
          responsive
          show-empty
        >
          <template #table-busy>
            <div class="text-center my-2">
              <b-spinner class="align-middle mr-3"></b-spinner>
              <strong>Loading...</strong>
            </div>
          </template>
          <template #cell(name)="data">
            <b-link @click="info(data.item)">{{ data.item.name }}</b-link>
          </template>
          <template #cell(action)="data">
            <div class="token-operation d-flex justify-content-start">
              <a class="opt-btn d-flex align-items-center" @click="vote(data.item)">Vote</a>
              <div v-if="data.item.owned">
                <b-button
                  variant="light"
                  :id="`c-action-${data.index}`"
                  class="font-weight-bold ml-1 py-0 px-2"
                  size="small"
                  >···</b-button
                >
                <b-popover triggers="hover" :target="`c-action-${data.index}`">
                  <b-link @click="update(data.item)">Update</b-link>
                  <b-link class="d-block" @click="uncandidate(data.item)">Uncandidate</b-link>
                  <b-link class="d-block" v-if="data.item.jailed" @click="bailOut(data.item)">Bailout</b-link>
                </b-popover>
              </div>
            </div>
          </template>
        </b-table>
        <b-col v-if="totalRows > 0" sm="12" class="my-1">
          <b-pagination
            pills
            v-model="currentPage"
            :total-rows="totalRows"
            :per-page="perPage"
            align="center"
            size="sm"
            class="my-0"
          ></b-pagination>
        </b-col>
      </b-col>
    </b-row>

    <!-- vote modal -->
    <StakingVoteModal :voteParams="voteParams" @close="closeStakingVoteModal" />
    <!-- candidate information modal -->
    <CandidateInformationModal :infoParams="infoParams" @close="closeInfoModal" />
    <!-- candidate update -->
    <CandidateUpdateModal :updateCandidateParams="updateCandidateParams" @close="closeUpdateCandidateModal" />
    <!-- uncandidate -->
    <UncandidateModal :uncandidateParams="uncandidateParams" @close="closeUncandidateModal" />
    <StakingCandidateModal :stakingCandidateParams="stakingCandidateParams" @close="closeStakingCandidateModal" />
    <!-- bail out modal -->
    <BailOutModal :bailOutParams="bailOutParams" @close="closeBailOutmodal" />
  </div>
</template>
<script>
import { mapActions, mapState } from 'vuex'
import { BigNumber } from 'bignumber.js'
import StakingVoteModal from './staking-vote.vue'
import CandidateInformationModal from './candidate-info.vue'
import CandidateUpdateModal from './candidate-update.vue'
import UncandidateModal from './uncandidate.vue'
import StakingCandidateModal from './staking-candidate.vue'
import Divider from '../../../components/Divider'
import BailOutModal from './bailout.vue'

import moment from 'moment'

export default {
  name: 'CadidatesTable',
  components: {
    StakingVoteModal,
    CandidateInformationModal,
    CandidateUpdateModal,
    UncandidateModal,
    StakingCandidateModal,
    BailOutModal,
    Divider,
  },
  props: {},
  data() {
    return {
      perPage: 20,
      currentPage: 1,
      filter: '',
      fields: [
        { key: 'name', sortable: true, label: 'Candidate Name' },
        {
          key: 'address',
          sortable: true,
          sortByFormatted: true,
          formatter: (value, key, item) => {
            return item.address.substr(0, 11) + '...'
          },
        },
        { key: 'ipAddr', sortable: true, label: 'IP' },
        { key: '_commission', sortable: true },
        {
          key: 'totalVotes',
          sortable: true,
          sortByFormatted: true,
          formatter: (value, key, item) => {
            return new BigNumber(item.totalVotes).div(1e18).toFormat(2)
          },
        },
        { key: 'bucketsLen', label: 'nVoter', sortable: true },
        { key: 'action' },
      ],
      voteParams: {
        show: false,
        data: {},
      },
      infoParams: {
        show: false,
        data: {},
      },
      updateCandidateParams: {
        show: false,
        data: {},
      },
      uncandidateParams: {
        show: false,
        data: {},
      },
      stakingCandidateParams: {
        show: false,
        data: {},
      },
      bailOutParams: {
        show: false,
        data: {},
      },
    }
  },
  computed: {
    ...mapState('candidate', ['candidates', 'getCandidatesloading']),
    ...mapState('wallet', ['account']),
    ...mapState('token', ['currentNetwork']),
    ...mapState('bailout', ['jaileds']),
    computedData() {
      return this.candidates.map((c) => {
        const jailed = this.jaileds.find((j) => j.address === c.address)
        return {
          ...c,
          _address: c.address.substr(0, 11) + '...',
          bucketsLen: c.buckets.length,
          _totalVotes:
            new BigNumber(c.totalVotes).div(1e18).toFormat(2) + ' ' + this.currentNetwork.governanceTokenSymbol || '',
          _commission: c.commission / 1e7 + '%',

          owned: String(c.address).toLowerCase() === this.account,
          jailed: !!jailed,
        }
      })
    },
    totalRows() {
      return this.computedData.length
    },
  },
  created() {
    // this.getJaileds()
  },
  methods: {
    ...mapActions({
      getJaileds: 'bailout/getJaileds',
    }),
    listMeAsCandidate() {
      this.stakingCandidateParams.show = true
    },
    closeStakingCandidateModal() {
      this.stakingCandidateParams.show = false
    },
    vote(candidate) {
      this.voteParams.show = true
      this.voteParams.data = candidate
    },
    closeStakingVoteModal() {
      this.voteParams.show = false
    },
    info(candidate) {
      this.infoParams.show = true
      this.infoParams.data = candidate
    },
    closeInfoModal() {
      this.infoParams.show = false
    },
    update(candidate) {
      console.log(candidate)
      this.updateCandidateParams.show = true
      this.updateCandidateParams.data = candidate
    },
    closeUpdateCandidateModal() {
      this.updateCandidateParams.show = false
    },
    uncandidate(candidate) {
      this.uncandidateParams.show = true
      this.uncandidateParams.data = candidate
    },
    closeUncandidateModal() {
      this.uncandidateParams.show = false
    },
    bailOut(candidate) {
      const jailed = this.jaileds.find((j) => j.address === candidate.address)
      console.log('jailed', jailed)
      this.bailOutParams.show = true
      this.bailOutParams.data = {
        ...jailed,
        _bailAmount: new BigNumber(jailed.bailAmount).div(1e18).toFormat(),
        _jailedTime:
          moment.utc(1000 * Number(jailed.jailedTime)).fromNow() +
          '(' +
          new Date(jailed.jailedTime * 10e2).toLocaleString() +
          ')',
      }
    },
    closeBailOutmodal() {
      this.bailOutParams.show = false
      this.getJaileds()
    },
  },
}
</script>
<style lang="scss" scoped>
.table-font-size {
  font-size: 14px;
}
.opt-btn {
  cursor: pointer;
}
</style>