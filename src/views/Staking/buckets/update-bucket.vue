<template>
  <CustomizedModal v-model="bucketParams.show" @close="closeModal">
    <template #modal-title>
      <span class="d-block font-weight-bold text-capitalize">update bucket</span>
    </template>
    <template #modal-body>
      <Divider />
      <div v-if="computedUpdateBucketLoading" class="d-flex justify-content-center py-5">
        <div class="spinner-border" role="status">
          <span class="sr-only">Loading...</span>
        </div>
      </div>
      <div v-else class="modal-body">
        <b-form @submit.prevent="onSubmit">
          <!-- bucket id -->
          <b-form-group
            label="Bucket ID:"
            label-for="bucketid"
          >
            <b-form-input
              id="bucketid"
              v-model="formData.id"
              placeholder="Enter id"
              disabled
            ></b-form-input>
          </b-form-group>
          <!-- bucket owner -->
          <b-form-group
            label="Bucket owner:"
            label-for="bucketowner"
          >
            <b-form-input
              id="bucketowner"
              v-model="formData.owner"
              placeholder="Enter owner"
              disabled
            ></b-form-input>
          </b-form-group>
          <!-- current amount -->
          <b-form-group
            label="Current amount"
            label-for="currentamount"
          >
            <b-input-group append="MTRG">
              <b-form-input
                id="currentamount"
                v-model="formData.currentAmount"
                placeholder="Enter amount"
                disabled
              ></b-form-input>
            </b-input-group>
          </b-form-group>
          <!-- extra amount -->
          <b-form-group
            label="Extra amount"
            label-for="extraamount"
          >
            <b-input-group append="MTRG">
              <b-form-input
                id="extraamount"
                v-model="formData.extraAmount"
                placeholder="Enter amount"
                required
                :state="amountValidation"
              ></b-form-input>
              <b-form-invalid-feedback :state="amountValidation" tooltip>
                Your amount must be gt 0 and lte {{ MTRGBalance }}.
              </b-form-invalid-feedback>
            </b-input-group>
          </b-form-group>
          <b-button class="w-100" type="submit" variant="primary">Submit</b-button>
        </b-form>
      </div>
    </template>
    <template #modal-footer>
      <div class="modal-footer w-100 py-4">
        <b-button v-if="updateBucketHash" @click="goMeterScan" class="w-100" type="button" variant="primary">Meter Scan</b-button>
      </div>
    </template>
  </CustomizedModal>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import { BigNumber } from 'bignumber.js'
import { ScriptEngine } from '@meterio/devkit'

import { getMeterScanUrl } from '@/api'

export default {
  name: "UpdateBucketModal",
  props: {
    bucketParams: {
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
    return {
      formData: {
        id: '',
        owner: '',
        currentAmount: '',
        extraAmount: ''
      }
    }
  },
  watch: {
    'bucketParams.data'(v) {
      if (Object.keys(v).length > 0) {
        console.log(this.bucketParams.data)
        const { id, owner, value } = this.bucketParams.data
        this.formData.id = id
        this.formData.owner = owner
        this.formData.currentAmount = new BigNumber(value).div(1e18).toFormat()
      }
    }
  },
  computed: {
    ...mapState('bucket', ['updateBucketLoading']),
    ...mapState('wallet', ['account', 'chainId']),
    ...mapState('token', ['MTRGBalance']),
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
      if (this.formData.extraAmount == '') {
        return
      }
      const amount = new BigNumber(this.formData.extraAmount)
      return amount.gt(0) && amount.lte(this.MTRGBalance)
    }
  },
  methods: {
    ...mapActions({
      'updateBucket': 'bucket/updateBucket'
    }),
    closeModal() {
      this.$emit('close')
    },
    async onSubmit() {
      const fromAddr = this.account
      let dataBuffer = ScriptEngine.getBucketUpdateData(
        fromAddr,
        this.formData.id,
        new BigNumber(this.formData.extraAmount).times(1e18).toFixed()
      );
      const scriptData = '0x' + dataBuffer.toString('hex');
      this.updateBucket({ name: this.bucketParams.data.candidateName, data: scriptData });
    },
    goMeterScan() {
      const url = getMeterScanUrl(this.chainId)
      window.open(`${url}/tx/${this.updateBucketHash}`, '_blank')
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