<template>
  <CustomizedModal v-model="computedBailOutLoading" :closable="true">
    <template #modal-title>
      <span class="d-block text-capitalize">bail out</span>
    </template>
    <template #modal-body>
      <Divider />
      <div class="d-flex justify-content-center py-5">
        <div class="spinner-border" role="status">
          <span class="sr-only">Loading...</span>
        </div>
      </div>
    </template>
    <template #modal-footer>
      <div class="modal-footer w-100 py-4">
        <b-button @click="goMeterScan" class="w-100" type="button" variant="primary"
          >Meter Scan</b-button
        >
      </div>
    </template>
  </CustomizedModal>
</template>

<script>
import { mapState } from 'vuex'

import { getMeterScanUrl } from '@/api'

export default {
  name: 'BailOutLoading',
  props: {
    bailOutParams: {
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
    ...mapState('bailout', ['bailOutLoading']),
    computedBailOutLoading() {
      const hash = this.bailOutLoading[this.bailOutParams.data.name]
      if (hash) {
        if (hash === 'start' || String(hash).includes('0x')) {
          return true
        }
      }
      return false
    },
    bailOutHash() {
      const hash = this.bailOutLoading[this.bailOutParams.data.name]
      if (hash && String(hash).includes('0x')) {
        return hash
      }
      return ''
    },
  },
  methods: {
    goMeterScan() {
      const url = getMeterScanUrl(this.chainId)
      window.open(`${url}/tx/${this.bailOutHash}`, '_blank')
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