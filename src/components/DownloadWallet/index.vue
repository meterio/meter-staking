<template>
  <div class="download d-flex">
    <span>Don't have wallet?</span>
    <a class="text-myprimary-color" :href="link" target="_blank">Download here</a>
  </div>
</template>

<script>
export default {
  name: "Header",
  props: {
    link: {
      type: String,
      default: 'https://metamask.io/download.html'
    }
  }
}
</script>

<style lang="scss" scoped>
  .download {
    font-weight: 600;
    span {
      color: #9fa8ba;
    }
    a {
      &:hover {
        color: #000;
      }
    }
  }
</style>