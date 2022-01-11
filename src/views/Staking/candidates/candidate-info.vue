<template>
  <CustomizedModal v-model="infoParams.show" @close="closeModal">
    <template #modal-title>
      <span class="d-block font-weight-bold text-capitalize">candidate infomation</span>
    </template>
    <template #modal-body>
      <Divider />
      <div class="candidate-info-modal-body">
        <div class="info-section mt-1">
          <div class="name">Name</div>
          <div class="font-weight-bold content">{{ infoParams.data.name }}</div>
        </div>
        <div class="info-section mt-1">
          <div class="name">Description</div>
          <div class="font-weight-bold content">{{ infoParams.data.description }}</div>
        </div>
        <div class="info-section mt-1">
          <div class="name">Candidate Address</div>
          <div class="font-weight-bold content">{{ infoParams.data.address }}</div>
        </div>
        <div class="info-section mt-1">
          <div class="name">IP</div>
          <div class="font-weight-bold content">{{ infoParams.data.ipAddr }}</div>
        </div>
        <div class="info-section mt-1">
          <div class="name">Total Votes</div>
          <div class="font-weight-bold content">{{ infoParams.data.totalVotes }} MTRG</div>
        </div>
        <div class="info-section mt-1">
          <div class="name">Public Key</div>
          <div class="font-weight-bold content text-break">{{ infoParams.data.pubKey }}</div>
        </div>
        <div class="info-section mt-1">
          <div class="name">Buckets</div>
          <div
            v-for="(b, index) in infoParams.data.buckets"
            :key="index"
            class="font-weight-bold content text-break"
          >
            <span>#{{ index + 1 }} </span>
            <span>{{ b }}</span>
          </div>
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