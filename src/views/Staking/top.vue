<template>
  <div class="top-content bg-myprimary-color">
    <b-container>
      <div class="amount-content mt-4">
        <b-row>
          <b-col md="6" class="d-flex flex-wrap justify-content-between">
            <div v-for="(item, index) in computedBalance" :key="index">
              <div class="symbol-label text-right">{{ item.symbol }}</div>
              <div class="balance-label">{{ item.balance }}</div>
            </div>
          </b-col>
          <b-col md="6" class="d-flex flex-wrap justify-content-md-end justify-content-between my-3">
            <b-button class="d-flex align-items-center my-1 my-md-0" :variant="status === 'candidate' ? 'mylight' : 'myprimary'" @click="candidate">
              <b-icon icon="people-fill" scale="0.7"></b-icon>
              <span class="font-weight-bold">Candidates</span>
            </b-button>
            <div class="mx-md-2"></div>
            <b-button class="d-flex align-items-center my-1 my-md-0" :variant="status === 'vote' ? 'mylight' : 'myprimary'" @click="bucket">
              <b-icon icon="lock-fill" scale="0.7"></b-icon>
              <span class="font-weight-bold">Votes</span>
            </b-button>
            <div class="mx-md-2"></div>
            <b-button v-if="showAuction" class="d-flex align-items-center my-1 my-md-0" :variant="status === 'auction' ? 'mylight' : 'myprimary'" @click="auction">
              <b-icon icon="hourglass-split" scale="0.7"></b-icon>
              <span class="font-weight-bold">Auction</span>
            </b-button>
            <div class="mx-md-2"></div>
            <b-button class="d-flex align-items-center my-1 my-md-0" :variant="status === 'liquid' ? 'mylight' : 'myprimary'" @click="liquid">
              <b-icon icon="bounding-box" scale="0.7"></b-icon>
              <span class="font-weight-bold">Liquid</span>
            </b-button>
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
  name: 'WalletTop',
  computed: {
    ...mapState('token', ['balances', 'currentNetwork', 'metrics']),
    ...mapState('modal', ['status']),
    computedBalance() {
      const data = [
        // {
        //   balance: new BigNumber(this.balances.native).toFormat(2),
        //   symbol: this.currentNetwork.nativeTokenSymbol || '',
        // },
        {
          balance: new BigNumber(this.balances.energy || 0).toFormat(2),
          symbol: this.currentNetwork.governanceTokenSymbol || 'MTRG',
        },
        {
          balance: new BigNumber(this.balances.bound || 0).toFormat(2),
          symbol: `Locked ${this.currentNetwork.governanceTokenSymbol || 'MTRG'}`,
        },
      ]
      if (this.status === 'liquid') {
        data.push({
          // （APY/365*0.9+1)^365-1
          balance: new BigNumber(this.metrics.staking.stakingAPY).div(365).times(0.9).plus(1).pow(365).minus(1).times(100).toFormat(2) + '%',
          symbol: 'Liquid Staking APY'
        })
      } else {
        data.push({
          balance: new BigNumber(this.metrics.staking.stakingAPY).times(100).toFormat(2) + '%',
          symbol: 'Staking APY'
        })
      }
      return data
    },
    showAuction() {
      if ([72].includes(this.currentNetwork.networkId)) {
        return false
      }
      return true
    }
  },
  mounted() {
    const keys = Object.keys(this.$route.query)
    if (keys.includes('candidate')) {
      this.setCandidateAddr(this.$route.query['candidate'])
    }
  },
  methods: {
    ...mapMutations({
      setStatus: 'modal/setStatus',
      setCandidateAddr: 'modal/setCandidateAddr',
    }),
    candidate() {
      this.setStatus('candidate')
    },
    bucket() {
      this.setStatus('vote')
    },
    auction() {
      this.setStatus('auction')
    },
    liquid() {
      this.setStatus('liquid')
    }
  },
}
</script>
<style lang="scss" scoped>
.top-content {
  margin-top: 10px;
  margin-bottom: 10px;
  padding: 80px 0px;
  .current-network-name {
    color: hsla(0, 0%, 100%, 0.6);
  }
  .symbol-label {
    color: hsla(0, 0%, 100%, 0.6);
  }
  .balance-label {
    font-size: 30px;
    font-weight: bold;
    color: #fff;
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
      &.btn-color {
        background-color: white;
      }
    }
  }
}
</style>