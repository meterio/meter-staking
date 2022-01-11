<template>
  <div class="data-table-content">
    <div v-if="getCandidatesloading" class="d-flex justify-content-center py-5">
      <div class="spinner-border" role="status">
        <span class="sr-only">Loading...</span>
      </div>
    </div>
    <table v-else class="table table-hover table-responsive-sm table-font-size">
      <thead>
        <tr>
          <th>Name</th>
          <th scope="col">Wallet Address</th>
          <th scope="col">IP</th>
          <th scope="col">Commission</th>
          <th scope="col">Total Votes</th>
          <th scope="col">nBkt</th>
          <th scope="col">Action</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in computedData" :key="item.address">
          <td><a class="text-myprimary-color opt-btn" @click="info(item)">{{ item.name }}</a></td>
          <td>{{ item._address }}</td>
          <td>{{ item.ipAddr }}</td>
          <td>{{ item.commission }}</td>
          <td>{{ item.totalVotes }}</td>
          <td>{{ item.bucketsLen }}</td>
          <td>
            <div class="token-operation text-myprimary-color font-weight-bold">
              <a class="opt-btn" @click="vote(item)">VOTE</a>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
    <!-- vote modal -->
    <StakingVoteModal :voteParams="voteParams" @close="closeStakingVoteModal" />
    <!-- candidate information modal -->
    <CandidateInformationModal :infoParams="infoParams" @close="closeInfoModal" />
  </div>
</template>
<script>
import { mapState } from 'vuex'
import { BigNumber } from 'bignumber.js'
import StakingVoteModal from './staking-vote.vue'
import CandidateInformationModal from './candidate-info.vue'

export default {
  name: "CadidatesTable",
  components: {
    StakingVoteModal,
    CandidateInformationModal
  },
  props: {
    data: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      voteParams: {
        show: false,
        data: {}
      },
      infoParams: {
        show: false,
        data: {}
      }
    }
  },
  computed: {
    ...mapState('candidate', ['getCandidatesloading']),
    computedData() {
      return this.data.map(c => {
        return {
          ...c,
          _address: c.address.substr(0, 11) + '...',
          bucketsLen: c.buckets.length,
          totalVotes: new BigNumber(c.totalVotes).div(1e18).toFormat(2) + 'MTRG',
          commission: c.commission/1e7 + '%',

          owned: false
        }
      })
    }
  },
  methods: {
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