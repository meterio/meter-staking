<template>
  <div class="token-list-content container position-relative">
    <!-- top -->
    <div class="token-list w-100">
      <div class="token-list-top">
        <b-row>
          <b-col cols="12" md="9" class="d-flex align-items-center">
            <div class="token-list-top-left w-100 d-flex justify-content-between align-items-center p-2 p-md-3">
              <span class="text-capitalize font-weight-bold">{{ status }}</span>
              <div class="token-list-top-left-switch d-flex flex-column flex-sm-row">
                <div v-if="status === 'candidate'">
                  <button @click="listMeAsCandidate" type="button" class="btn btn-primary">LIST ME AS CANDIDATE</button>
                </div>
                <div v-if="status === 'bucket'" class="d-flex justify-content-between">
                  <b-form-select v-model="bucketFilterSelection" :options="bucketFilterSelections"></b-form-select>
                  <button @click="createVote" type="button" class="btn btn-primary text-nowrap ml-1">
                    CREATE VOTE
                  </button>
                </div>
              </div>
            </div>
          </b-col>
          <b-col cols="12" md="3">
            <div class="token-list-top-right px-2 p-md-3">
              <b-input v-model="searchAim" placeholder="Seach here"></b-input>
            </div>
          </b-col>
        </b-row>
      </div>

      <Divider class="mt-3 mt-md-0" />

      <!-- data table -->
      <div v-if="status === 'candidate'" class="px-1">
        <CandidatesTable :data="currentData" />
      </div>
      <div v-if="status === 'bucket'" class="px-1">
        <BucketsTable :data="currentData" />
      </div>
      <div class="pagination">
        <Pagination
          v-if="currentData.length"
          :totalRows="totalRows"
          :currentPage="currentPage"
          :perPage="perPage"
          @pageChange="pageChange"
        />
      </div>
    </div>

    <StakingCandidateModal :stakingCandidateParams="stakingCandidateParams" @close="closeStakingCandidateModal" />
    <!-- vote modal -->
    <StakingVoteModal :voteParams="voteParams" @close="closeStakingVoteModal" />
  </div>
</template>
<script>
import Divider from '@/components/Divider'
import CandidatesTable from './candidates/candidates-table.vue'
import BucketsTable from './buckets/buckets-table.vue'
import Pagination from '@/components/Pagination'
import { mapActions, mapMutations, mapState } from 'vuex'
import moment from 'moment'

import StakingCandidateModal from './candidates/staking-candidate.vue'
import StakingVoteModal from './candidates/staking-vote.vue'

export default {
  name: 'StakingBodyContainer',
  components: {
    Divider,
    CandidatesTable,
    BucketsTable,
    Pagination,
    StakingCandidateModal,
    StakingVoteModal,
  },
  computed: {
    ...mapState('candidate', ['candidates']),
    ...mapState('bucket', ['buckets']),
    ...mapState('modal', ['status']),
    ...mapState('wallet', ['account']),
    totalRows() {
      return this.filterData.length
    },
    filterData() {
      if (this.status === 'candidate') {
        return this.candidates.filter((candidate) => {
          if (this.searchAim.trim() === '') {
            return true
          } else {
            return (
              candidate.name.toLowerCase().indexOf(this.searchAim) !== -1 ||
              candidate.address.toLowerCase().indexOf(this.searchAim) !== -1
            )
          }
        })
      }

      let filteredBuckets = []
      if (this.bucketFilterSelection === 1) {
        filteredBuckets = this.buckets
          .filter((b) => String(b.owner).toLowerCase() === this.account)
          .map((b) => {
            b.owned = true
            b.candidateName = this.candidateNameMap[b.candidate] || '-'
            b.matureFromNow = b.unbounded ? moment.utc(1000 * Number(b.matureTime)).fromNow() : ''
            b.state = b.unbounded ? 'unbounded' : 'created'
            b.type = b.autobid >= 100 ? 'autobid' : 'userbid'
            return b
          })
      } else {
        filteredBuckets = this.buckets
          .filter((b) => String(b.candidate).toLowerCase() === this.account)
          .map((b) => {
            b.owned = false
            b.candidateName = this.candidateNameMap[b.candidate] || '-'
            b.matureFromNow = b.unbounded ? moment.utc(1000 * Number(b.matureTime)).fromNow() : ''
            b.state = b.unbounded ? 'unbounded' : 'valid'
            b.type = b.autobid >= 100 ? 'autobid' : 'userbid'
            return b
          })
      }
      return filteredBuckets.filter((bucket) => {
        if (this.searchAim.trim() === '') {
          return true
        } else {
          return (
            bucket.candidate.toLowerCase().indexOf(this.searchAim) !== -1 ||
            bucket.candidateName.toLowerCase().indexOf(this.searchAim) !== -1
          )
        }
      })
    },
    candidateNameMap() {
      let map = {}
      for (var i in this.candidates) {
        const c = this.candidates[i]
        map[c.address] = c.name
      }
      return map
    },
    currentData() {
      const start = (this.currentPage - 1) * this.perPage
      const end = this.perPage * this.currentPage
      if (this.status === 'candidate') {
        return this.filterData.slice(start, end)
      }
      return this.filterData.slice(start, end)
    },
  },
  watch: {
    filterData() {
      this.currentPage = 1
    },
  },
  data() {
    return {
      searchAim: '',

      currentPage: 1,
      perPage: 10,

      stakingCandidateParams: {
        show: false,
        data: {},
      },
      voteParams: {
        show: false,
        data: {},
      },

      bucketFilterSelection: 1,
      bucketFilterSelections: [
        { text: 'buckets owned by me', value: 1 },
        { text: 'buckets voted to me', value: 2 },
      ],
    }
  },
  created() {
    // this.getCandidates()
    // this.getBuckets()
  },
  methods: {
    ...mapMutations({
      setShowSendModal: 'token/setShowSendModal',
      setShowPassportModal: 'token/setShowPassportModal',
    }),
    ...mapActions({
      getCandidates: 'candidate/getCandidates',
      getBuckets: 'bucket/getBuckets',
    }),
    pageChange(page) {
      console.log('current page: ', page)
      this.currentPage = page
    },
    listMeAsCandidate() {
      this.stakingCandidateParams.show = true
    },
    closeStakingCandidateModal() {
      this.stakingCandidateParams.show = false
    },
    createVote() {
      this.voteParams.show = true
    },
    closeStakingVoteModal() {
      this.voteParams.show = false
    },
  },
}
</script>
<style lang="scss" scoped>
.token-list-content {
  top: -80px;
  .token-list {
    background-color: #fff;
    border-radius: 0.5rem;
    box-shadow: 0 10px 20px rgb(0 0 0 / 12%), 0 1px 4px rgb(0 0 0 / 8%);
    .token-list-top {
      .token-list-top-right {
        input {
          box-shadow: 0 1px 4px rgb(0 0 0 / 8%);
          border-radius: 8px;
        }
      }
    }
  }
}
::v-deep .custom-control {
  z-index: 0;
}
</style>