<template>
  <div class="net-list-item p-2" :class="{connected}">
    <div class="d-flex justify-content-between">
      <div class="d-flex">
        <img class="net-img" :src="`/img/header/supportnet/${network.nativeTokenSymbol.toLowerCase()}.png`" alt="">
        <span class="d-flex align-items-center ml-4">{{ network.name }}</span>
      </div>
      <div v-if="connected" class="d-flex align-items-center font-large-size"><b-icon icon="check2-circle" variant="success"></b-icon></div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: "SupportNetworksListItem",
  props: {
    network: {
      type: Object,
      required: true
    }
  },
  data() {
    return {}
  },
  computed: {
    ...mapState('wallet', ['chainId']),
    connected() {
      return this.network.networkId === Number(this.chainId)
    }
  }
}
</script>

<style lang="scss" scoped>
  .net-list-item {
    cursor: pointer;
    &:hover {
      background-color: #f8f9fa;
    }
    &.connected {
      background-color: #f8f9fa;
      cursor: not-allowed;
      pointer-events: none;
    }
    .net-img {
      width: 40px;
      height: 40px;
    }
  }
</style>