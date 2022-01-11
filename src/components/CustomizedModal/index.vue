<template>
  <b-modal v-model="computedShow" centered no-close-on-backdrop no-close-on-esc @close="closeModal">
    <template #modal-title>
      <slot name="modal-title"/>
    </template>
    <template #modal-header-close>
      <span v-if="!closable"></span>
    </template>
    <template #default>
      <slot name="modal-body"/>
    </template>
    <template #modal-footer>
      <slot name="modal-footer"/>
    </template>
  </b-modal>
</template>

<script>
export default {
  name: "CustomizedModal",
  props: {
    value: {
      type: Boolean,
      required: true
    },
    closable: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    computedShow: {
      get() {
        return this.value
      },
      set() {
        this.$emit('close')
      }
    }
  },
  methods: {
    closeModal(e) {
      if (!this.closable) {
        e.preventDefault()
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  ::v-deep .modal-content {
    border-radius: 12px;
    overflow: hidden;
  }
  ::v-deep .modal-header {
    padding: 32px;
    border-bottom: none;
  }
  ::v-deep .modal-title {
    width: 100%;
  }
  ::v-deep .modal-body {
    padding: 0px;
  }
  ::v-deep .modal-footer {
    padding: 0px;
    border-top: none;
    & > * {
      margin: 0px;
    }
  }
</style>