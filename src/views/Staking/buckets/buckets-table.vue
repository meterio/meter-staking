<template>
  <div class="data-table-content">
    <b-row class="p-3">
      <b-col>
        <div class="d-flex justify-space-between">
          <b-form-group label-size="sm" class="mb-0">
            <b-form-select v-model="bucketFilterSelection" :options="bucketFilterOptions"></b-form-select>
          </b-form-group>

          <b-button variant="myprimary" @click="createVote" class="ml-2"
            ><b-icon icon="plus" />New Vote</b-button
          >
        </div></b-col
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
          :busy="loading"
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
          <template #cell(id)="data">
            <b-link @click="info(data.item)">{{ data.item.id | abbr }}</b-link>
          </template>
          <template #cell(candidateName)="data">
            <b-link @click="candidateInfo(data.item)">{{ data.item.candidateName }}</b-link>
          </template>
          <template #cell(action)="data">
            <div v-if="data.item.owned" class="token-operation">
              <b-link @click="addmore(data.item)">Vote More</b-link>
              <b-button :id="`b-action-${data.index}`" variant="light" class="ml-1 py-0 px-2" size="small"
                >···</b-button
              >
              <b-popover :target="`b-action-${data.index}`" triggers="hover">
                <b-link v-if="!data.item.unbounded" @click="unbound(data.item)">Unbound</b-link>

                <b-link
                  v-if="data.item.candidate === '0x0000000000000000000000000000000000000000'"
                  class="opt-btn d-block"
                  @click="delegate(data.item)"
                  >Delegate</b-link
                >
                <b-link v-else class="opt-btn d-block" @click="undelegate(data.item)">Undelegate</b-link>

                <b-link v-if="appStatus === 'mainnet' && !data.item.unbounded" @click="subVote(data.item)">Partial Unbound</b-link>
              </b-popover>
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

    <BucketInformationModal :infoParams="infoParams" @close="closeInfoModal" />
    <AddBucketModal :bucketParams="addBucketParams" @close="closeAddBucketModal" />
    <SubBucketModal :bucketParams="subBucketParams" @close="closeSubBucketModal" />
    <DelegateModal :bucketParams="delegateParams" @close="closeDelegateModal" />
    <UnboundModal :unboundParams="unboundParams" @close="closeUnboundModal" />
    <UndelegateModal :undelegateParams="undelegateParams" @close="closeUndelegateModal" />

    <!-- candidate information modal -->
    <CandidateInformationModal :infoParams="candidateInfoParams" @close="closeCandidateInfoModal" />

    <StakingVoteModal :voteParams="voteParams" @close="closeStakingVoteModal" />
  </div>
</template>
<script>
import { mapActions, mapState } from 'vuex'
import { BigNumber } from 'bignumber.js'

import BucketInformationModal from './bucket-info.vue'
import AddBucketModal from './add-bucket.vue'
import SubBucketModal from './sub-bucket.vue'
import DelegateModal from './delegate.vue'
import UnboundModal from './unbound.vue'
import UndelegateModal from './undelegate.vue'

import CandidateInformationModal from '../candidates/candidate-info.vue'
import Divider from '../../../components/Divider'
import moment from 'moment'
import StakingVoteModal from '../candidates/staking-vote.vue'

export default {
  name: 'BucketsTable',
  components: {
    BucketInformationModal,
    AddBucketModal,
    SubBucketModal,
    DelegateModal,
    UnboundModal,
    UndelegateModal,
    CandidateInformationModal,
    Divider,
    StakingVoteModal,
  },

  props: {},
  data() {
    const { VUE_APP_STATUS } = process.env
    console.log('VUE_APP_STATUS', VUE_APP_STATUS)
    return {
      appStatus: VUE_APP_STATUS,
      bucketFilterSelection: 1,
      bucketFilterOptions: [
        { text: 'Staking', value: 1 },
        { text: 'Node operation', value: 2 },
      ],
      perPage: 20,
      currentPage: 1,
      filter: '',
      fields: [
        { key: 'id', sortable: true, label: 'Vote ID' },
        {
          key: 'owner',
          sortable: true,
          label: 'From',
          sortByFormatted: true,
          formatter: (value, key, item) => {
            return item.owner.substr(0, 11) + '...'
          },
        },
        { key: 'candidateName', sortable: true, label: 'To' },
        {
          key: 'totalVotes',
          sortable: true,
          // sortByFormatted: true,
          formatter: (val, key, item) => {
            return new BigNumber(item.value).div(1e18).toFormat(2)
          },
        },
        { key: 'type', sortable: true, label: 'Autobid' },
        {
          key: 'state',
          sortable: true,
          label: 'State',
          // sortByFormatted: true,
          formatter: (val, key, item) => {
            return item.unbounded ? 'Mature ' + item.matureFromNow : item.state
          },
        },
        { key: 'action', sortable: false },
      ],
      infoParams: {
        show: false,
        data: {},
      },
      addBucketParams: {
        show: false,
        data: {},
      },
      subBucketParams: {
        show: false,
        data: {},
      },
      delegateParams: {
        show: false,
        data: {},
      },
      unboundParams: {
        show: false,
        data: {},
      },
      undelegateParams: {
        show: false,
        data: {},
      },
      candidateInfoParams: {
        show: false,
        data: {},
      },
      voteParams: {
        show: false,
        data: {},
      },
    }
  },
  computed: {
    ...mapState('bucket', ['buckets', 'loading']),
    ...mapState('candidate', ['candidates']),
    ...mapState('token', ['currentNetwork']),
    ...mapState('wallet', ['account']),
    candidateNameMap() {
      let map = {}
      for (var i in this.candidates) {
        const c = this.candidates[i]
        map[c.address] = c.name
      }
      return map
    },
    computedData() {
      return this.buckets
        .filter((b) => {
          if (this.bucketFilterSelection === 1) {
            return b.owner.toLowerCase() === this.account.toLowerCase()
          } else if (this.bucketFilterSelection === 2) {
            return b.candidate.toLowerCase() === this.account.toLowerCase()
          } else {
            return false
          }
        })
        .map((b) => {
          const t = {
            ...b,
            votes: new BigNumber(b.value).div(1e18).toFormat(2) + this.currentNetwork.governanceTokenSymbol || '',
            totalVotes: '0',
            bonus: '0',
            candidateName: this.candidateNameMap[b.candidate] || '-',
            matureFromNow: b.unbounded ? moment.utc(1000 * Number(b.matureTime)).fromNow() : '',
            state: b.unbounded ? 'unbounded' : 'created',
            type: b.autobid >= 100 ? 'on' : 'off',
            owned: b.owner.toLowerCase() === this.account.toLowerCase(),
          }
          console.log(t)

          if (b.bonusVotes) {
            t.bonus =
              new BigNumber(b.bonusVotes).div(1e18).toFormat(2) + this.currentNetwork.governanceTokenSymbol || ''
          }
          if (b.totalVotes) {
            t.totalVotes =
              // new BigNumber(b.totalVotes).div(1e18).toFormat(2) + ' ' + this.currentNetwork.governanceTokenSymbol || ''
              new BigNumber(b.totalVotes).div(1e18).toNumber()
          }
          return t
        })
    },
    totalRows() {
      return this.computedData.length
    },
  },
  created() {
    // this.getBuckets()
  },
  methods: {
    ...mapActions({
      getBuckets: 'bucket/getBuckets',
    }),
    createVote() {
      this.voteParams.show = true
    },
    closeStakingVoteModal() {
      this.voteParams.show = false
    },
    ...mapActions({
      getCandidate: 'candidate/getCandidate',
    }),
    addmore(bucket) {
      this.addBucketParams.show = true
      this.addBucketParams.data = bucket
    },
    subVote(bucket) {
      this.subBucketParams.show = true
      this.subBucketParams.data = bucket
    },
    delegate(bucket) {
      this.delegateParams.show = true
      this.delegateParams.data = bucket
    },
    undelegate(bucket) {
      this.undelegateParams.show = true
      this.undelegateParams.data = bucket
    },
    info(bucket) {
      this.infoParams.show = true
      this.infoParams.data = bucket
    },
    async candidateInfo({ candidate }) {
      const data = await this.getCandidate({ address: candidate })
      this.candidateInfoParams.show = true
      this.candidateInfoParams.data = data
    },
    unbound(bucket) {
      this.unboundParams.show = true
      this.unboundParams.data = bucket
    },
    closeUnboundModal() {
      this.unboundParams.show = false
    },
    closeInfoModal() {
      this.infoParams.show = false
    },
    closeAddBucketModal() {
      this.addBucketParams.show = false
    },
    closeSubBucketModal() {
      this.subBucketParams.show = false
    },
    closeDelegateModal() {
      this.delegateParams.show = false
    },
    closeUndelegateModal() {
      this.undelegateParams.show = false
    },
    closeCandidateInfoModal() {
      this.candidateInfoParams.show = false
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