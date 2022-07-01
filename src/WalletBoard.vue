<template>
  <div></div>
</template>
<script>
import Onboard from '@web3-onboard/core'
import injectedModule from '@web3-onboard/injected-wallets'
import walletConnectModule from '@web3-onboard/walletconnect'
import coinbaseWalletModule from '@web3-onboard/coinbase'
import Vue from 'vue'

export const WalletBoardBus = new Vue()

const injected = injectedModule()
const walletConnect = walletConnectModule()
const coinbaseWalletSdk = coinbaseWalletModule()

export default {
  name: 'WalletBoard',
  props: {
    chains: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      onboard: null,
      unsubscribe: null,
    }
  },
  created() {
    this.initOnboard()
  },
  mounted() {
    WalletBoardBus.$on('setChain', this.setChain)
    WalletBoardBus.$on('connect', this.connect)
    WalletBoardBus.$on('disconnect', this.disconnectWallet)
  },
  methods: {
    async initOnboard() {
      this.onboard = Onboard({
        wallets: [injected, walletConnect, coinbaseWalletSdk],
        chains: this.chains,
        accountCenter: {
          desktop: {
            enabled: false,
          },
          mobile: {
            enabled: false,
          }
        },
        appMetadata: {
          name: 'Meter Wallet',
          icon: '<svg></svg>',
          description: 'Meter Wallet'
        }
      })

      if (this.onboard) {

        this.connect()

        this.subscribe()
      }
    },
    async connect() {
      if (this.onboard) {
        await this.onboard.connectWallet()
      }
    },
    updateState(wallets) {
      if (wallets.length) {
        this.$emit('wallets', wallets)
      } else {
        this.$emit('disconnected')
        this.connect()
      }
    },
    subscribe() {
      const state = this.onboard.state.select()
      const { unsubscribe } = state.subscribe(update => {
        console.log('state update: ', update);
        this.updateState(update.wallets)
        
        this.disconnectOtherWallet()
      })
      this.unsubscribe = unsubscribe
    },
    setChain(chainId) {
      if (this.onboard) {
        this.onboard.setChain({ chainId: `0x${Number(chainId).toString(16)}`})
      }
    },
    disconnectWallet() {
      if (this.onboard) {
        const wallets = this.onboard.state.get().wallets
        if (wallets.length) {
          this.unsubscribe()
          this.onboard.disconnectWallet({ label: wallets[0].label })
        }
      }
    },
    disconnectOtherWallet() {
      if (this.onboard) {
        const wallets = this.onboard.state.get().wallets
        if (wallets.length > 1) {
          this.onboard.disconnectWallet({ label: wallets[1].label })
        }
      }
    }
  },
  beforeDestroy() {
    if (this.unsubscribe) {
      this.unsubscribe()
    }
  }
}
</script>

<style lang="scss" scoped></style>
