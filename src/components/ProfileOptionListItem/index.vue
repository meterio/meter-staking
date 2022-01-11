<template>
  <div class="profile-option-list-item" v-b-hover="hoverItem">
    <div class="profile-option-list-item-left">
      <img :src="computedImgSrc" alt="">
      <span :class="['item-name', {active: active}]">{{ option.name}}</span>
    </div>
    <i :class="['right-arrow', {active: active}]"><b-icon icon="chevron-right"></b-icon></i>
  </div>
</template>

<script>
export default {
  name: "ProfileOptionListItem",
  props: {
    option: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      active: false
    }
  },
  computed: {
    computedImgSrc() {
      if (this.active) {
        return `/img/header/${this.option.svg}-active.svg`
      } else {
        return `/img/header/${this.option.svg}.svg`
      }
    }
  },
  methods: {
    hoverItem(hovered) {
      this.active = hovered
    }
  }
}
</script>

<style lang="scss" scoped>
  .profile-option-list-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 20px;
    cursor: pointer;
    border-radius: 4px;
    &:hover {
      background-color: #f8f9fa;
    }
    .profile-option-list-item-left {
      display: flex;
      justify-content: space-between;
      align-items: center;
      .item-name {
        padding: 0 16px;
        color: #3b465c;
        &.active {
          color: #003cb2;
        }
      }
    }
    .right-arrow.active {
      color: #003cb2;
    }
  }
</style>