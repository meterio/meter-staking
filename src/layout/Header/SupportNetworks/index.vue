<template>
  <div class="support-network mr-2" ref="supportNetBtn">
    <button class="btn support-network-btn rounded-pill p-2">
      <span v-if="currentNetwork.name" class="d-flex align-items-center">
        <img width="25" height="25" :src="`/img/header/supportnet/${currentNetwork.nativeTokenSymbol.toLowerCase()}.png`" alt="">
        <span class="ml-1">{{ currentNetwork.name }}</span>
      </span>
      <span v-else>SupportNetworks</span>
    </button>
    <NetList v-show="netListActive" class="net-list position-absolute container right-3 right-lg-4 right-sm-0" />
  </div>
</template>

<script>
import { mapState } from 'vuex'
import NetList from './NetList.vue'
export default {
  name: "SupportNetworks",
  components: {
    NetList
  },
  data() {
    return {
      netListActive: false
    }
  },
  computed: {
    ...mapState('token', ['currentNetwork'])
  },
  mounted() {
    document.addEventListener('click', this.clickSupportNetBtn, { capture: true })
  },
  methods: {
    clickSupportNetBtn(e) {
      if (this.$refs.supportNetBtn && this.$refs.supportNetBtn.contains(e.target)) {
        return this.netListActive = !this.netListActive
      }

      this.netListActive = false
    }
  },
  beforeDestroy() {
    document.removeEventListener('click', this.clickSupportNetBtn)
  }
}
</script>

<style lang="scss" scoped>
  .support-network {
    .support-network-btn {
      box-shadow: none;
      background-color: #fff;
      height: 40px;
      &:hover {
        background-color: rgb(239, 239, 239);
      }
    }
    .net-list {
      border: 1px solid #e9ecef;
      border-radius: 3px;
      background-color: #fff;
      top: 80px;
      max-width: 480px;
      z-index: 1;
    }
  }
</style>