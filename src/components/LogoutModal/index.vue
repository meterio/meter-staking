<template>
  <CustomizedModal v-model="showLogoutModal" @close="closeModal">
    <template #modal-body>
      <div class="modal-body-content d-flex flex-column align-items-center">
        <img class="logout-img" src="/img/header/logout-modal.svg" alt="">
        <span class="font-medium-size font-weight-bold pt-4">Are you sure want to logout?</span>
      </div>
    </template>
    <template #modal-footer>
      <div class="modal-footer-content w-100 d-flex justify-content-around">
        <b-button class="btn-w-35" variant="mylight" @click="cancel">Cancel</b-button>
        <b-button class="btn-w-35" variant="myprimary" @click="yes">Yes, Logout</b-button>
      </div>
    </template>
  </CustomizedModal>
</template>

<script>
import CustomizedModal from '@/components/CustomizedModal'
import { mapMutations, mapState } from 'vuex'
import { WalletBoardBus } from '@/WalletBoard'
export default {
  name: "LogoutModal",
  components: {
    CustomizedModal
  },
  computed: {
    ...mapState('modal', ['showLogoutModal']),
  },
  methods: {
    ...mapMutations({
      setShowLogoutModal: 'modal/setShowLogoutModal',
      clearWalletInfo: 'wallet/clearWalletInfo'
    }),
    closeModal() {
      this.setShowLogoutModal()
    },
    cancel() {
      this.closeModal()
    },
    yes() {
      this.clearWalletInfo()
      WalletBoardBus.$emit('resetWallet')
      this.cancel()
    }
  }
}
</script>

<style lang="scss" scoped>
  .modal-body-content {
    margin: 32px;
    margin-top: 0;
    .logout-img {
      width: 133px;
      height: 132px;
    }
  }
  .modal-footer-content {
    margin: 32px;
  }
  .btn-w-35 {
    width: 35%;
  }
</style>