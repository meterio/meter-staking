<template>
  <div class="data-table-content">
    <section v-if="!isMobile" class="bg-white-color rounded-lg border card-shadow">
      <b-row class="p-3">
        <b-col
          ><b-button variant="myprimary" @click="listMeAsCandidate">
            <b-icon icon="plus" />
            New Candidate
          </b-button></b-col
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
            sort-by="totalVotes"
            sort-desc
          >
            <template #table-busy>
              <div class="text-center my-2">
                <b-spinner class="align-middle mr-3"></b-spinner>
                <strong>Loading...</strong>
              </div>
            </template>
            <template #cell(name)="data">
              <b-link class="opt-btn" @click="info(data.item)">{{ data.item.name }}</b-link>
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
                    <b-link class="opt-btn" @click="update(data.item)">Update</b-link>
                    <b-link class="d-block opt-btn" @click="uncandidate(data.item)">Uncandidate</b-link>
                    <b-link class="d-block opt-btn" v-if="data.item.jailed" @click="bailOut(data.item)">Bailout</b-link>
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
    </section>
    <section v-else>
      <div class="bg-white-color border p-3 rounded-xlg">
        <b-button variant="myprimary" @click="listMeAsCandidate" class="w-100 rounded-xlg">
          <b-icon icon="plus" />
          New Candidate
        </b-button>
        <div class="mt-2">
          <b-form-input class="rounded-xlg" v-model="filter" type="search" placeholder="Search here"></b-form-input>
        </div>
      </div>
      <div class="mt-3 d-flex">
        <select class="form-control rounded-xlg" v-model="orderBy">
          <option>Commission</option>
          <option>Total Votes</option>
          <option>nVoter</option>
        </select>
        <b-button variant="mylight" class="rounded-xlg ml-1" @click="isDesc = !isDesc">
          <div :class="isDesc ? 'triangle-light' : 'triangle-black'"></div>
          <div :class="[isDesc ? 'triangle-top-black' : 'triangle-top-light', 'mt-1']"></div>
        </b-button>
      </div>
      <div class="mt-3">
        <div v-if="!getCandidatesloading">
          <div 
            v-for="(item, index) in computedMobileData" :key="item.address"
            class="border rounded-xlg bg-white-color px-3 py-2 font-small-size mt-2">
            <div class="d-flex justify-content-between py-1">
              <span class="font-weight-bold">Candidate</span>
              <b-link class="opt-btn" @click="info(item)">{{ item.name }}</b-link>
            </div>
            <divider />
            <div class="d-flex justify-content-between py-1">
              <span class="font-weight-bold">Address</span>
              <span>{{ item.address | abbr }}</span>
            </div>
            <divider />
            <div class="d-flex justify-content-between py-1">
              <span class="font-weight-bold">IP</span>
              <span>{{ item.ipAddr }}</span>
            </div>
            <divider />
            <div class="d-flex justify-content-between py-1">
              <span class="font-weight-bold">Commission</span>
              <span>{{ item._commission }}</span>
            </div>
            <divider />
            <div class="d-flex justify-content-between py-1">
              <span class="font-weight-bold">Total Votes</span>
              <span>{{ formatTotalsForMobile(item.totalVotes) }}</span>
            </div>
            <divider />
            <div class="d-flex justify-content-between py-1">
              <span class="font-weight-bold">nVoter</span>
              <span>{{ item.bucketsLen }}</span>
            </div>
            <divider />
            <div class="d-flex justify-content-between py-1">
              <span class="font-weight-bold">Action</span>
              <div class="token-operation d-flex justify-content-start">
                <a class="opt-btn d-flex align-items-center" @click="vote(item)">Vote</a>
                <div v-if="item.owned">
                  <b-button
                    variant="light"
                    :id="`c-action-${index}`"
                    class="font-weight-bold ml-1 py-0 px-2"
                    size="small"
                    >···</b-button
                  >
                  <b-popover triggers="hover" :target="`c-action-${index}`">
                    <b-link class="opt-btn" @click="update(item)">Update</b-link>
                    <b-link class="d-block opt-btn" @click="uncandidate(item)">Uncandidate</b-link>
                    <b-link class="d-block opt-btn" v-if="item.jailed" @click="bailOut(item)">Bailout</b-link>
                  </b-popover>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div v-else class="text-center">
          <b-spinner label="Loading..."></b-spinner>
        </div>

        <div v-if="totalRows" class="mt-3">
          <b-pagination
            pills
            v-model="currentPage"
            :total-rows="totalRows"
            :per-page="perPage"
            align="fill"
            class="my-0"
          ></b-pagination>
        </div>
      </div>
    </section>

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

import { regExpList } from '@/constants'

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
          // sortByFormatted: true,
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
      isDesc: true,
      orderBy: 'Commission',
    }
  },
  computed: {
    ...mapState('candidate', ['candidates', 'getCandidatesloading']),
    ...mapState('wallet', ['account', 'isMobile']),
    ...mapState('token', ['currentNetwork']),
    ...mapState('bailout', ['jaileds']),
    ...mapState('modal', ['candidateAddr']),
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
    computedMobileData() {
      if (!this.computedData) {
        return []
      }
      let _orderBy = 'commission'
      switch (this.orderBy) {
        case 'Commission':
          _orderBy = 'commission'
          break;
        case 'Total Votes':
          _orderBy = 'totalVotes'
          break;
        case 'nVoter':
          _orderBy = 'bucketsLen'
          break;
        default:
          _orderBy = 'commission'
          break;
      }
      return this.computedData.sort((a, b) => {
        if (Number(a[_orderBy]) > Number(b[_orderBy])) {
          if (this.isDesc) return -1
          return 1
        } else if (Number(a[_orderBy]) < Number(b[_orderBy])) {
          if (this.isDesc) return 1
          return -1
        } else {
          return 0
        }
      }).slice((this.currentPage - 1) * this.perPage, (this.currentPage * this.perPage))
    },
    totalRows() {
      return this.computedData.length
    },
  },
  mounted() {
    // this.getJaileds()
    if (new RegExp(regExpList.address).test(this.candidateAddr)) {
      const candidate = this.computedData.find(item => item.address === this.candidateAddr.toLowerCase())
      if (candidate) {
        this.vote(candidate)
      }
    }
  },
  methods: {
    ...mapActions({
      getJaileds: 'bailout/getJaileds',
    }),
    formatTotalsForMobile(totalVotes) {
      return new BigNumber(totalVotes).div(1e18).toFormat(2)
    },
    listMeAsCandidate() {
      this.stakingCandidateParams.show = true
    },
    closeStakingCandidateModal() {
      this.stakingCandidateParams.show = false
    },
    vote(candidate) {
      if (this.$route.query.candidate) {
        if (this.$route.query.candidate.toLowerCase() !== candidate.address) {
          this.$router.replace({ query: { candidate: candidate.address } })
        }
      } else {
        this.$router.push({ path: '/', query: { candidate: candidate.address } })
      }
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