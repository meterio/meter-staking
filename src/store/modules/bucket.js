import { getBuckets } from '@/api'

const namespaced = true

const state = {
  loading: true,
  buckets: [],
}

const getters = {}

const mutations = {
  setLoading(state, loading) {
    state.loading = loading
  },
  setBuckets(state, buckets) {
    state.buckets = buckets
  },
}

const actions = {
  async getBuckets({ rootState, state, commit }) {
    commit('setLoading', true)
    const buckets = await getBuckets(rootState.wallet.chainId)
    commit('setBuckets', buckets)
    commit('setLoading', false)
  },
}

export const bucket = { namespaced, state, getters, mutations, actions }
