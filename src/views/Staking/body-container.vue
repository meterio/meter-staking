<template>
  <div class="token-list-content container position-relative">
    <!-- top -->
    <div class="token-list pt-2">
      <!-- data table -->
      <div class="px-1">
        <div v-if="status === 'candidate'">
          <CandidatesTable />
        </div>
        <div v-if="status === 'vote'">
          <BucketsTable />
        </div>
        <div v-if="status === 'bailout'">
          <BailOutTable />
        </div>
        <div v-if="status === 'auction'">
          <AuctionTable />
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Divider from '@/components/Divider'
import CandidatesTable from './candidates/candidates-table.vue'
import BucketsTable from './buckets/buckets-table.vue'
import BailOutTable from './bailout/bailout-table.vue'
import AuctionTable from './auction/auction-table.vue'
import Pagination from '@/components/Pagination'
import { mapActions, mapMutations, mapState } from 'vuex'
import moment from 'moment'

export default {
  name: 'StakingBodyContainer',
  components: {
    Divider,
    CandidatesTable,
    BucketsTable,
    BailOutTable,
    AuctionTable,
    Pagination,
  },
  computed: {
    ...mapState('candidate', ['candidates']),
    ...mapState('bucket', ['buckets']),
    ...mapState('modal', ['status']),
    ...mapState('wallet', ['account']),
    totalRows() {
      return this.filterData.length
    },
    name() {
      switch (this.status) {
        case 'candidate':
          return 'Candidates'
        case 'vote':
          return 'Votes'
        case 'bailout':
          return 'Bail Out'
        case 'auction':
          return 'Present Auction'
        default:
          return ''
      }
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

      if (this.status === 'vote') {
        let filteredBuckets = []
        if (this.bucketFilterSelection === 1) {
          filteredBuckets = this.buckets
            .filter((b) => String(b.owner).toLowerCase() === this.account)
            .map((b) => {
              b.owned = true
              b.candidateName = this.candidateNameMap[b.candidate] || '-'
              b.matureFromNow = b.unbounded ? moment.utc(1000 * Number(b.matureTime)).fromNow() : ''
              b.state = b.unbounded ? 'unbounded' : 'created'
              b.type = b.autobid >= 100 ? 'on' : 'off'
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
              b.type = b.autobid >= 100 ? 'on' : 'off'
              return b
            })
        }
        return filteredBuckets.filter((bucket) => {
          if (this.searchAim.trim() === '') {
            return true
          } else {
            return (
              bucket.candidate.toLowerCase().indexOf(this.searchAim) !== -1 ||
              bucket.candidateName.toLowerCase().indexOf(this.searchAim) !== -1 ||
              bucket.id.toLowerCase().indexOf(this.searchAim) !== -1
            )
          }
        })
      }

      return []
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
      if (this.status === 'vote') {
        return this.filterData.slice(start, end)
      }

      return []
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