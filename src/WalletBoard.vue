<template>
  <div></div>
</template>
<script>
import Onboard from '@web3-onboard/core'
import injectedModule from '@web3-onboard/injected-wallets'
import walletConnectModule from '@web3-onboard/walletconnect'
import coinbaseWalletModule from '@web3-onboard/coinbase'
import gnosisModule from '@web3-onboard/gnosis'
import Vue from 'vue'

export const WalletBoardBus = new Vue()

const injected = injectedModule()
const walletConnect = walletConnectModule({
  version: 2,
  projectId: '0a70e401bb41f5a16b5809cf0236cba1',
  dappUrl: 'https://staking.meter.io',
})
const coinbaseWalletSdk = coinbaseWalletModule()
const options = {
  whitelistedDomains: [
    /^https:\/\/safe\.meter\.io/,
    /^https:\/\/gnosis-safe\.io$/,
    /^https:\/\/app\.safe\.global$/,
    /^https:\/\/safe\.global$/,
  ],
}
const gnosis = gnosisModule(options)

export default {
  name: 'WalletBoard',
  props: {
    chains: {
      type: Array,
      required: true,
    },
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
        wallets: [injected, walletConnect, coinbaseWalletSdk, gnosis],
        chains: this.chains,
        accountCenter: {
          desktop: {
            enabled: false,
          },
          mobile: {
            enabled: false,
          },
        },
        appMetadata: {
          name: 'Meter Wallet',
          icon: '<svg></svg>',
          description: 'Meter Wallet',
        },
      })

      if (this.onboard) {
        this.connect()

        this.subscribe()
      }
    },
    async connect() {
      const previouslyConnectedWallets = JSON.parse(window.localStorage.getItem('connectedWallets'))
      console.log('previouslyConnectedWallets', previouslyConnectedWallets)

      if (this.onboard) {
        if (previouslyConnectedWallets && previouslyConnectedWallets.length) {
          // Connect the most recently connected wallet (first in the array)
          // await onboard.connectWallet({ autoSelect: previouslyConnectedWallets[0] })

          // You can also auto connect "silently" and disable all onboard modals to avoid them flashing on page load
          await this.onboard.connectWallet({
            autoSelect: { label: previouslyConnectedWallets[0], disableModals: true },
          })
        } else {
          await this.onboard.connectWallet()
        }
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
      const { unsubscribe } = state.subscribe((update) => {
        console.log('state update: ', update)
        this.updateState(update.wallets)

        const connectedWallets = update.wallets.map(({ label }) => label)
        window.localStorage.setItem('connectedWallets', JSON.stringify(connectedWallets))

        this.disconnectOtherWallet()
      })
      this.unsubscribe = unsubscribe
    },
    setChain(chainId) {
      if (this.onboard) {
        this.onboard.setChain({ chainId: `0x${Number(chainId).toString(16)}` })
      }
    },
    disconnectWallet() {
      if (this.onboard) {
        window.localStorage.removeItem('connectedWallets')
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
    },
  },
  beforeDestroy() {
    if (this.unsubscribe) {
      this.unsubscribe()
    }
  },
}
</script>

<style lang="scss" scoped></style>
