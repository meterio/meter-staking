<template>
  <div>
    <SupportNetworkListItem
      v-for="network in supportNetwork"
      :key="network.name"
      :network="network"
      @click.native="clickItem(network)"
    />
  </div>
</template>

<script>
import { mapState } from 'vuex'
import SupportNetworkListItem from '@/components/SupportNetworkListItem'
import { getSupportNetworkListByMode } from '@/api'
import { WalletBoardBus } from '@/WalletBoard'
export default {
  name: 'SupportNetworksList',
  components: {
    SupportNetworkListItem,
  },
  data() {
    return {}
  },
  computed: {
    ...mapState('wallet', ['provider', 'chainId']),
    supportNetwork() {
      return this.getSupportNetworkListByMode()
    },
  },
  methods: {
    getSupportNetworkListByMode,
    clickItem(network) {
      if (this.supportNetwork.networkId === this.chainId) {
        return
      }
      WalletBoardBus.$emit('setChain', network.networkId)
    }
  },
}
</script>

<style lang="scss" scoped>
</style>