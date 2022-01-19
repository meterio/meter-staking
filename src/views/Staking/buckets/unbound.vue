<template>
  <CustomizedModal v-model="unboundParams.show" @close="closeModal">
    <template #modal-title>
      <span class="d-block font-weight-bold text-capitalize">unbound</span>
    </template>
    <template #modal-body>
      <Divider />
      <div v-if="computedUnboundLoading" class="d-flex justify-content-center py-5">
        <div class="spinner-border" role="status">
          <span class="sr-only">Loading...</span>
        </div>
      </div>
      <div v-else class="modal-body">
        <b-form @submit.prevent="onSubmit">
          <div class="alert alert-info my-1" role="alert">
            This action will mark this bucket as unbounded, and you could only withdraw funds after a lock down period of 7 days (known as mature time)
          </div>
          <div class="info-section">
            <div class="name">Bucket ID</div>
            <div class="font-weight-bold content text-break">{{ unboundParams.data.id }}</div>
          </div>
          <div class="info-section mt-1">
            <div class="name">Bucket Owner</div>
            <div class="font-weight-bold content">
              <AddressLable :address="unboundParams.data.owner" />
            </div>
          </div>
          <div class="info-section mt-1">
            <div class="name">Bucket Amount</div>
            <div class="font-weight-bold content">{{ unboundParams.data.votes }}</div>
          </div>
          <b-button class="w-100 mt-1" type="submit" variant="primary">Comfirm</b-button>
        </b-form>
      </div>
    </template>
    <template #modal-footer>
      <div class="modal-footer w-100 py-4">
        <b-button v-if="unboundHash" @click="goMeterScan" class="w-100" type="button" variant="primary">Meter Scan</b-button>
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
  name: "UnboundModal",
  props: {
    unboundParams: {
      type: Object,
      default() {
        return {
          show: false,
          data: {}
        }
      }
    }
  },
  data() {
    return {}
  },
  computed: {
    ...mapState('wallet', ['account', 'chainId']),
    ...mapState('bucket', ['unboundLoading']),
    computedUnboundLoading() {
      const hash = this.unboundLoading[this.unboundParams.data.candidateName]
      if (hash) {
        if (hash === 'start' || String(hash).includes('0x')) {
          return true
        }
      }
      return false
    },
    unboundHash() {
      const hash = this.unboundLoading[this.unboundParams.data.candidateName]
      if (hash && String(hash).includes('0x')) {
        return hash
      }
      return ''
    },
  },
  methods: {
    ...mapActions({
      unboundAction: 'bucket/unbound'
    }),
    closeModal() {
      this.$emit('close')
    },
    onSubmit() {
      const value = new BigNumber(this.unboundParams.data.value).toFixed();
      let holderAddr = this.account;
      const dataBuffer = ScriptEngine.getUnboundData(
        holderAddr,
        this.unboundParams.data.id,
        value
      );
      const scriptData = '0x' + dataBuffer.toString('hex');
      this.unboundAction({ name: this.unboundParams.data.candidateName, data: scriptData });
    },
    goMeterScan() {
      const url = getMeterScanUrl(this.chainId)
      window.open(`${url}/tx/${this.unboundHash}`, '_blank')
    }
  }
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