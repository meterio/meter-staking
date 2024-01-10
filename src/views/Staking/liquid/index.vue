<template>
  <div class="data-table-content">
    <section v-if="!isMobile" class="bg-white-color border rounded-lg card-shadow">
      <b-tabs pills card active-nav-item-class="bg-myprimary-color">
        <b-tab title="Stake" active>
          <LiquidStake />
        </b-tab>
        <b-tab title="Wrap"><b-card-text>
            <StakeWrap />
          </b-card-text></b-tab>
      </b-tabs>
    </section>
    <section v-else>
      <div class="bg-white-color border p-3 rounded-xlg">
        <b-row>
          <b-col class="pr-1">
            <b-button :variant="currTab === 'Stake' ? 'myprimary' : 'mylight'"
              @click="goStake"
              class="w-100 rounded-xlg">Stake</b-button>
          </b-col>
          <b-col class="pl-1">
            <b-button :variant="currTab === 'Wrap' ? 'myprimary' : 'mylight'"
              @click="goWrap"
              class="w-100 rounded-xlg">Wrap</b-button>
          </b-col>
        </b-row>
      </div>

      <div class="mt-4">
        <div v-if="currTab === 'Stake'">
          <LiquidStake />
        </div>
        <div v-else>
          <StakeWrap />
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import LiquidStake from "./stake"
import StakeWrap from "./wrap"
export default {
  name: "LiquidStaking",
  data() {
    return {
      currTab: 'Stake'
    }
  },
  components: {
    LiquidStake,
    StakeWrap
  },
  computed: {
    ...mapState('wallet', ['isMobile'])
  },
  methods: {
    goStake() {
      this.currTab = 'Stake'
    },
    goWrap() {
      this.currTab = 'Wrap'
    }
  }
}
</script>