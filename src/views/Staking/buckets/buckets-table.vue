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
          <td>{{ item.id }}</td>
          <td>{{ item.owner }}</td>
          <td>{{ item.candidate }}</td>
          <td>{{ item.candidateName }}</td>
          <td>{{ item.totalVotes }}</td>
          <td>{{ item.type }}</td>
          <td>{{ item.state }}</td>
          <td>
            <div class="token-operation text-myprimary-color font-weight-bold">
              <a class="opt-btn" @click="delegate">delegate</a>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
<script>
import { mapState } from 'vuex'
import { BigNumber } from 'bignumber.js'

export default {
  name: "BucketsTable",
  props: {
    data: {
      type: Array,
      required: true
    }
  },
  computed: {
    ...mapState('bucket', ['loading']),
    computedData() {
      return this.data.map(b => {
        const t = {
          id: b.id.substr(0, 11) + '...',
          owner: b.owner.substr(0, 11) + '...',
          candidate: b.candidate.substr(0, 11) + '...',
          votes: new BigNumber(b.value).div(1e18).toFormat(2) + 'MTRG',
          totalVotes: '0',
          bonus: '0',

          owned: false,
          candidateName: "",
          matureFromNow: "",
          state: ""
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
    delegate() {}
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