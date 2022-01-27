import { getAuctions, getBest } from '@/api'

const namespaced = true

const state = {
  getAuctionsloading: true,
  bidLoading: {},
  auctions: [],
  best: {},
}

const getters = {}

const mutations = {
  setGetAuctionsloading(state, loading) {
    state.getAuctionsloading = loading
  },
  setBidLoading(state, { name, hash }) {
    state.bidLoading = Object.assign({}, { ...state.bidLoading }, { [name]: hash })
  },
  setAuctioins(state, auctions) {
    state.auctions = auctions
  },
  setBest(state, best) {
    state.best = best
  },
}

const actions = {
  async getBest({ rootState, commit }) {
    const best = await getBest(rootState.token.currentNetwork.infoUrl)
    commit('setBest', best)
  },
  async getAuctions({ rootState, commit }) {
    console.log('get auctions')
    commit('setGetAuctionsloading', true)
    const auctions = await getAuctions(rootState.token.currentNetwork.infoUrl)
    commit('setAuctioins', auctions)
    commit('setGetAuctionsloading', false)
  },
  async auctionBid({ rootState, commit, dispatch }, { name, data }) {
    try {
      commit('setBidLoading', { name, hash: 'start' })
      console.log('scriptData', data)
      const contractAddress = rootState.token.currentNetwork.stakingAddress
      const tx = await rootState.wallet.signer.sendTransaction({
        to: contractAddress,
        value: 0,
        data,
      })
      console.log('tx', tx)
      commit('setBidLoading', { name, hash: tx.hash })

      await tx.wait()

      commit('setBidLoading', { name, hash: 'end' })

      dispatch('getAuctions')
    } catch (e) {
      console.log(e)
      commit('setBidLoading', { name, hash: 'end' })
    }
  },
}

export const auction = { namespaced, state, getters, mutations, actions }
