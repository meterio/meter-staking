<template>
  <div>
    <b-form-input 
      v-model="value" 
      type="range" 
      min="0" 
      max="100" 
      step="5"
      @change="percentChange(value)"
    ></b-form-input>
    <div class="d-flex justify-content-between">
      <b-button v-for="item in allPercent" :key="item"
        @click="setAmount(item)"
        class="px-0"
        variant="link" size="sm">{{ item * 100 }}%</b-button>
    </div>
  </div>
</template>

<script>
import BigNumber from 'bignumber.js'
export default {
  name: "PercentAmount",
  props: {
    amount: {
      type: String | Number | BigNumber,
      default: 0
    }
  },
  data() {
    return {
      allPercent: [0, 0.25, 0.50, 0.75, 1],
      value: 0
    }
  },
  methods: {
    setAmount(percent) {
      this.value = percent * 100

      this.$emit('setAmount', new BigNumber(this.amount).times(percent).toFixed(2, 1))
    },
    percentChange(value) {
      this.setAmount(value / 100)
    }
  }
}
</script>