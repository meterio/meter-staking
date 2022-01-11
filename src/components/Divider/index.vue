<template>
  <div :style="divider"></div>
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
    }
  },
  computed: {
    divider() {
      return {
        backgroundColor: this.color,
        height: this.pxl + 'px'
      }
    }
  }
}
</script>

<style lang="scss" scoped>

</style>