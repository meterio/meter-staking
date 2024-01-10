<template>
  <div class="top-content bg-myprimary-color">
    <b-container>
      <div class="amount-content mb-4">
        <section class="d-flex justify-content-around font-small-size">
          <div class="text-center">
            <div class="symbol-label">{{ computedBalance[0].symbol }}</div>
            <div class="balance-label">{{ computedBalance[0].balance }}</div>
          </div>
          <divider vertical color="rgba(255, 255, 255, .3)" />
          <div class="text-center">
            <div class="symbol-label">{{ computedBalance[1].symbol }}</div>
            <div class="balance-label">{{ computedBalance[1].balance }}</div>
          </div>
          <divider vertical color="rgba(255, 255, 255, .3)" />
          <div class="text-center">
            <div class="symbol-label">{{ computedBalance[2].symbol }}</div>
            <div class="balance-label">{{ computedBalance[2].balance }}</div>
          </div>
        </section>
        <section class="d-flex justify-content-between mt-2">
          <b-button class="d-flex my-1 pl-0 pr-2 rounded-xlg" :variant="status === 'candidate' ? 'mylight' : 'myprimary'" @click="candidate">
            <b-icon icon="people-fill" scale="0.5"></b-icon>
            <span class="font-small-size">Candidates</span>
          </b-button>
          <b-button class="d-flex my-1 pl-0 pr-2 rounded-xlg" :variant="status === 'vote' ? 'mylight' : 'myprimary'" @click="bucket">
            <b-icon icon="lock-fill" scale="0.5"></b-icon>
            <span class="font-small-size">Votes</span>
          </b-button>
          <b-button class="d-flex my-1 pl-0 pr-2 rounded-xlg" :variant="status === 'auction' ? 'mylight' : 'myprimary'" @click="auction">
            <b-icon icon="hourglass-split" scale="0.5"></b-icon>
            <span class="font-small-size">Auction</span>
          </b-button>
          <b-button class="d-flex my-1 pl-0 pr-2 rounded-xlg" :variant="status === 'liquid' ? 'mylight' : 'myprimary'" @click="liquid">
            <b-icon icon="bounding-box" scale="0.5"></b-icon>
            <span class="font-small-size">Liquid</span>
          </b-button>
        </section>
      </div>
    </b-container>
  </div>
</template>
<script>
import { mapMutations, mapState } from 'vuex'
import { BigNumber } from 'bignumber.js'
export default {
  name: 'WalletMobileTop',
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
          balance: new BigNumber(this.balances.energy).toFormat(2),
          symbol: this.currentNetwork.governanceTokenSymbol || '',
        },
        {
          balance: new BigNumber(this.balances.bound).toFormat(2),
          symbol: 'Locked ' + this.currentNetwork.governanceTokenSymbol || '',
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
  margin-bottom: 42px;
  padding: 80px 0px 40px 0;
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
      font-size: 28px;
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