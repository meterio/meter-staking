<template>
  <div>
    <section class="d-flex justify-content-center">
      <b-button :variant="opt === 'Deposit' ? 'myprimary' : 'mylight'" @click="setCurrentOpt('Deposit')">Deposit</b-button>
      <b-button :variant="opt === 'Withdraw' ? 'myprimary' : 'mylight'" class="ml-2" @click="setCurrentOpt('Withdraw')">Withdraw</b-button>
    </section>

    <section class="d-flex justify-content-center my-5">
      <b-form @submit.prevent="onSubmit" class="col-md-4">
        <b-form-group label="Amount:" label-for="amount">
            <b-input-group :append="opt === 'Deposit' ? 'MTRG' : 'stMTRG'">
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
          
          <b-button class="w-100 mt-4 d-flex align-items-center" type="submit" variant="myprimary" :disabled="loading">
            <b-icon v-if="loading" icon="arrow-clockwise" animation="spin-pulse"></b-icon>{{ computedOpt }}
          </b-button>
          <b-button v-if="hash" class="w-100 mt-2" variant="success" @click="viewOnScan">View on Meter Scan</b-button>
          <div v-if="opt === 'Deposit'" class="d-flex justify-content-between">
            <span class="text-muted font-small-size">Staked Balance</span>
            <span>{{ computedMaxValue }}</span>
          </div>
      </b-form>
    </section>
  </div>
</template>

<script>
  import { BigNumber } from 'bignumber.js'
  import { mapActions, mapState } from 'vuex'
  export default {
    name: "LiquidStake",
    data() {
      return {
        loading: false,
        amountValidationMsg: '',
        amount: '',
        opt: 'Deposit',
        hash: '',
      }
    },
    computed: {
      ...mapState('token', ['balances']),
      ...mapState('liquid', ['stBalance', 'currentAction']),
      ...mapState('token', ['currentNetwork']),
      computedMaxValue() {
        if (this.opt === "Deposit") {
          return new BigNumber(this.balances.energy).toFormat(2, 1)
        } else {
          return new BigNumber(this.stBalance).toFormat(2, BigNumber.ROUND_DOWN)
        }
      },
      computedOpt() {
        if (this.currentAction) {
          return this.currentAction
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
        if (this.opt === 'Deposit') {
          // if (amount.plus(this.stBalance).lt(100)) {
          //   this.amountValidationMsg = 'Amount should >= 100.'
          //   return false
          // }
          if (amount.gt(this.balances.energy)) {
            this.amountValidationMsg = 'Insufficient balance.'
            return false
          }
        } else {
          if (amount.gt(this.stBalance)) {
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
        deposit: 'liquid/deposit',
        withdraw: 'liquid/withdraw'
      }),
      async onSubmit() {
        if (!this.amountValidation) return
        if (this.opt === 'Deposit') {
          await this.actionDeposit()
        } else {
          await this.actionWithdraw()
        }
        this.amount = ''
      },
      async actionDeposit() {
        this.loading = true
        const res = await this.deposit({ amount: this.amount })
        this.loading = false
        if (res.hash) {
          this.hash = res.hash
        }
        if (res.error) {
          alert(res.error)
        }
      },
      async actionWithdraw() {
        this.loading = true
        const res = await this.withdraw({ amount: this.amount })
        this.loading = false
        if (res.hash) {
          this.hash = res.hash
          alert("Success withdraw, you can check the mature time in Votes tab.")
        }
        if (res.error) {
          alert(res.error)
        }
      },
      setCurrentOpt(val) {
        this.opt = val
      },
      setMax() {
        if (this.opt === "Deposit") {
          this.amount = new BigNumber(this.balances.energy).toFixed(2, 1)
        } else {
          this.amount = new BigNumber(this.stBalance).toFixed()
        }
      },
      viewOnScan() {
        window.open(`${this.currentNetwork.blockExplorer}/tx/${this.hash}`)
      }
    }
  }
</script>