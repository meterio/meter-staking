<template>
  <div class="data-table-content">
    <b-tabs pills card active-nav-item-class="bg-myprimary-color">
        <b-tab title="Stake" active>
          <LiquidStake />
        </b-tab>
        <b-tab title="Wrap"><b-card-text>
          <StakeWrap />
        </b-card-text></b-tab>
      </b-tabs>
  </div>
</template>

<script>
  import LiquidStake from "./stake"
  import StakeWrap from "./wrap"
  export default {
    name: "LiquidStaking",
    components: {
      LiquidStake,
      StakeWrap
    }
  }
</script>