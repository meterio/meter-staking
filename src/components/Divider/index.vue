<template>
  <div :style="divider" class="flex-grow-0"></div>
</template>

<script>
export default {
  name: "Divider",
  props: {
    color: {
      type: String,
      default: '#f3f4f7'
    },
    pxl: {
      type: String,
      default: '1'
    },
    vertical: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    divider() {
      if (!this.vertical) {
        return {
          backgroundColor: this.color,
          height: this.pxl + 'px'
        }
      }
      return {
        backgroundColor: this.color,
        width: this.pxl + 'px',
      }
    },
  }
}
</script>

<style lang="scss" scoped>

</style>