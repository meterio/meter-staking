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
import { mapActions, mapState } from 'vuex'
export default {
  name: 'Wallet',
  components: {
    TopContent,
    BodyContainer,
  },
  data() {
    return {
      timer: null,
    }
  },
  computed: {
    ...mapState('token', ['isSupportNetwork']),
  },
  created() {
    this.timer = setInterval(() => {
      this.getCandidatesNoLoading()
      this.getBucketsNoLoading()
      this.getTokenBalance()
    }, 1000 * 30)
  },
  methods: {
    ...mapActions({
      getCandidatesNoLoading: 'candidate/getCandidatesNoLoading',
      getBucketsNoLoading: 'bucket/getBucketsNoLoading',
      getTokenBalance: 'token/getTokenBalance',
    }),
  },
  beforeDestroy() {
    clearInterval(this.timer)
  },
}
</script>

<style lang="scss" scoped>
</style>
