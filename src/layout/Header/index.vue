<template>
  <div class="header position-fixed fixed-top d-flex flex-column flex-lg-row justify-content-lg-between align-items-center px-lg-4 px-3">
    <div class="header-left w-100 d-flex justify-content-between">
      <div class="header-logo-content d-flex align-items-center">
        <Logo />
      </div>
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
    computedIcon() {
      return this.headerUserOperationActive ? 'x' : 'list'
    },
    computedClass() {
      return this.headerUserOperationActive ? [
        'd-flex'
      ] : [
        'd-none'
      ]
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
  .header {
    min-height: 80px;
    background-color: #fff;
    z-index: 1;
    .header-left {
      height: 80px;
      .header-logo-content {
        .span-wallet-v2 {
          white-space: nowrap;
          font-size: 23px;
          line-height: 80px;
        }
      }
      .more-operation {
        .more-operation-btn {
          background-color: #fff;
        }
        .icon-outer-box {
          pointer-events: none;
        }
      }
    }
  }
</style>