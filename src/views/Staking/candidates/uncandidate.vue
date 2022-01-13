<template>
  <CustomizedModal v-model="uncandidateParams.show" @close="closeModal">
    <template #modal-title>
      <span class="d-block font-weight-bold text-capitalize">uncandidate</span>
    </template>
    <template #modal-body>
      <Divider />
      <div v-if="computedUncandidateLoading" class="d-flex justify-content-center py-5">
        <div class="spinner-border" role="status">
          <span class="sr-only">Loading...</span>
        </div>
      </div>
      <div v-else class="modal-body">
        <b-form @submit.prevent="onSubmit">
          <div class="alert alert-warning my-1" role="alert">
            This action will remove this node from candidate list, and all related buckets will be undelegated. You could only withdraw your fund after a lockd down period of 7-days.
          </div>
          <div class="info-section">
            <div class="name">Name</div>
            <div class="font-weight-bold content">{{ uncandidateParams.data.name }}</div>
          </div>
          <div class="info-section mt-1">
            <div class="name">Description</div>
            <div class="font-weight-bold content">{{ uncandidateParams.data.description }}</div>
          </div>
          <div class="info-section mt-1">
            <div class="name">Candidate Address</div>
            <div class="font-weight-bold content">
              <AddressLable :address="uncandidateParams.data.address" />
            </div>
          </div>
          <div class="info-section mt-1">
            <div class="name">Candidate IP</div>
            <div class="font-weight-bold content">{{ uncandidateParams.data.ipAddr }}</div>
          </div>
          <div class="info-section mt-1">
            <div class="name">Total Votes</div>
            <div class="font-weight-bold content">{{ uncandidateParams.data.totalVotes }} MTRG</div>
          </div>
          <b-button class="w-100 mt-1" type="submit" variant="primary">Comfirm</b-button>
        </b-form>
      </div>
    </template>
    <template #modal-footer>
      <div class="modal-footer w-100 py-4">
        <b-button v-if="uncandidateHash" @click="goMeterScan" class="w-100" type="button" variant="primary">Meter Scan</b-button>
      </div>
    </template>
  </CustomizedModal>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import { ScriptEngine } from '@meterio/devkit'

import { getMeterScanUrl } from '@/api'

export default {
  name: "UncandidateModal",
  props: {
    uncandidateParams: {
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
    ...mapState('candidate', ['uncandidateLoading']),
    computedUncandidateLoading() {
      const hash = this.uncandidateLoading[this.uncandidateParams.data.name]
      if (hash) {
        if (hash === 'start' || String(hash).includes('0x')) {
          return true
        }
      }
      return false
    },
    uncandidateHash() {
      const hash = this.uncandidateLoading[this.uncandidateParams.data.name]
      if (hash && String(hash).includes('0x')) {
        return hash
      }
      return ''
    },
  },
  methods: {
    ...mapActions({
      uncandidateAction: 'candidate/uncandidate'
    }),
    closeModal() {
      this.$emit('close')
    },
    onSubmit() {
      const fromAddr = this.account
      const dataBuffer = ScriptEngine.getUncandidateData(fromAddr)
      const scriptData = '0x' + dataBuffer.toString('hex');
      this.uncandidateAction({ name: this.uncandidateParams.data.name, data: scriptData });
    },
    goMeterScan() {
      const url = getMeterScanUrl(this.chainId)
      window.open(`${url}/${this.uncandidateHash}`, '_blank')
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