<template>
  <div id="app">
    <Login v-if="isSelecting" />
    <router-view v-else />
    <!-- <div v-else class="renderLoading">
      <b-icon icon="circle-fill" animation="throb" font-scale="4"></b-icon>
    </div> -->
    <WalletBoard
      :chains="computedChains"
      @wallets="getWallets"
      @disconnected="disconnected"
    />
  </div>
</template>

<script>
import { mapActions, mapState, mapMutations } from 'vuex'
import Login from '@/views/Login'
import WalletBoard from '@/WalletBoard'
import { supportNetworkList } from '@/constants'
export default {
  name: 'App',
  components: {
    Login,
    WalletBoard,
  },
  data() {
    return {
      isSelecting: true,
    }
  },
  computed: {
    ...mapState('token', ['renderLoading']),
    computedChains() {
      return supportNetworkList.map(net => {
        return {
          id: `0x${Number(net.networkId).toString(16)}`,
          token: net.nativeTokenSymbol,
          label: net.name,
          rpcUrl: net.rpcUrl,
          publicRpcUrl: net.rpcUrl,
          blockExplorerUrl: net.blockExplorer
        }
      })
    }
  },
  methods: {
    ...mapActions({
      initWallet: 'wallet/actionWalletInfo',
    }),
    ...mapMutations({
      clearWalletInfo: 'wallet/clearWalletInfo'
    }),
    disconnected() {
      this.isSelecting = true
      this.clearWalletInfo()
    },
    getWallets(wallets) {
      const { accounts, chains, provider, icon, label } = wallets[0]

      this.isSelecting = false

      this.initWallet({ account: accounts[0].address, chainId: Number(chains[0].id), provider, icon, label })
    },
  },
}
</script>

<style lang="scss">
@import "@/scss/color.scss";
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  height: 100%;
  overflow: auto;
}
.renderLoading {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
</style>
