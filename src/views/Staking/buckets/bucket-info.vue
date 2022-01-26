<template>
  <CustomizedModal v-model="infoParams.show" @close="closeModal">
    <template #modal-title>
      <span class="d-block text-capitalize">vote information</span>
    </template>
    <template #modal-body>
      <Divider />
      <div class="candidate-info-modal-body">
        <div class="section">
          <div class="name">Vote ID</div>
          <div class="content text-break">{{ infoParams.data.id }}</div>
        </div>
        <div class="section">
          <div class="name">From</div>
          <div class="content text-break">{{ infoParams.data.owner }}</div>
        </div>
        <div class="section">
          <div class="name">To</div>
          <div class="content">
            <AddressLable :address="infoParams.data.candidate" />
          </div>
        </div>
        <div class="section">
          <div class="name">Votes</div>
          <div class="content">{{ infoParams.data.votes }}</div>
        </div>
        <div class="section">
          <div class="name">Bonus Votes</div>
          <div class="content">{{ infoParams.data.bonus }}</div>
        </div>
        <div class="section">
          <div class="name">Autobid</div>
          <div class="content text-break">{{ infoParams.data.type }}</div>
        </div>
        <div class="section">
          <div class="name">State</div>
          <div class="content text-break">
            {{ infoParams.data.unbounded ? 'Mature ' + infoParams.data.matureFromNow : infoParams.data.state }}
          </div>
        </div>
      </div>
    </template>
    <template #modal-footer>
      <div class="candidate-info-modal-footer w-100 py-4">
        <b-button @click="closeModal" class="w-100" type="button" variant="primary">OK</b-button>
      </div>
    </template>
  </CustomizedModal>
</template>

<script>
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