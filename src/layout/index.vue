<template>
  <div>
    <QRCodeModal />
    <LogoutModal />
    <Header />
    <router-view />
  </div>
</template>

<script>
import Header from './Header/index.vue'
import QRCodeModal from '@/components/QRCodeModal'
import LogoutModal from '@/components/LogoutModal'
export default {
  name: "Layout",
  components: {
    Header,
    QRCodeModal,
    LogoutModal,
  }
}
</script>

<style lang="sass" scoped>

</style>
