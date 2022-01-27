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
          v-if="totalRows > 0"
          :busy="getCandidatesloading"
          :items="computedData"
          :fields="fields"
          :current-page="currentPage"
          :per-page="perPage"
          :filter="filter"
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
            <div class="token-operation text-myprimary-color font-weight-bold d-flex justify-content-start">
              <a class="opt-btn font-weight-bold d-flex align-items-center" @click="vote(data.item)">Vote</a>
              <b-button
                v-if="data.item.owned"
                variant="light"
                :id="'action' + data.index"
                class="font-weight-bold ml-1 py-0 px-2"
                size="small"
                >···</b-button
              >
              <b-popover triggers="hover" :target="'action' + data.index">
                <a class="opt-btn d-block font-weight-bold" @click="update(data.item)">Update</a>
                <a class="opt-btn d-block font-weight-bold" @click="uncandidate(data.item)">Uncandidate</a>
              </b-popover>
            </div>
          </template>
        </b-table>
        <div v-else>NO DATA</div>
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
  </div>
</template>
<script>
import { mapState } from 'vuex'
import { BigNumber } from 'bignumber.js'
import StakingVoteModal from './staking-vote.vue'
import CandidateInformationModal from './candidate-info.vue'
import CandidateUpdateModal from './candidate-update.vue'
import UncandidateModal from './uncandidate.vue'
import StakingCandidateModal from './staking-candidate.vue'
import Divider from '../../../components/Divider'

export default {
  name: 'CadidatesTable',
  components: {
    StakingVoteModal,
    CandidateInformationModal,
    CandidateUpdateModal,
    UncandidateModal,
    StakingCandidateModal,
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
    }
  },
  computed: {
    ...mapState('candidate', ['candidates', 'getCandidatesloading']),
    ...mapState('wallet', ['account']),
    ...mapState('token', ['currentNetwork']),
    computedData() {
      return this.candidates.map((c) => {
        return {
          ...c,
          _address: c.address.substr(0, 11) + '...',
          bucketsLen: c.buckets.length,
          _totalVotes:
            new BigNumber(c.totalVotes).div(1e18).toFormat(2) + ' ' + this.currentNetwork.governanceTokenSymbol || '',
          _commission: c.commission / 1e7 + '%',

          owned: String(c.address).toLowerCase() === this.account,
        }
      })
    },
    totalRows() {
      return this.computedData.length
    },
  },
  methods: {
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