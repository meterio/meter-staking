<template>
  <div class="wallet">
    <TopContent v-if="!isMobile" />
    <MobileTop v-else />
    <!-- token table -->
    <BodyContainer v-if="isSupportNetwork" />
    <div v-else class="alert alert-danger mt-2 text-center font-weight-bold" role="alert">Unsupported network</div>
  </div>
</template>

<script>
import TopContent from './top.vue'
import MobileTop from './topMobile.vue'
import BodyContainer from './body-container.vue'
import { mapActions, mapState } from 'vuex'
import { WalletBoardBus } from '@/WalletBoard'
export default {
  name: 'Wallet',
  components: {
    TopContent,
    BodyContainer,
    MobileTop
  },
  data() {
    return {
      timer: null,
    }
  },
  computed: {
    ...mapState('token', ['isSupportNetwork']),
    ...mapState('wallet', ['isMobile'])
  },
  watch: {
    isSupportNetwork: {
      handler(val) {
        if (!val) {
          WalletBoardBus.$emit('setChain', 82)
        }
      },
      immediate: true
    }
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
