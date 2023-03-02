import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

import { wallet } from '@/store/modules/wallet'
import { token } from '@/store/modules/token'

import { candidate } from './modules/candidate'
import { bucket } from './modules/bucket'
import { modal } from './modules/modal'
import { bailout } from './modules/bailout'
import { auction } from './modules/auction'
import { liquid } from './modules/liquid'

export default new Vuex.Store({
  state: {},
  mutations: {},
  actions: {},
  modules: {
    wallet,
    token,

    candidate,
    bucket,
    modal,
    bailout,
    auction,
    liquid,
  },
})
