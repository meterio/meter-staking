<template>
  <CustomizedModal v-model="infoParams.show" @close="closeModal">
    <template #modal-title>
      <span class="d-block font-weight-bold text-capitalize">bucket infomation</span>
    </template>
    <template #modal-body>
      <Divider />
      <div class="candidate-info-modal-body">
        <div class="info-section mt-1">
          <div class="name">ID</div>
          <div class="font-weight-bold content text-break">{{ infoParams.data.id }}</div>
        </div>
        <div class="info-section mt-1">
          <div class="name">Owner</div>
          <div class="font-weight-bold content text-break">{{ infoParams.data.owner }}</div>
        </div>
        <div class="info-section mt-1">
          <div class="name">Candidate</div>
          <div class="font-weight-bold content">{{ infoParams.data.candidate }}</div>
        </div>
        <div class="info-section mt-1">
          <div class="name">Votes</div>
          <div class="font-weight-bold content">{{ infoParams.data.votes }}</div>
        </div>
        <div class="info-section mt-1">
          <div class="name">Bonus Votes</div>
          <div class="font-weight-bold content">{{ infoParams.data.bonusVotes }}</div>
        </div>
        <div class="info-section mt-1">
          <div class="name">Type</div>
          <div class="font-weight-bold content text-break">{{ infoParams.data.type }}</div>
        </div>
        <div class="info-section mt-1">
          <div class="name">State</div>
          <div class="font-weight-bold content text-break">{{ infoParams.data.unbounded ? "Mature " + infoParams.data.matureFromNow : infoParams.data.state }}</div>
        </div>
      </div>
    </template>
    <template #modal-footer>
      <div class="candidate-info-modal-footer w-100 py-4">
        <b-button @click="closeModal" class="w-100" type="button" variant="primary">Comfirm</b-button>
      </div>
    </template>
  </CustomizedModal>
</template>

<script>

export default {
  name: "CandidateInformationModal",
  props: {
    infoParams: {
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
  methods: {
    closeModal() {
      this.$emit('close')
    }
  }
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