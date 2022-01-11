<template>
  <div class="top-content bg-myprimary-color">
    <b-container>
      <div class="amount-content mt-4">
        <b-row>
          <b-col md="6">
            <div class="amount font-weight-bold">{{ computedBalance }}</div>
          </b-col>
          <b-col md="6" class="d-flex align-items-center">
            <div class="w-100 d-flex justify-content-md-end justify-content-between mb-2">
              <b-button :class="{'btn-color': status === 'candidate'}" class="font-normal-size btn-md-49-percent" variant="mylight" size="lg" @click="candidate">
                <b-icon icon="people-fill"></b-icon>
                <span class="ml-1">Candidates</span>
              </b-button>
              <div class="mx-md-3"></div>
              <b-button :class="{'btn-color': status === 'bucket'}" class="font-normal-size btn-md-49-percent" variant="mylight" size="lg" @click="bucket">
                <b-icon icon="lock-fill"></b-icon>
                <span class="ml-1">Staking</span>
              </b-button>
            </div>
          </b-col>
        </b-row>
      </div>
    </b-container>
  </div>
</template>
<script>
import { mapMutations, mapState } from 'vuex'
import { BigNumber } from 'bignumber.js'
export default {
  name: "WalletTop",
  computed: {
    ...mapState('token', ['MTRGBalance']),
    ...mapState('wallet', ['balance']),
    ...mapState('modal', ['status']),
    computedMTRBalance() {
      let v = new BigNumber(0)
      if (this.balance) {
        v = new BigNumber(this.balance).div(1e18)
      }

      return v.toFormat(2) + 'MTR'
    },
    computedMTRGBalance() {
      let v = new BigNumber(0)
      console.log('mtrg balance', this.MTRGBalance)
      if (this.MTRGBalance) {
        v = new BigNumber(this.MTRGBalance)
      }

      return v.toFormat(2) + 'MTRG'
    },
    computedBalance() {
      return this.computedMTRBalance + '/' + this.computedMTRGBalance
    }
  },
  methods: {
    ...mapMutations({
      setStatus: 'modal/setStatus'
    }),
    candidate() {
      this.setStatus('candidate')
    },
    bucket() {
      this.setStatus('bucket')
    }
  }
}
</script>
<style lang="scss" scoped>
  .top-content {
    margin-top: 80px;
    padding: 80px 0px;
    .current-network-name {
      color: hsla(0,0%,100%,.6);
    }
    .amount-content {
      .amount {
        font-size: 40px;
        color: #fff;
      }
      ::v-deep .btn {
        width: 120px;
        &.btn-color {
          color: #003cb2
        }
      }
    }
  }
</style>