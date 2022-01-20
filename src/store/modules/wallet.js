import { ethers } from 'ethers'
const namespaced = true

const state = {
  provider: null,
  web3Provider: null,
  signer: null,
  account: '0x',
  chainId: 0,
  balance: 0,

  walletIcons: {},
}

const getters = {}

const mutations = {
  setChainId(state, chainId) {
    state.chainId = chainId
  },
  setAccount(state, account) {
    state.account = account
  },
  setBalance(state, balance) {
    state.balance = balance
  },
  setProvider(state, provider) {
    state.provider = provider
  },
  setWeb3Provider(state, web3Provider) {
    state.web3Provider = web3Provider
  },
  setSigner(state, signer) {
    state.signer = signer
  },
  clearWalletInfo(state) {
    state.provider = null
    state.account = '0x'
    state.chainId = 0
  },

  setWalletIcons(state, icons) {
    state.walletIcons = icons
  },
}

const actions = {
  async actionWalletInfo({ commit, dispatch }, { wallet, account, chainId, balance }) {
    commit('setAccount', String(account).toLowerCase())
    commit('setChainId', Number(chainId))
    commit('setBalance', balance)

    const { provider, icons } = wallet
    if (provider) {
      const web3Provider = new ethers.providers.Web3Provider(provider)
      const signer = web3Provider.getSigner()

      commit('setProvider', provider)
      commit('setWeb3Provider', web3Provider)
      commit('setSigner', signer)
    }
    if (icons) {
      commit('setWalletIcons', icons)
    }

    await dispatch('token/initTokens', null, { root: true })

    dispatch('candidate/getCandidates', null, { root: true })
    dispatch('bucket/getBuckets', null, { root: true })
  },
}

export const wallet = { namespaced, state, getters, mutations, actions }
