<template>
  <CustomizedModal v-model="infoParams.show" @close="closeModal">
    <template #modal-title>
      <span class="d-block text-capitalize">candidate information</span>
    </template>
    <template #modal-body>
      <Divider />
      <div class="candidate-info-modal-body">
        <div class="section">
          <div class="name">Name</div>
          <div class="content">{{ infoParams.data.name }}</div>
        </div>
        <div class="section">
          <div class="name">Description</div>
          <div class="content">{{ infoParams.data.description }}</div>
        </div>
        <div class="section">
          <div class="name">Address</div>
          <div class="content">
            <AddressLable :address="infoParams.data.address" />
          </div>
        </div>
        <div class="section">
          <div class="name">IP</div>
          <div class="content">{{ infoParams.data.ipAddr }}</div>
        </div>
        <div class="section">
          <div class="name">Total Votes</div>
          <div class="content">
            {{ computedTotalVotes + ' ' + currentNetwork.governanceTokenSymbol || '' }}
          </div>
        </div>
        <div class="section">
          <div class="name">Public Key</div>
          <div class="content text-break">{{ infoParams.data.pubKey }}</div>
        </div>
      </div>
    </template>
    <template #modal-footer>
      <div class="candidate-info-modal-footer w-100 py-4">
        <b-button @click="closeModal" class="w-100" type="button" variant="primary">Ok</b-button>
      </div>
    </template>
  </CustomizedModal>
</template>

<script>
import BigNumber from 'bignumber.js'
import { mapState } from 'vuex'

export default {
  name: 'CandidateInformationModal',
  props: {
    infoParams: {
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
    ...mapState('token', ['currentNetwork']),
    computedTotalVotes() {
      return new BigNumber(this.infoParams.data.totalVotes).div(1e18).toFormat(2)
    },
  },
  methods: {
    closeModal() {
      this.$emit('close')
    },
  },
}
</script>

<style lang="scss" scoped>
.candidate-info-modal-body {
  padding: 0 32px;
}
.candidate-info-modal-footer {
  padding: 0 32px;
  overflow-y: auto;
}
</style>