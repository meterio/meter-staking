<template>
  <div class="user-profile" ref="userProfile">
    <button class="user-profile-btn rounded-pill d-flex justify-content-between align-items-center p-2">
      <span class="user-profile-btn-img" v-html="computedIcon"></span>
      <span class="mx-1 font-small-size">{{ computedAccount }}</span>
      <b-icon scale="0.9" icon="chevron-down"></b-icon>
    </button>
    <ProfilePanel ref="profilePanel" v-show="showProfilePanel" />
  </div>
</template>

<script>
import ProfilePanel from './ProfilePanel.vue';
import { mapState } from 'vuex'

import { regExpList } from '@/constants'
export default {
  name: "User",
  components: {
    ProfilePanel
  },
  data() {
    return {
      showProfilePanel: false
    }
  },
  computed: {
    ...mapState('wallet', ['account', 'walletIcon']),
    computedIcon() {
      return this.walletIcon
    },
    computedAccount() {
      if (new RegExp(regExpList.address).test(this.account)) {
        return this.account.substr(0, 4) + '...' + this.account.substr(-4)
      } else {
        return ''
      }
    }
  },
  mounted() {
    document.addEventListener('click', this.clickEventCallback, { capture: true })
  },
  methods: {
    clickEventCallback(e) {
      
      if (this.$refs.userProfile && this.$refs.userProfile.contains(e.target)) {
        if (this.$refs.profilePanel && this.$refs.profilePanel.$refs.copyAddress.$el && this.$refs.profilePanel.$refs.copyAddress.$el.contains(e.target)) {
          return
        }
        return this.showProfilePanel = !this.showProfilePanel
      }

      this.showProfilePanel = false
    }
  },
  beforeDestroy() {
    document.removeEventListener('click', this.clickEventCallback)
  }
}
</script>

<style lang="scss" scoped>
  .user-profile {
    .user-profile-btn {
      border: 1px solid transparent;
      height: 40px;
      .user-profile-btn-img {
        ::v-deep svg {
          width: 20px !important;
          height: 20px !important;
        }
        ::v-deep img {
          width: 20px;
          height: 20px;
        }
      }
    }
  }
</style>