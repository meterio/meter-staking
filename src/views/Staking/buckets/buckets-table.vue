<template>
  <div class="data-table-content">
    <div v-if="loading" class="d-flex justify-content-center py-5">
      <div class="spinner-border" role="status">
        <span class="sr-only">Loading...</span>
      </div>
    </div>
    <table v-else class="table table-hover table-responsive-sm table-font-size">
      <thead>
        <tr>
          <th scope="col">Bucket ID</th>
          <th scope="col">Owner Address</th>
          <th scope="col">Candidate Address</th>
          <th scope="col">Name</th>
          <th scope="col">Total Votes</th>
          <th scope="col">Type</th>
          <th scope="col">State</th>
          <th scope="col">Action</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in computedData" :key="item.address">
          <td><a class="text-myprimary-color opt-btn" @click="info(item)">{{ item._id }}</a></td>
          <td>{{ item._owner }}</td>
          <td>{{ item._candidate }}</td>
          <td>{{ item.candidateName }}</td>
          <td>{{ item.totalVotes }}</td>
          <td>{{ item.type }}</td>
          <td>{{ item.unbounded ? "Mature " + item.matureFromNow : item.state }}</td>
          <td>
            <div class="token-operation text-myprimary-color font-weight-bold">
              <a class="opt-btn" @click="bucketOperations(item)">
                {{
                  item.candidate === '0x0000000000000000000000000000000000000000' ? 'delegate' : 'add more'
                }}
              </a>
            </div>
          </td>
        </tr>
      </tbody>
    </table>

    <BucketInformationModal :infoParams="infoParams" @close="closeInfoModal" />
    <UpdateBucketModal :bucketParams="bucketParams" @close="closeUpdateModal" />
    <DelegateModal :bucketParams="delegateParams" @close="closeDelegateModal" />
  </div>
</template>
<script>
import { mapState } from 'vuex'
import { BigNumber } from 'bignumber.js'

import BucketInformationModal from './bucket-info.vue'
import UpdateBucketModal from './update-bucket.vue'
import DelegateModal from './delegate.vue'

export default {
  name: "BucketsTable",
  components: {
    BucketInformationModal,
    UpdateBucketModal,
    DelegateModal
  },
  props: {
    data: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      infoParams: {
        show: false,
        data: {}
      },
      bucketParams: {
        show: false,
        data: {}
      },
      delegateParams: {
        show: false,
        data: {}
      }
    }
  },
  computed: {
    ...mapState('bucket', ['loading']),
    computedData() {
      return this.data.map(b => {
        const t = {
          ...b,
          _id: b.id.substr(0, 11) + '...',
          _owner: b.owner.substr(0, 11) + '...',
          _candidate: b.candidate.substr(0, 11) + '...',
          votes: new BigNumber(b.value).div(1e18).toFormat(2) + 'MTRG',
          totalVotes: '0',
          bonus: '0',
        }

        if (b.bonusVotes) {
          t.bonus = new BigNumber(b.bonusVotes).div(1e18).toFormat(2) + 'MTRG';
        }
        if (b.totalVotes) {
          t.totalVotes = new BigNumber(b.totalVotes).div(1e18).toFormat(2) + 'MTRG';
        }
        return t
      })
    }
  },
  methods: {
    bucketOperations(bucket) {
      if (bucket.candidate === '0x0000000000000000000000000000000000000000') {
        this.delegate(bucket)
      } else {
        this.addMore(bucket)
      }
    },
    addMore(bucket) {
      this.bucketParams.show = true
      this.bucketParams.data = bucket
    },
    delegate(bucket) {
      this.delegateParams.show = true
      this.delegateParams.data = bucket
    },
    info(bucket) {
      this.infoParams.show = true
      this.infoParams.data = bucket
    },
    closeInfoModal() {
      this.infoParams.show = false
    },
    closeUpdateModal() {
      this.bucketParams.show = false
    },
    closeDelegateModal() {
      this.delegateParams.show = false
    }
  }
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