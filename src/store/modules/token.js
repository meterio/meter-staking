import { ethers } from 'ethers'
import { BigNumber } from 'bignumber.js'

import erc20 from '@/constants/erc20.json'
import { getCurrentNetwork, getSupportNetworkListByMode } from '@/api'
import { tokens } from '@/constants'

const namespaced = true
const state = {
  renderLoading: false,
  currentNetwork: {},
  MTRGBalance: 0,

  isSupportNetwork: true,
}

const getters = {}

const mutations = {
  setMTRGBalance(state, MTRGBalance) {
    state.MTRGBalance = MTRGBalance
  },
  setRenderLoading(state, renderLoading) {
    state.renderLoading = renderLoading
  },
  setCurrentNetwork(state, currentNetwork) {
    state.currentNetwork = currentNetwork
  },
  setCloseSendModal(state) {
    state.showSendModal = false
  },
  setIsSupportNetwork(state, isSupportNetwork) {
    state.isSupportNetwork = isSupportNetwork
    if (!isSupportNetwork) {
      state.renderLoading = false
    }
  },

  clearRelevantInfo(state) {
    state.renderLoading = false
    state.MTRGBalance = 0
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
  async getTokenBalance({ state, commit, dispatch }) {
    console.log('get tokens balance')

    const balance = await dispatch('getNewToken')
    commit('setMTRGBalance', balance)
  },
  async updateToken({ state, dispatch }) {
    const balance = await dispatch('getNewToken')
    commit('setMTRGBalance', balance)
  },
  async getNewToken({ rootState, state }) {
    const web3Provider = rootState.wallet.web3Provider
    const signer = rootState.wallet.signer
    const account = rootState.wallet.account
    const chainId = rootState.wallet.chainId

    const token = tokens.find((t) => t.chainId === chainId)

    let balance = 0
    if (token.native) {
      balance = await signer.getBalance(ethers.providers.balance)
    } else {
      const contract = new ethers.Contract(token.address, erc20, web3Provider)
      balance = await contract.balanceOf(account)
    }

    const _balance = new BigNumber(String(balance)).div(`1e${token.decimals}`)

    return _balance
  },
}

export const token = { namespaced, state, getters, mutations, actions }
