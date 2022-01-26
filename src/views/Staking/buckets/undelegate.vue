<template>
  <CustomizedModal v-model="undelegateParams.show" @close="closeModal">
    <template #modal-title>
      <span class="d-block text-capitalize">undelegate</span>
    </template>
    <template #modal-body>
      <Divider />
      <div v-if="computedUndelegateLoading" class="d-flex justify-content-center py-5">
        <div class="spinner-border" role="status">
          <span class="sr-only">Loading...</span>
        </div>
      </div>
      <div v-else class="modal-body pt-3">
        <b-alert show
          >This action will reset the current vote, but it won't withdraw the amount. If you do want to withdraw, use
          Unbound instead</b-alert
        >
        <b-form @submit.prevent="onSubmit">
          <div class="section">
            <div class="name">Vote ID</div>
            <div class="content text-break">{{ undelegateParams.data.id }}</div>
          </div>
          <div class="section">
            <div class="name">Vote Owner</div>
            <div class="content">
              <AddressLable :address="undelegateParams.data.owner" />
            </div>
          </div>
          <div class="section">
            <div class="name">Vote Amount</div>
            <div class="content">{{ undelegateParams.data.votes }}</div>
          </div>
          <b-button class="w-100 mt-1" type="submit" variant="primary">Comfirm</b-button>
        </b-form>
      </div>
    </template>
    <template #modal-footer>
      <div class="modal-footer w-100 py-4">
        <b-button v-if="undelegateHash" @click="goMeterScan" class="w-100" type="button" variant="primary"
          >Meter Scan</b-button
        >
      </div>
    </template>
  </CustomizedModal>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import { ScriptEngine } from '@meterio/devkit'
import BigNumber from 'bignumber.js'

import { getMeterScanUrl } from '@/api'

export default {
  name: 'UndelegateModal',
  props: {
    undelegateParams: {
      type: Object,
      default() {
        return {
          show: false,
          data: {},
        }
      },
    },
  },
  data() {
    return {}
  },
  computed: {
    ...mapState('wallet', ['account', 'chainId']),
    ...mapState('bucket', ['undelegateLoading']),
    computedUndelegateLoading() {
      const hash = this.undelegateLoading[this.undelegateParams.data.candidateName]
      if (hash) {
        if (hash === 'start' || String(hash).includes('0x')) {
          return true
        }
      }
      return false
    },
    undelegateHash() {
      const hash = this.undelegateLoading[this.undelegateParams.data.candidateName]
      if (hash && String(hash).includes('0x')) {
        return hash
      }
      return ''
    },
  },
  methods: {
    ...mapActions({
      undelegateAction: 'bucket/undelegate',
    }),
    closeModal() {
      this.$emit('close')
    },
    onSubmit() {
      const value = new BigNumber(this.undelegateParams.data.value).toFixed()
      let holderAddr = this.account
      const dataBuffer = ScriptEngine.getUndelegateData(holderAddr, this.undelegateParams.data.id, value)
      const scriptData = '0x' + dataBuffer.toString('hex')
      this.undelegateAction({ name: this.undelegateParams.data.candidateName, data: scriptData })
    },
    goMeterScan() {
      const url = getMeterScanUrl(this.chainId)
      window.open(`${url}/tx/${this.undelegateHash}`, '_blank')
    },
  },
}
</script>

<style lang="scss" scoped>
.modal-body {
  padding: 0 32px;
}
.modal-footer {
  padding: 0 32px;
  overflow-y: auto;
}
</style>