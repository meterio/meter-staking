<template>
  <div class="wallet">
    <TopContent />
    <!-- token table -->
    <BodyContainer v-if="isSupportNetwork" />
    <div v-else class="alert alert-danger mt-2 text-center font-weight-bold" role="alert">Unsupport network</div>
  </div>
</template>

<script>
import TopContent from './top.vue'
import BodyContainer from './body-container.vue'
import { mapState } from 'vuex'
export default {
  name: "Wallet",
  components: {
    TopContent,
    BodyContainer
  },
  computed: {
    ...mapState('token', ['isSupportNetwork'])
  }
}
</script>

<style lang="scss" scoped>
  
</style>
