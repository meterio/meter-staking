<template>
  <div class="header position-fixed fixed-top d-flex flex-column flex-lg-row justify-content-lg-between  px-lg-4 px-3">
    <div class="header-left w-100 d-flex justify-content-between">
      <Logo />
      <div class="more-operation d-flex d-lg-none d-block">
        <button ref="moreBtn" class="more-operation-btn font-xlarge-size font-weight-bold">
          <div class="icon-outer-box">
            <b-icon :icon="computedIcon"></b-icon>
          </div>
        </button>
      </div>
    </div>
    <div ref="operationList" class="operation-list w-100 flex-column flex-lg-row d-lg-flex justify-content-lg-end" :class="computedClass">
      <SupportNetworks class="mb-2 mb-lg-0" />
      <UserProfile class="mb-2 mb-lg-0" />
    </div>
  </div>
</template>

<script>
import Logo from '@/components/Logo';
import UserProfile from './UserProfile';
import SupportNetworks from './SupportNetworks';
import { mapMutations, mapState } from 'vuex';
export default {
  name: "Header",
  components: {
    Logo,
    UserProfile,
    SupportNetworks
  },
  computed: {
    ...mapState('modal', ['headerUserOperationActive']),
    ...mapState('token', ['currentNetwork']),
    computedIcon() {
      return this.headerUserOperationActive ? 'x' : 'list'
    },
    computedClass() {
      return this.headerUserOperationActive ? [
        'd-flex'
      ] : [
        'd-none'
      ]
    },
    logoParams() {
      return {
        src: '/img/header/supportnet/' + String(this.currentNetwork.nativeTokenSymbol).toLowerCase() + '.png',
        name: this.currentNetwork.name
      }
    }
  },
  mounted() {
    document.addEventListener('click', this.clickMoreBtnEvent)
  },
  methods: {
    ...mapMutations({
      setHeaderUserOperationActive: 'modal/setHeaderUserOperationActive'
    }),
    clickMoreBtnEvent(e) {
      if (this.$refs.moreBtn === e.target) {
        return this.setHeaderUserOperationActive()
      }

      if (this.$refs.operationList && this.$refs.operationList.contains(e.target)) {
        return
      }

      this.setHeaderUserOperationActive(false)
    }
  },
  beforeDestroy() {
    document.removeEventListener('click', this.clickMoreBtnEvent)
  }
}
</script>

<style lang="scss" scoped>
  @import "@/scss/color.scss";
  .header {
    min-height: 53px;
    background-color: #fff;
    z-index: 1;
    .header-left {
      height: 53px;
      .more-operation {
        .more-operation-btn {
          background-color: #fff;
        }
        .icon-outer-box {
          pointer-events: none;
        }
      }
    }
    .operation-list {
      border-top: 1px solid $bg-color;
    }
  }
</style>