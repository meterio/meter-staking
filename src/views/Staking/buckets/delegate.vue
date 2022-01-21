<template>
  <CustomizedModal v-model="bucketParams.show" @close="closeModal">
    <template #modal-title>
      <span class="d-block font-weight-bold text-capitalize">delegate vote</span>
    </template>
    <template #modal-body>
      <Divider />
      <div v-if="computedDelegateLoading" class="d-flex justify-content-center py-5">
        <div class="spinner-border" role="status">
          <span class="sr-only">Loading...</span>
        </div>
      </div>
      <div v-else class="modal-body">
        <b-form @submit.prevent="onSubmit">
          <!-- bucket id -->
          <b-form-group
            label="Vote ID:"
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
            label="Vote owner:"
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
            <b-input-group :append="currentNetwork.governanceTokenSymbol || ''">
              <b-form-input
                id="currentamount"
                v-model="formData.currentAmount"
                placeholder="Enter amount"
                disabled
              ></b-form-input>
            </b-input-group>
          </b-form-group>
          <!-- current candidate -->
          <b-form-group
            label="Current Candidate:"
            label-for="currentcandidate"
          >
            <b-form-input
              id="currentcandidate"
              v-model="formData.candidate"
              placeholder="Enter candidate"
              disabled
            ></b-form-input>
          </b-form-group>
          <!-- new candidate -->
          <b-form-group label="New Candidate:" label-for="newcandidate">
            <b-form-select
              id="newcandidate"
              v-model="formData.newCandidate"
              :options="candidateOptions"
              required
            ></b-form-select>
          </b-form-group>
          <!-- enable auto bid -->
          <b-form-group>
            <b-form-checkbox v-model="formData.autoBid">Enable auto-bid</b-form-checkbox>
          </b-form-group>
          <b-button class="w-100" type="submit" variant="primary">Submit</b-button>
        </b-form>
      </div>
    </template>
    <template #modal-footer>
      <div class="modal-footer w-100 py-4">
        <b-button v-if="delegateHash" @click="goMeterScan" class="w-100" type="button" variant="primary">Meter Scan</b-button>
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
  name: "DelegateModal",
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
        candidate: '',
        newCandidate: '',
        currentAmount: '',
        autoBid: true
      }
    }
  },
  watch: {
    'bucketParams.data'(v) {
      if (Object.keys(v).length > 0) {
        console.log(this.bucketParams.data)
        const { id, owner, value, candidate } = this.bucketParams.data
        this.formData.id = id
        this.formData.owner = owner
        this.formData.candidate = candidate
        this.formData.currentAmount = new BigNumber(value).div(1e18).toFormat()
      }
    }
  },
  computed: {
    ...mapState('candidate', ['candidates']),
    ...mapState('bucket', ['delegateLoading']),
    ...mapState('wallet', ['account', 'chainId']),
    ...mapState('token', ['currentNetwork']),
    computedDelegateLoading() {
      const hash = this.delegateLoading[this.bucketParams.data.candidateName]
      if (hash) {
        if (hash === 'start' || String(hash).includes('0x')) {
          return true
        }
      }
      return false
    },
    delegateHash() {
      const hash = this.delegateLoading[this.bucketParams.data.candidateName]
      if (hash && String(hash).includes('0x')) {
        return hash
      }
      return ''
    },
    candidateOptions() {
      const formatCandidate = this.candidates
        .map((c) => {
          return {
            text:
              c.name +
              "   (" +
              c.address.substr(0, 8) +
              "..." +
              c.address.substr(c.address.length - 6) +
              ")",
            value: c.address,
          };
        })
        .sort((a, b) => {
          return Math.random() > 0.5 ? 1 : -1;
        });
      return [
        {
          text: 'Choose new candidate',
          value: ''
        },
        ...formatCandidate
      ]
    },
  },
  methods: {
    ...mapActions({
      'delegate': 'bucket/delegate'
    }),
    closeModal() {
      this.$emit('close')
    },
    async onSubmit() {
      const value = new BigNumber(this.bucketParams.data.value).toFixed();
      let holderAddr = this.account;
      const dataBuffer = ScriptEngine.getDelegateData(
        holderAddr,
        this.formData.newCandidate,
        this.formData.id,
        value,
        undefined,
        undefined,
        this.formData.autoBid ? 100 : 0
      );
      const scriptData = '0x' + dataBuffer.toString('hex');
      this.delegate({ name: this.bucketParams.data.candidateName, data: scriptData });
    },
    goMeterScan() {
      const url = getMeterScanUrl(this.chainId)
      window.open(`${url}/tx/${this.delegateHash}`, '_blank')
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