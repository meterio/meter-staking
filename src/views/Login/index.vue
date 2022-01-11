<template>
  <div>
    <div class="login mx-3">
      <div class="logo-container d-flex justify-content-center">
        <Logo />
      </div>
      <div class="d-flex justify-content-center">
      </div>
      <div class="active-wallet-btn position-absolute">
        <b-button variant="myprimary" @click="resetWallet">ACTIVE WALLET</b-button>
      </div>
    </div>
    </div>
</template>

<script>
import Logo from '@/components/Logo'
import { WalletBoardBus } from '@/WalletBoard'
export default {
  name: "Login",
  components: {
    Logo
  },
  methods: {
    resetWallet() {
      WalletBoardBus.$emit('resetWallet', true)
    }
  }
}
</script>

<style lang="scss" scoped>
  .login {
    .logo-container {
      margin-top: 70px;
    }
    .active-wallet-btn {
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }
  }
</style>
