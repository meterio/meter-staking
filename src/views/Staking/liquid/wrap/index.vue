<template>
  <div>
    <section class="d-flex justify-content-center">
      <b-button pill :variant="opt === 'Wrap' ? 'info' : 'outline-info'" @click="setCurrentOpt('Wrap')">Wrap</b-button>
      <b-button pill :variant="opt === 'Unwrap' ? 'info' : 'outline-info'" class="ml-2" @click="setCurrentOpt('Unwrap')">Unwrap</b-button>
    </section>

    <section class="d-flex justify-content-center my-5">
      <b-form @submit.prevent="onSubmit" class="col-md-4">
        <b-form-group label="Amount:" label-for="amount">
            <b-input-group :append="opt === 'Wrap' ? 'stMTRG' : 'wstMTRG'">
              <b-form-input id="amount" v-model="amount" placeholder="Enter amount" required
                :state="amountValidation"></b-form-input>
              <b-form-invalid-feedback :state="amountValidation" tooltip>
                {{ amountValidationMsg }}
              </b-form-invalid-feedback>
              
            </b-input-group>
            <b-form-text class="d-flex justify-content-between">
              <span>{{ computedMaxValue }}</span>
              <b-button size="sm" class="py-0" pill @click="setMax">max</b-button>
            </b-form-text>
          </b-form-group>
          <b-button class="w-100 mt-4 d-flex align-items-center" type="submit" variant="info" :disabled="loading">
            <b-icon v-if="loading" icon="arrow-clockwise" animation="spin-pulse"></b-icon>{{ computedOpt }}
          </b-button>
          <b-button v-if="hash" class="w-100 mt-2" variant="success" @click="viewOnScan">View on Meter Scan</b-button>
      </b-form>
    </section>
  </div>
</template>

<script>
  import { BigNumber } from 'bignumber.js'
  import { mapActions, mapState } from 'vuex'
  export default {
    name: "StakeWrap",
    data() {
      return {
        loading: false,
        amountValidationMsg: '',
        amount: '',
        opt: 'Wrap',
        hash: '',
      }
    },
    computed: {
      ...mapState('liquid', ['stBalance', 'wstBalance', 'wCurrentAction']),
      ...mapState('token', ['currentNetwork']),
      computedMaxValue() {
        if (this.opt === "Wrap") {
          return new BigNumber(this.stBalance).toFormat(2, 1)
        } else {
          return new BigNumber(this.wstBalance).toFormat(2, BigNumber.ROUND_DOWN)
        }
      },
      computedOpt() {
        if (this.wCurrentAction) {
          return this.wCurrentAction
        }
        return this.opt
      },
      amountValidation() {
        if (this.amount == '') {
          return
        }
        const amount = new BigNumber(this.amount)
        if (amount.isNaN()) {
          this.amountValidationMsg = 'Amount must be a number.'
          return false
        }
        if (amount.lt(0)) {
          this.amountValidationMsg = 'Amount should > 0.'
          return false
        }
        if (this.opt === 'Wrap') {
          // if (amount.plus(this.stBalance).lt(100)) {
          //   this.amountValidationMsg = 'Amount should >= 100.'
          //   return false
          // }
          if (amount.gt(this.stBalance)) {
            this.amountValidationMsg = 'Insufficient balance.'
            return false
          }
        } else {
          if (amount.gt(this.wstBalance)) {
            this.amountValidationMsg = 'Insufficient balance.'
            return false
          }
        }
        return true
      },
    },
    watch: {
      opt() {
        this.hash = ''
      }
    },
    methods: {
      ...mapActions({
        wrap: 'liquid/wrap',
        unwrap: 'liquid/unwrap'
      }),
      async onSubmit() {
        if (!this.amountValidation) return
        if (this.opt === 'Wrap') {
          await this.actionWrap()
        } else {
          await this.actionUnwrap()
        }
        this.amount = ''
      },
      async actionWrap() {
        this.loading = true
        const res = await this.wrap({ amount: this.amount })
        this.loading = false
        if (res.hash) {
          this.hash = res.hash
        }
        if (res.error) {
          alert(res.error)
        }
      },
      async actionUnwrap() {
        this.loading = true
        const res = await this.unwrap({ amount: this.amount })
        this.loading = false
        if (res.hash) {
          this.hash = res.hash
        }
        if (res.error) {
          alert(res.error)
        }
      },
      setCurrentOpt(val) {
        this.opt = val
      },
      setMax() {
        if (this.opt === "Wrap") {
          this.amount = new BigNumber(this.stBalance).toFixed(2, 1)
        } else {
          this.amount = new BigNumber(this.wstBalance).toFixed()
        }
      },
      viewOnScan() {
        window.open(`${this.currentNetwork.blockExplorer}/tx/${this.hash}`)
      }
    }
  }
</script>