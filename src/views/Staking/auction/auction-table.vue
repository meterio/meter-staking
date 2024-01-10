<template>
  <div class="data-table-content">
    <section v-if="!isMobile" class="bg-white-color border rounded-lg card-shadow">
      <b-row class="p-3">
        <b-col>
          <div class="d-flex justify-space-between">
            <b-button variant="myprimary" @click="auctionBid" class="ml-2"><b-icon icon="plus" />New Bid</b-button>
          </div>
        </b-col>
      </b-row>
      <div v-if="getAuctionsloading" class="d-flex justify-content-center py-5">
        <div class="spinner-border" role="status">
          <span class="sr-only">Loading...</span>
        </div>
      </div>
      <b-row v-else class="p-2 px-4">
        <b-col md="3" class="p-3">
          <div class="fact-card">
            <div class="name">My Total Bids (MTR)</div>
            <div class="value primary">{{ myBidsTotal }}</div>
          </div>
        </b-col>
        <b-col md="3" class="p-3">
          <div class="fact-card">
            <div class="name">My Est. Gain (MTRG)</div>
            <div class="value primary">{{ myEstMTRGTotal }}</div>
          </div>
        </b-col>

        <b-col md="3" class="p-3">
          <div class="fact-card">
            <div class="name">Est. Price</div>
            <div class="value">{{ estimatePrice }}</div>
          </div>
        </b-col>
        <b-col md="3" class="p-3">
          <div class="fact-card">
            <div class="name">Ends In</div>
            <div class="value">{{ leftoverEpoch }} hour{{ leftoverEpoch > 1 ? 's' : '' }}</div>
          </div>
        </b-col>
        <b-col md="3" class="p-3">
          <div class="fact-card">
            <div class="name">MTRG on Auction</div>
            <div class="value">{{ computedData._releasedMTRG }}</div>
          </div>
        </b-col>
        <b-col md="3" class="p-3">
          <div class="fact-card">
            <div class="name">Received Bids (MTR)</div>
            <div class="value">{{ computedData._receivedMTR }}</div>
          </div>
        </b-col>
        <b-col md="3" class="p-3">
          <div class="fact-card">
            <div class="name">Auction Epoch Range</div>
            <div class="value">{{ computedData.endEpoch }} - {{ computedData.endEpoch + 24 }}</div>
          </div>
        </b-col>
        <b-col md="3" class="p-3">
          <div class="fact-card">
            <div class="name">Current Epoch</div>
            <div class="value">{{ best.epoch }}</div>
          </div>
        </b-col>
      </b-row>
    </section>
    <section v-else>
      <div class="bg-white-color border p-3 rounded-xlg">
        <b-button variant="myprimary" @click="auctionBid" class="w-100 rounded-xlg"><b-icon icon="plus" />New Bid</b-button>
      </div>
      <div v-if="getAuctionsloading" class="d-flex justify-content-center py-5">
        <div class="spinner-border" role="status">
          <span class="sr-only">Loading...</span>
        </div>
      </div>
      <div v-else>
        <div class="fact-card mt-3 rounded-xlg">
          <div class="name">My Total Bids (MTR)</div>
          <div class="value primary">{{ myBidsTotal }}</div>
        </div>
        <div class="fact-card mt-3 rounded-xlg">
          <div class="name">My Est. Gain (MTRG)</div>
          <div class="value primary">{{ myEstMTRGTotal }}</div>
        </div>
        <div class="fact-card mt-3 rounded-xlg">
          <div class="name">Est. Price</div>
          <div class="value">{{ estimatePrice }}</div>
        </div>
        <div class="fact-card mt-3 rounded-xlg">
          <div class="name">Ends In</div>
          <div class="value">{{ leftoverEpoch }} hour{{ leftoverEpoch > 1 ? 's' : '' }}</div>
        </div>
        <div class="fact-card mt-3 rounded-xlg">
          <div class="name">MTRG on Auction</div>
          <div class="value">{{ computedData._releasedMTRG }}</div>
        </div>
        <div class="fact-card mt-3 rounded-xlg">
          <div class="name">Received Bids (MTR)</div>
          <div class="value">{{ computedData._receivedMTR }}</div>
        </div>
        <div class="fact-card mt-3 rounded-xlg">
          <div class="name">Auction Epoch Range</div>
          <div class="value">{{ computedData.endEpoch }} - {{ computedData.endEpoch + 24 }}</div>
        </div>
        <div class="fact-card mt-3 rounded-xlg">
          <div class="name">Current Epoch</div>
          <div class="value">{{ best.epoch }}</div>
        </div>
      </div>
    </section>

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
    AuctionBidModal,
  },
  data() {
    return {
      auctionBidParams: {
        data: {},
        show: false,
      },
    }
  },
  computed: {
    ...mapState('auction', ['getAuctionsloading', 'auctions', 'best']),
    ...mapState('wallet', ['account', 'isMobile']),
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
        _releasedMTRG: new BigNumber(this.auctions.releasedMTRG).div(1e18).toFormat(2),
        reservedMTRG: this.auctions.reservedMTRG,
        reservedPrice: this.auctions.reservedPrice,
        createTime: this.auctions.createTime,
        receivedMTR: this.auctions.receivedMTR,
        _receivedMTR: new BigNumber(this.auctions.receivedMTR).div(1e18).toFormat(2),
      }
    },
    estimatePrice() {
      return new BigNumber(this.computedData.receivedMTR).div(this.computedData.releasedMTRG).toFormat(2)
    },
    leftoverEpoch() {
      return this.computedData.endEpoch + 24 - this.best.epoch
    },
    myBidsTotal() {
      return this.auctions.auctionTxs
        .filter((tx) => {
          return tx.address === this.account.toLowerCase()
        })
        .reduce((sum, v) => {
          return new BigNumber(v.amount).plus(sum)
        }, new BigNumber(0))
        .div(1e18)
        .toFormat(2, 1)
    },
    myEstMTRGTotal() {
      return new BigNumber(this.myBidsTotal).div(this.estimatePrice).toFormat(2, 1)
    },
  },
  created() {
    this.getAuctions()
    this.getBest()
  },
  methods: {
    ...mapActions({
      getAuctions: 'auction/getAuctions',
      getBest: 'auction/getBest',
    }),
    auctionBid() {
      this.auctionBidParams.show = true
      this.auctionBidParams.data = { ...this.computedData }
    },
    closeAuctionBidModal() {
      this.auctionBidParams.show = false
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