<template>
  <div class="data-table-content">
    <div v-if="getCandidatesloading" class="d-flex justify-content-center py-5">
      <div class="spinner-border" role="status">
        <span class="sr-only">Loading...</span>
      </div>
    </div>
    <table v-else-if="data.length" class="table table-hover table-responsive-sm table-font-size">
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
        <tr v-for="(item, i) in computedData" :key="item.address">
          <td>
            <a class="text-myprimary-color opt-btn" @click="info(item)">{{ item.name }}</a>
          </td>
          <td>{{ item._address }}</td>
          <td>{{ item.ipAddr }}</td>
          <td>{{ item._commission }}</td>
          <td>{{ item.totalVotes }}</td>
          <td>{{ item.bucketsLen }}</td>
          <td>
            <div class="token-operation text-myprimary-color font-weight-bold">
              <b-button :id="'actions' + i" variant="primary" class="font-weight-bold py-0 px-2" size="small"
                >···</b-button
              >
              <b-popover :target="'actions' + i" triggers="hover">
                <a class="opt-btn d-block font-weight-bold" @click="vote(item)">VOTE</a>
                <a v-if="item.owned" class="opt-btn d-block font-weight-bold" @click="update(item)">UPDATE</a>
                <a v-if="item.owned" class="opt-btn d-block font-weight-bold" @click="uncandidate(item)">UNCANDIDATE</a>
              </b-popover>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
    <span class="d-flex justify-content-center font-weight-bold py-5" v-else>NO DATA</span>

    <!-- vote modal -->
    <StakingVoteModal :voteParams="voteParams" @close="closeStakingVoteModal" />
    <!-- candidate information modal -->
    <CandidateInformationModal :infoParams="infoParams" @close="closeInfoModal" />
    <!-- candidate update -->
    <CandidateUpdateModal :updateCandidateParams="updateCandidateParams" @close="closeUpdateCandidateModal" />
    <!-- uncandidate -->
    <UncandidateModal :uncandidateParams="uncandidateParams" @close="closeUncandidateModal" />
  </div>
</template>
<script>
import { mapState } from 'vuex'
import { BigNumber } from 'bignumber.js'
import StakingVoteModal from './staking-vote.vue'
import CandidateInformationModal from './candidate-info.vue'
import CandidateUpdateModal from './candidate-update.vue'
import UncandidateModal from './uncandidate.vue'

export default {
  name: 'CadidatesTable',
  components: {
    StakingVoteModal,
    CandidateInformationModal,
    CandidateUpdateModal,
    UncandidateModal,
  },
  props: {
    data: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
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
    }
  },
  computed: {
    ...mapState('candidate', ['getCandidatesloading']),
    ...mapState('wallet', ['account']),
    computedData() {
      return this.data.map((c) => {
        return {
          ...c,
          _address: c.address.substr(0, 11) + '...',
          bucketsLen: c.buckets.length,
          totalVotes: new BigNumber(c.totalVotes).div(1e18).toFormat(2) + 'MTRG',
          _commission: c.commission / 1e7 + '%',

          owned: String(c.address).toLowerCase() === this.account,
        }
      })
    },
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