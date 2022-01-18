<template>
  <div class="data-table-content">
    <div v-if="loading" class="d-flex justify-content-center py-5">
      <div class="spinner-border" role="status">
        <span class="sr-only">Loading...</span>
      </div>
    </div>
    <table v-else-if="data.length" class="table table-hover table-responsive-sm table-font-size">
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
        <tr v-for="(item, i) in computedData" :key="item.address">
          <td>
            <a class="text-myprimary-color opt-btn" @click="info(item)">{{ item._id }}</a>
          </td>
          <td>{{ item._owner }}</td>
          <td>{{ item._candidate }}</td>
          <td>{{ item.candidateName }}</td>
          <td>{{ item.totalVotes }}</td>
          <td>{{ item.type }}</td>
          <td>{{ item.unbounded ? 'Mature ' + item.matureFromNow : item.state }}</td>
          <td>
            <div class="token-operation text-myprimary-color font-weight-bold">
              <b-button :id="'actions' + i" variant="primary" class="font-weight-bold py-0 px-2" size="small"
                >···</b-button
              >
              <b-popover :target="'actions' + i" triggers="hover">
                <a v-if="item.owned" class="opt-btn d-block font-weight-bold" @click="unbound(item)">UNBOUND</a>
                <a class="opt-btn d-block font-weight-bold" @click="delegate(item)">DELEGATE</a>
                <a class="opt-btn d-block font-weight-bold" @click="addmore(item)">ADD MORE</a>
              </b-popover>
              <!-- <a class="opt-btn" @click="bucketOperations(item)">
                {{
                  item.candidate === '0x0000000000000000000000000000000000000000' ? 'delegate' : 'add more'
                }}
              </a> -->
            </div>
          </td>
        </tr>
      </tbody>
    </table>
    <span class="d-flex justify-content-center font-weight-bold py-5" v-else>NO DATA</span>

    <BucketInformationModal :infoParams="infoParams" @close="closeInfoModal" />
    <UpdateBucketModal :bucketParams="bucketParams" @close="closeUpdateModal" />
    <DelegateModal :bucketParams="delegateParams" @close="closeDelegateModal" />
    <UnboundModal :unboundParams="unboundParams" @close="closeUnboundModal" />
  </div>
</template>
<script>
import { mapState } from 'vuex'
import { BigNumber } from 'bignumber.js'

import BucketInformationModal from './bucket-info.vue'
import UpdateBucketModal from './update-bucket.vue'
import DelegateModal from './delegate.vue'
import UnboundModal from './unbound.vue'

export default {
  name: 'BucketsTable',
  components: {
    BucketInformationModal,
    UpdateBucketModal,
    DelegateModal,
    UnboundModal,
  },
  props: {
    data: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      infoParams: {
        show: false,
        data: {},
      },
      bucketParams: {
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
    }
  },
  computed: {
    ...mapState('bucket', ['loading']),
    ...mapState('wallet', ['account']),
    computedData() {
      return this.data.map((b) => {
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
          t.bonus = new BigNumber(b.bonusVotes).div(1e18).toFormat(2) + 'MTRG'
        }
        if (b.totalVotes) {
          t.totalVotes = new BigNumber(b.totalVotes).div(1e18).toFormat(2) + 'MTRG'
        }
        return t
      })
    },
  },
  methods: {
    // bucketOperations(bucket) {
    //   if (bucket.candidate === '0x0000000000000000000000000000000000000000') {
    //     this.delegate(bucket)
    //   } else {
    //     this.addMore(bucket)
    //   }
    // },
    addmore(bucket) {
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
    closeUpdateModal() {
      this.bucketParams.show = false
    },
    closeDelegateModal() {
      this.delegateParams.show = false
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