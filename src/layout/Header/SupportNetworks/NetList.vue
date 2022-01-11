<template>
  <div>
    <SupportNetworkListItem v-for="network in supportNetwork" :key="network.name" :network="network" @click.native="clickItem(network)" />
  </div>
</template>

<script>
import { mapState } from 'vuex'
import SupportNetworkListItem from '@/components/SupportNetworkListItem'
import { getSupportNetworkListByMode } from '@/api'
export default {
  name: "SupportNetworksList",
  components: {
    SupportNetworkListItem
  },
  data() {
    const { VUE_APP_MODE } = process.env
    return {
      mode: VUE_APP_MODE
    }
  },
  computed: {
    ...mapState('wallet', ['provider', 'chainId']),
    supportNetwork() {
      return this.getSupportNetworkListByMode(this.mode)
    }
  },
  methods: {
    getSupportNetworkListByMode,
    clickItem(network) {
      if (this.supportNetwork.networkId === this.chainId) {
        return
      }
      this.provider.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: "0x" + Number(network.networkId).toString(16) }],
      }).catch(err => {
        if (err.code === 4902) {
          this.provider.request({
            method: "wallet_addEthereumChain",
            params: [
              {
                chainId: "0x" + Number(network.networkId).toString(16),
                chainName: network.name,
                nativeCurrency: {
                  name: network.nativeTokenSymbol,
                  symbol: network.nativeTokenSymbol,
                  decimals: network.nativeTokenDecimals,
                },
                rpcUrls: [network.rpcUrl],
                blockExplorerUrls: [network.blockExplorer],
              },
            ],
          });
        } else {
          console.log("switch ethereum chain error: ", err)
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>

</style>