<template>
  <div class="copy-address" v-b-hover="hoverAddress" @click="copy">
    <div class="account-address">{{ computedAddress }}</div>
    <div class="opt-flag" v-if="showOptFlag">
      <b-icon class="opt-icon" :icon="computedIcon" :variant="computedStatus" :animation="computedAnimation"></b-icon>
    </div>
  </div>
</template>

<script>
import * as clipboard from "clipboard-polyfill/text"
export default {
  name: "CopyAddress",
  props: {
    short: {
      type: Boolean,
      default: false
    },
    account: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      address: '0x57e7e16A2326DC41d02402103A73b4464A8B3EEb',
      showOptFlag: false,
      // -1 before copy, 0 coping, 1 success
      coping: -1
    }
  },
  computed: {
    computedAddress() {
      return this.short ? this.account.substr(0, 6) + '...' + this.account.substr(-4) : this.account
    },
    computedIcon() {
      switch (this.coping) {
        case -1:
          return 'stickies-fill'
        case 0:
          return 'arrow-clockwise'
        case 1:
          return 'check2-circle'
        default:
          return 'stickies-fill'
      }
    },
    computedStatus() {
      if (this.coping === 1) {
        return 'success'
      }
      return ''
    },
    computedAnimation() {
      if (this.coping === 0) {
        return 'spin'
      }
      return ''
    }
  },
  methods: {
    hoverAddress(hovered) {
      this.showOptFlag = hovered
    },
    copy() {
      this.coping !== -1 || this.clipboard()
    },
    clipboard() {
      this.coping = 0
      clipboard.writeText(this.account).then(
        () => {
          console.log("copy success!")
          this.coping = 1
          setTimeout(() => {
            this.coping = -1
          }, 1000);
        },
        () => {
          console.log("copy error!")
        }
      )
    }
  }
}
</script>

<style lang="scss" scoped>
  .copy-address {
    position: relative;
    display: flex;
    align-items: center;
    background-color: #f3f4f7;
    border-radius: 4px;
    padding: 0 12px;
    height: 34px;
    cursor: pointer;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    .account-address {
      font-size: 10px;
      font-weight: 600;
      color: #6e798f;
    }
    .opt-flag {
      position: absolute;
      right: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 4px;
      width: 34px;
      height: 34px;
      background-color: #dcdfe6;
    }
  }
</style>