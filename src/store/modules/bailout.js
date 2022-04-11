import { getJaileds } from '@/api'

const namespaced = true

const state = {
  getJailedsloading: true,
  bailOutLoading: {},
  jaileds: [],
}

const getters = {}

const mutations = {
  setGetJailedsloading(state, loading) {
    state.getJailedsloading = loading
  },
  setBailOutLoading(state, { name, hash }) {
    state.bailOutLoading = Object.assign({}, { ...state.bailOutLoading }, { [name]: hash })
  },
  setJaileds(state, jaileds) {
    state.jaileds = jaileds
  },
}

const actions = {
  async getJaileds({ rootState, commit }) {
    console.log('get jaileds')
    commit('setGetJailedsloading', true)
    const jaileds = await getJaileds(rootState.token.currentNetwork.infoUrl)
    commit('setJaileds', jaileds)
    commit('setGetJailedsloading', false)
  },
  async bailOut({ rootState, commit, dispatch }, { name, data }) {
    try {
      commit('setBailOutLoading', { name, hash: 'start' })
      console.log('scriptData', data)
      const contractAddress = rootState.token.currentNetwork.stakingAddress
      const tx = await rootState.wallet.signer.sendTransaction({
        to: contractAddress,
        value: 0,
        data,
      })
      console.log('tx', tx)
      commit('setBailOutLoading', { name, hash: tx.hash })

      await tx.wait()

      commit('setBailOutLoading', { name, hash: 'end' })

      dispatch('getJaileds')
    } catch (e) {
      console.log(e)
      commit('setBailOutLoading', { name, hash: 'end' })

      return `${e.message} ${e.data && e.data.error && e.data.error.message}`
    }
  },
}

export const bailout = { namespaced, state, getters, mutations, actions }
