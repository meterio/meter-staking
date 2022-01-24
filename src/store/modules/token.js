import { BigNumber } from 'bignumber.js'
import { getCurrentNetwork, getSupportNetworkListByMode, getBalance } from '@/api'

const namespaced = true
const state = {
  renderLoading: false,
  currentNetwork: {},
  balances: {
    native: 0,
    energy: 0,
    bound: 0,
  },

  isSupportNetwork: true,
}

const getters = {}

const mutations = {
  setBalances(state, { native, energy, bound }) {
    state.balances = Object.assign({}, { ...state.balances }, { native, energy, bound })
  },
  setRenderLoading(state, renderLoading) {
    state.renderLoading = renderLoading
  },
  setCurrentNetwork(state, currentNetwork) {
    state.currentNetwork = currentNetwork
  },
  setIsSupportNetwork(state, isSupportNetwork) {
    state.isSupportNetwork = isSupportNetwork
    if (!isSupportNetwork) {
      state.renderLoading = false
    }
  },

  clearRelevantInfo(state) {
    state.renderLoading = false
    state.balances = {}
    state.currentNetwork = {}
    state.showSendModal = false
  },
}

const actions = {
  async initTokens({ rootState, state, commit, dispatch }) {
    console.log('init tokens data')
    const chainId = rootState.wallet.chainId

    const supportNetworkList = getSupportNetworkListByMode()
    const supportnetworkIdList = supportNetworkList.map((network) => network.networkId)
    if (!supportnetworkIdList.includes(chainId)) {
      commit('setIsSupportNetwork', false)
      commit('clearRelevantInfo')

      return
    } else {
      commit('setIsSupportNetwork', true)
    }
    if (state.renderLoading) {
      return
    }
    commit('setRenderLoading', true)

    const currentNetwork = getCurrentNetwork(chainId)
    commit('setCurrentNetwork', currentNetwork)

    try {
      await dispatch('getTokenBalance')
    } catch (e) {
      console.log('occur some error: ', e)
    } finally {
      commit('setRenderLoading', false)
    }
  },
  async getTokenBalance({ rootState, commit }) {
    console.log('get tokens balance')
    const account = rootState.wallet.account
    const data = await getBalance(state.currentNetwork.infoUrl, account)

    if (!data) {
      return
    }

    commit('setBalances', {
      native: new BigNumber(data.energy).div(1e18),
      energy: new BigNumber(data.balance).div(1e18),
      bound: new BigNumber(data.boundbalance).div(1e18),
    })
  },
}

export const token = { namespaced, state, getters, mutations, actions }
