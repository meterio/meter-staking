<template>
  <CustomizedModal v-model="showQRCodeModal" @close="closeModal">
    <template #modal-title>
      <span class="font-weight-bold text-capitalize">my qr code</span>
    </template>
    <template #modal-body>
      <Divider />
      <div class="customized-modal-body d-flex flex-column align-items-center">
        <div>
          <VueQr :text="account" :size="148" />
        </div>
        <span class="text-muted mt-2 font-small-size">Wallet address</span>
        <span class="font-weight-bold mt-2 font-xsmall-size">{{account}}</span>
      </div>
    </template>
    <template #modal-footer>
      <div :class="{'bg-myprimary-color': coping === -1}" class="customized-modal-footer w-100" @click="copyAddress">
        <span v-if="coping === -1">Copy Address</span>
        <b-icon v-else class="font-large-size" :icon="computedIcon" :variant="computedStatus" :animation="computedAnimation"></b-icon>
      </div>
    </template>
  </CustomizedModal>
</template>

<script>
import CustomizedModal from '@/components/CustomizedModal'
import { mapState, mapMutations } from 'vuex'
import * as clipboard from "clipboard-polyfill/text"
import VueQr from 'vue-qr'
export default {
  name: "QRCodeModal",
  components: {
    CustomizedModal,
    VueQr
  },
  data() {
    return {
      address: '0x57e7e16A2326DC41d02402103A73b4464A8B3EEb',
      // -1 before copy, 0 coping, 1 success
      coping: -1
    }
  },
  computed: {
    ...mapState('modal', ['showQRCodeModal']),
    ...mapState('wallet', ['account']),
    computedIcon() {
      switch (this.coping) {
        case -1:
          return 'stickies-fill'
        case 0:
          return 'arrow-clockwise'
        case 1:
          return 'check2-circle'
        default:
          return 'stickies-fill'
      }
    },
    computedStatus() {
      if (this.coping === 1) {
        return 'success'
      }
      return ''
    },
    computedAnimation() {
      if (this.coping === 0) {
        return 'spin'
      }
      return ''
    }
  },
  methods: {
    ...mapMutations({
      setShowQRCodeModal: 'modal/setShowQRCodeModal'
    }),
    closeModal() {
      this.setShowQRCodeModal()
    },
    copyAddress() {
      this.coping !== -1 || this.clipboard()
    },
    clipboard() {
      this.coping = 0
      clipboard.writeText(this.account).then(
        () => {
          console.log("copy success!")
          this.coping = 1
          setTimeout(() => {
            this.coping = -1
          }, 1000);
        },
        () => {
          console.log("copy error!")
        }
      )
    }
  }
}
</script>

<style lang="scss" scoped>
.customized-modal-body {
  padding: 60px 0;
}
.customized-modal-footer {
  padding: 20px 32px;
  color: #fff;
  text-align: center;
  cursor: pointer;
}
</style>