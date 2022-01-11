<template>
  <div></div>
</template>
<script>
import Onboard from 'bnc-onboard'
import Vue from 'vue'
export const WalletBoardBus = new Vue()
export default {
  name: 'WalletBoard',
  props: {
    dappId: {
      type: String,
      default: ''
    },
    networkId: {
      type: Number,
      default: 1
    },
    walletSelect: {
      type: Object,
      default() {
        return {}
      }
    },
    walletCheck: {
      type: Array,
      default() {
        return [
          { checkName: 'accounts' },
          { checkName: 'connect' },
          { checkName: 'network' }
        ]
      }
    }
  },
  data() {
    return {
      onboard: null,
      currentNetworkId: this.networkId
    }
  },
  created() {
    this.onboard = this.initializeOnboard()
    this.selectWallet()
  },
  mounted() {
    WalletBoardBus.$on('resetWallet', this.resetWallet)
    WalletBoardBus.$on('selectWallet', this.selectWallet)
  },
  methods: {
    initializeOnboard() {
      try {
        const onboard = Onboard({
          dappId: this.dappId,
          networkId: this.networkId,
          walletSelect: this.walletSelect,
          walletCheck: this.walletCheck,
          subscriptions: {
            wallet: (wallet) => {
              console.log("wallet: ", wallet)
              if (!wallet.provider) {
                this.resetWallet()
              }
            },
            network: (network) => {
              const ethereum = window.ethereum;
              ethereum.removeAllListeners(['networkChanged']);
              console.log("network: ", network)
              if (network) {
                this.updateNetworkId(network)
              }
            },
            address: (address) => {
              console.log("address: ", address)
            },
            balance: (balance) => {
              console.log("balance: ", balance)
              this.emitWalletState()
            }
          },
        })

        return onboard
      } catch(e) {
        console.log("init onboard error: ", e)
      }
    },
    updateNetworkId(networkId) {
      if (networkId !== this.currentNetworkId) {
        this.onboard.config({ networkId })
        this.currentNetworkId = networkId
      }
    },
    emitIsSelecting(isSelecting) {
      this.$emit('isSelecting', isSelecting)
    },
    emitWalletState() {
      const state = this.onboard.getState()
      const { address, network, wallet } = state

      if (!!address && !!network && wallet.provider) {
        this.emitIsSelecting(false)
        sessionStorage.setItem('selectedWallet', wallet.name)
        this.$emit('walletState', state)
      }
    },
    async selectWallet(hardSelect) {
      const savedWallet = sessionStorage.getItem('selectedWallet')

      const wallet = hardSelect ? null : savedWallet

      let selected;
      if (wallet) {
        selected = await this.onboard.walletSelect(savedWallet)
      } else {
        this.emitIsSelecting(true)
        selected = await this.onboard.walletSelect()
      }
      
      selected && await this.onboard.walletCheck()
    },
    async resetWallet(hardReset) {
      const savedWallet = sessionStorage.getItem('selectedWallet')
      if (savedWallet || hardReset) {
        sessionStorage.removeItem('selectedWallet')
        console.log("walletReset")
        this.onboard.walletReset()
        await this.selectWallet()
      }
    }
  },
}
</script>

<style lang="scss" scoped></style>
