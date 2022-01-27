<template>
  <div class="data-table-content">
    <div v-if="getAuctionsloading" class="d-flex justify-content-center py-5">
      <div class="spinner-border" role="status">
        <span class="sr-only">Loading...</span>
      </div>
    </div>
    <section v-else-if="computedData" class="d-flex justify-content-center">
      <b-card :style="{width: '500px'}" class="m-3">
        <b-card-text>
          <div class="section">
            <div class="name">MTRG on Auction</div>
            <div class="content">{{ computedData._releasedMTRG }}</div>
          </div>
          <div class="section">
            <div class="name">Received bids</div>
            <div class="content">{{ computedData._receivedMTR }}</div>
          </div>
          <div class="section">
            <div class="name">Estimate Price</div>
            <div class="content">{{ estimatePrice }}</div>
          </div>
          <div class="section">
            <div class="name">Epoch Range</div>
            <div class="content">{{ computedData.endEpoch }} - {{ computedData.endEpoch + 24 }}</div>
          </div>
          <div class="section">
            <div class="name">Current Epoch</div>
            <div class="content">{{ best.epoch }}</div>
          </div>
          <div class="section">
            <div class="name">Est. End Time</div>
            <div class="content">{{ leftoverEpoch }} hour{{ leftoverEpoch > 1 ? "s" : "" }}</div>
          </div>
        </b-card-text>

        <b-button class="w-100" variant="primary" @click="auctionBid">auction bid</b-button>
      </b-card>
    </section>
    <span class="d-flex justify-content-center font-weight-bold py-5" v-else>No jailed information found associated with this wallet</span>
    <AuctionBidModal :auctionBidParams="auctionBidParams" @close="closeAuctionBidModal" />
  </div>
</template>
<script>
import { mapActions, mapState } from 'vuex'
import { BigNumber } from 'bignumber.js'
import moment from 'moment'
import { ScriptEngine } from '@meterio/devkit'

import AuctionBidModal from './auction-bid.vue'

export default {
  name: 'AuctionTable',
  components: {
    AuctionBidModal
  },
  data() {
    return {
      auctionBidParams: {
        data: {},
        show: false
      }
    }
  },
  computed: {
    ...mapState('auction', ['getAuctionsloading', 'auctions', 'best']),
    ...mapState('wallet', ['account']),
    ...mapState('token', ['currentNetwork']),
    computedData() {
      return {
        name: 'auction',
        auctionID: this.auctions.auctionID,
        startHeight: this.auctions.startHeight,
        startEpoch: this.auctions.startEpoch,
        endHeight: this.auctions.endHeight,
        endEpoch: this.auctions.endEpoch,
        sequence: this.auctions.sequence,
        releasedMTRG: this.auctions.releasedMTRG,
        _releasedMTRG: new BigNumber(this.auctions.releasedMTRG).div(1e18).toFormat() + ' MTRG',
        reservedMTRG: this.auctions.reservedMTRG,
        reservedPrice: this.auctions.reservedPrice,
        createTime: this.auctions.createTime,
        receivedMTR: this.auctions.receivedMTR,
        _receivedMTR: new BigNumber(this.auctions.receivedMTR).div(1e18).toFormat() + ' MTR',
      }
    },
    estimatePrice() {
      return new BigNumber(this.computedData.receivedMTR).div(this.computedData.releasedMTRG).toFormat() + ' MTR'
    },
    leftoverEpoch() {
      return this.computedData.endEpoch + 24 - this.best.epoch;
    }
  },
  created() {
    this.getAuctions()
    this.getBest()
  },
  methods: {
    ...mapActions({
      getAuctions: 'auction/getAuctions',
      getBest: 'auction/getBest'
    }),
    auctionBid() {
      this.auctionBidParams.show = true
      this.auctionBidParams.data = { ...this.computedData }
    },
    closeAuctionBidModal() {
      this.auctionBidParams.show = false
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