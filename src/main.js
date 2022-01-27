import Vue from 'vue'
import { BootstrapVue, BootstrapVueIcons } from 'bootstrap-vue'
import App from './App.vue'
import router from './router'
import store from './store'

// import 'bootstrap/dist/css/bootstrap.css'
// import 'bootstrap-vue/dist/bootstrap-vue.css'

import './scss/style.scss'

Vue.use(BootstrapVue)
Vue.use(BootstrapVueIcons)

Vue.config.productionTip = false

import Divider from '@/components/Divider'
import CustomizedModal from '@/components/CustomizedModal'
import CryptoIcon from '@/components/CryptoIcon'
import AddressLable from '@/components/AddressLable'

Vue.component(Divider.name, Divider)
Vue.component(CustomizedModal.name, CustomizedModal)
Vue.component(CryptoIcon.name, CryptoIcon)
Vue.component(AddressLable.name, AddressLable)

Vue.filter('abbr', function (value) {
  if (!value) return ''
  value = value.toString()
  return value.substr(0, 12) + '...'
})

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app')
