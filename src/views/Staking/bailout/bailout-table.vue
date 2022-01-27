<template>
  <div class="data-table-content">
    <div v-if="getJailedsloading" class="d-flex justify-content-center py-5">
      <div class="spinner-border" role="status">
        <span class="sr-only">Loading...</span>
      </div>
    </div>
    <section v-else-if="computedData" class="d-flex justify-content-center">
      <b-card :style="{width: '500px'}" class="m-3">
        <b-card-text>
          <div class="section">
            <div class="name">Name</div>
            <div class="content">{{ computedData.name }}</div>
          </div>
          <div class="section">
            <div class="name">Public Key</div>
            <div class="content">{{ computedData.pubKey }}</div>
          </div>
          <div class="section">
            <div class="name">Total Points</div>
            <div class="content">{{ computedData.totalPoints }}</div>
          </div>
          <div class="section">
            <div class="name">Bail Amount</div>
            <div class="content">{{ computedData._bailAmount }}</div>
          </div>
          <div class="section">
            <div class="name">Jailed Time</div>
            <div class="content">{{ computedData._jailedTime }}</div>
          </div>
        </b-card-text>

        <b-button class="w-100" variant="primary" @click="bailOut">Submit</b-button>
      </b-card>
    </section>
    <span class="d-flex justify-content-center font-weight-bold py-5" v-else>No jailed information found associated with this wallet</span>
    <BailOutLoading :bailOutParams="bailOutParams" />
  </div>
</template>
<script>
import { mapActions, mapState } from 'vuex'
import { BigNumber } from 'bignumber.js'
import moment from 'moment'
import { ScriptEngine } from '@meterio/devkit'

import BailOutLoading from './bailout-loading.vue'

export default {
  name: 'BailOutTable',
  components: {
    BailOutLoading
  },
  data() {
    return {
      bailOutParams: {
        data: {},
      }
    }
  },
  computed: {
    ...mapState('bailout', ['getJailedsloading', 'jaileds']),
    ...mapState('wallet', ['account']),
    ...mapState('token', ['currentNetwork']),
    computedData() {
      const myJailed = this.jaileds.find(j => j.address === '0x6c814a9176922f462f0d21dcb512693212ca5a88')
      if (!myJailed) {
        return null
      }
      return {
        ...myJailed,
        _bailAmount: new BigNumber(myJailed.bailAmount).div(1e18).toFormat(),
        _jailedTime: moment.utc(1000 * Number(myJailed.jailedTime)).fromNow() + '(' + new Date(myJailed.jailedTime * 10e2).toLocaleString() + ')'
      }
    },
  },
  created() {
    this.getJaileds()
  },
  methods: {
    ...mapActions({
      getJaileds: 'bailout/getJaileds',
      bailOutAction: 'bailout/bailOut'
    }),
    bailOut() {
      this.bailOutParams.data.name = this.computedData.name
      const dataBuffer = ScriptEngine.getBailOutData(this.account);
      const scriptData = '0x' + dataBuffer.toString('hex')
      this.bailOutAction({ name: this.computedData.name, data: scriptData })
    },
    vote(candidate) {
      this.voteParams.show = true
      this.voteParams.data = candidate
    },
    closeStakingVoteModal() {
      this.voteParams.show = false
    }
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