<template>
  <div class="data-table-content">
    <b-tabs pills card>
        <b-tab title="Stake" active>
          <LiquidStake />
        </b-tab>
        <b-tab title="Wrap"><b-card-text>Tab contents 2</b-card-text></b-tab>
      </b-tabs>
  </div>
</template>

<script>
  import LiquidStake from "./stake"
  export default {
    name: "LiquidStaking",
    components: {
      LiquidStake
    }
  }
</script>