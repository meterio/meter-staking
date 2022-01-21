<template>
  <div class="top-content bg-myprimary-color">
    <b-container>
      <div class="amount-content mt-4">
        <b-row>
          <b-col md="8">
            <div class="amount font-weight-bold">
              <span v-for="(item, index) in computedBalance" :key="index">{{ item.balance}} <span class="token-symbol">{{ item.symbol }}</span></span>
            </div>
          </b-col>
          <b-col md="4" class="d-flex align-items-center">
            <div class="w-100 d-flex justify-content-md-end justify-content-between mb-2">
              <b-button :class="{'btn-color': status === 'candidate'}" class="font-normal-size btn-md-49-percent" variant="mylight" size="lg" @click="candidate">
                <b-icon icon="people-fill"></b-icon>
                <span class="ml-1 font-weight-bold">Candidates</span>
              </b-button>
              <div class="mx-md-3"></div>
              <b-button :class="{'btn-color': status === 'vote'}" class="font-normal-size btn-md-49-percent" variant="mylight" size="lg" @click="bucket">
                <b-icon icon="lock-fill"></b-icon>
                <span class="ml-1 font-weight-bold">Staking</span>
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
    ...mapState('token', ['balances', 'currentNetwork']),
    ...mapState('modal', ['status']),
    computedBalance() {
      return [
        {
          balance: new BigNumber(this.balances.native).toFormat(2),
          symbol: this.currentNetwork.nativeTokenSymbol || ''
        },
        {
          balance: new BigNumber(this.balances.energy).toFormat(2),
          symbol: this.currentNetwork.governanceTokenSymbol || ''
        },
        {
          balance: new BigNumber(this.balances.bound).toFormat(2),
          symbol: 'Locked ' + this.currentNetwork.governanceTokenSymbol || ''
        }
      ]
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
      this.setStatus('vote')
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
        font-size: 30px;
        color: #fff;
        .token-symbol {
          color: lightgray;
          font-size: 20px;
          font-weight: normal;
        }
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