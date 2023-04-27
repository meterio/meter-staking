<template>
  <CustomizedModal v-model="bucketParams.show" @close="closeModal">
    <template #modal-title>
      <span class="d-block font-weight-bold text-capitalize">Partial Unbound</span>
    </template>
    <template #modal-body>
      <Divider />
      <div v-if="computedUpdateBucketLoading" class="d-flex justify-content-center py-5">
        <div class="spinner-border" role="status">
          <span class="sr-only">Loading...</span>
        </div>
      </div>
      <div v-else class="modal-body pt-2">
        <div class="section">
          <div class="name">Vote ID</div>
          <div class="content">{{ formData.id }}</div>
        </div>
        <div class="section">
          <div class="name">From</div>
          <div class="content">{{ formData.owner }}</div>
        </div>
        <div class="section">
          <div class="name">Vote Amount</div>
          <div class="content">{{ formData.currentAmount }} {{ currentNetwork.governanceTokenSymbol }}</div>
        </div>
        <b-form @submit.prevent="onSubmit">
          <!-- sub amount -->
          <b-form-group label="Unbound amount" label-for="subamount" class="mt-3">
            <b-input-group :append="currentNetwork.governanceTokenSymbol || ''">
              <b-form-input
                id="subamount"
                v-model="formData.subamount"
                placeholder="Enter unbound amount"
                :autofocus="true"
                required
                :state="amountValidation"
              ></b-form-input>
              <b-form-invalid-feedback :state="amountValidation" tooltip>
                {{ amountValidationMsg }}
              </b-form-invalid-feedback>
            </b-input-group>
          </b-form-group>
          <b-button :disabled="!amountValidation" class="w-100" type="submit" variant="primary">Submit</b-button>
        </b-form>
      </div>
    </template>
    <template #modal-footer>
      <div class="modal-footer w-100 py-4">
        <b-button v-if="updateBucketHash" @click="goMeterScan" class="w-100" type="button" variant="primary"
          >Meter Scan</b-button
        >
      </div>
    </template>
  </CustomizedModal>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import { BigNumber } from 'bignumber.js'
import { ScriptEngine } from '@meterio/devkit'

import { getMeterScanUrl, getBucketById } from '@/api'

export default {
  name: 'AddBucketModal',
  props: {
    bucketParams: {
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
    return {
      amountValidationMsg: '',
      votedAmount: 0,
      formData: {
        id: '',
        owner: '',
        currentAmount: '',
        subamount: '',
      },
    }
  },
  watch: {
    'bucketParams.show'(v) {
      if (!v) {
        this.formData.subamount = ''
      }
    },
    async 'bucketParams.data'(v) {
      if (v && v.id) {
        const res = await getBucketById(this.currentNetwork.infoUrl, v.id)
        const { id, owner, value } = res
        this.formData.id = id
        this.formData.owner = owner
        this.formData.currentAmount = new BigNumber(value).div(1e18).toFormat()
        this.votedAmount = new BigNumber(value).div(1e18).toNumber()
      }
    },
    updateBucketHash(newVal, oldVal) {
      if (newVal === '' && oldVal.includes('0x')) {
        this.closeModal()
      }
    },
  },
  computed: {
    ...mapState('bucket', ['updateBucketLoading']),
    ...mapState('wallet', ['account', 'chainId']),
    ...mapState('token', ['balances', 'currentNetwork']),
    computedUpdateBucketLoading() {
      const hash = this.updateBucketLoading[this.bucketParams.data.candidateName]
      if (hash) {
        if (hash === 'start' || String(hash).includes('0x')) {
          return true
        }
      }
      return false
    },
    updateBucketHash() {
      const hash = this.updateBucketLoading[this.bucketParams.data.candidateName]
      if (hash && String(hash).includes('0x')) {
        return hash
      }
      return ''
    },
    amountValidation() {
      if (this.formData.subamount == '') {
        return
      }
      const amount = new BigNumber(this.formData.subamount)
      if (amount.lte(0)) {
        this.amountValidationMsg = 'Amount should > 0.'
        return false
      }
      if (amount.gt(this.votedAmount)) {
        this.amountValidationMsg = 'Your locked balance is insufficient.'
        return false
      }
      const remain = new BigNumber(this.votedAmount).minus(amount)
      if (remain.isLessThan(100)) {
        this.amountValidationMsg = 'The remaining votes in the bucket has to be greater or equal to 100.'
        return false
      }
      return true
    },
  },
  methods: {
    ...mapActions({
      updateBucket: 'bucket/updateBucket',
    }),
    closeModal() {
      this.$emit('close')
    },
    async onSubmit() {
      const fromAddr = this.account
      let dataBuffer = ScriptEngine.getBucketSubData(
        fromAddr,
        this.formData.id,
        new BigNumber(this.formData.subamount).times(1e18).toFixed(),
      )
      const scriptData = dataBuffer.toString('hex')
      const errMsg = await this.updateBucket({ name: this.bucketParams.data.candidateName, data: scriptData })
      errMsg && alert(errMsg)
    },
    goMeterScan() {
      const url = getMeterScanUrl(this.chainId)
      window.open(`${url}/tx/${this.updateBucketHash}`, '_blank')
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