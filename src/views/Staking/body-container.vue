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
        <div v-if="status === 'auction'">
          <AuctionTable />
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import CandidatesTable from './candidates/candidates-table.vue'
import BucketsTable from './buckets/buckets-table.vue'
import AuctionTable from './auction/auction-table.vue'
import { mapState } from 'vuex'

export default {
  name: 'StakingBodyContainer',
  components: {
    CandidatesTable,
    BucketsTable,
    AuctionTable,
  },
  computed: {
    ...mapState('modal', ['status'])
  }
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