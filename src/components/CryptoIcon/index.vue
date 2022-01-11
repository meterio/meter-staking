<template>
  <div :style="cryptoStyle" class="d-flex justify-content-center align-items-center position-relative">
    {{ name.charAt(0) }}
    <img class="crypto-logo position-absolute" :src="imgUri" :style="computedStyle" alt="" onerror="this.style.display='none'">
  </div>
</template>
<script>
export default {
  name: "CryptoIcon",
  props: {
    name: {
      type: String,
      default: ''
    },
    imgUri: {
      type: String,
      required: true
    },
    width: {
      type: Number,
      default: 20
    },
    height: {
      type: Number,
      default: 20
    }
  },
  computed: {
    cryptoStyle() {
      return {
        width: this.width + 'px',
        height: this.height + 'px',
        backgroundColor: '#cfe3f6',
        color: '#fff',
        borderRadius: '50%',
        overflow: 'hidden'
      }
    },
    computedStyle() {
      return {
        top: '-1px',
        left: '-1px',
        width: (this.width+2) + 'px',
        height: (this.height+2) + 'px',
      }
    }
  }
}
</script>
<style lang="scss" scoped>
  .crypto-logo {
    background-color: #fff;
  }
</style>