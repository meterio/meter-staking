import { getBuckets, getTxAddress } from '@/api'

const namespaced = true

const state = {
  loading: true,
  buckets: [],
  updateBucketLoading: {},
  delegateLoading: {},
  unboundLoading: {},
  undelegateLoading: {},
}

const getters = {}

const mutations = {
  setLoading(state, loading) {
    state.loading = loading
  },
  setBuckets(state, buckets) {
    state.buckets = buckets
  },
  setUpdateBucketLoading(state, { name, hash }) {
    state.updateBucketLoading = Object.assign({}, { ...state.updateBucketLoading }, { [name]: hash })
  },
  setDelegateLoading(state, { name, hash }) {
    state.delegateLoading = Object.assign({}, { ...state.delegateLoading }, { [name]: hash })
  },
  setUnboundLoading(state, { name, hash }) {
    state.unboundLoading = Object.assign({}, { ...state.unboundLoading }, { [name]: hash })
  },
  setUndelegateLoading(state, { name, hash }) {
    state.undelegateLoading = Object.assign({}, { ...state.undelegateLoading }, { [name]: hash })
  },
}

const actions = {
  async getBuckets({ rootState, commit }) {
    commit('setLoading', true)
    const buckets = await getBuckets(rootState.wallet.chainId)
    commit('setBuckets', buckets)
    commit('setLoading', false)
  },
  async getBucketsNoLoading({ rootState, commit }) {
    const buckets = await getBuckets(rootState.wallet.chainId)
    commit('setBuckets', buckets)
  },
  async updateBucket({ rootState, commit, dispatch }, { name, data }) {
    try {
      commit('setUpdateBucketLoading', { name, hash: 'start' })
      console.log('scriptData', data)
      const contractAddress = getTxAddress(rootState.wallet.chainId)
      const tx = await rootState.wallet.signer.sendTransaction({
        to: contractAddress,
        value: 0,
        data,
      })
      console.log('tx', tx)
      commit('setUpdateBucketLoading', { name, hash: tx.hash })

      await tx.wait()

      commit('setUpdateBucketLoading', { name, hash: 'end' })

      dispatch('getBuckets')
    } catch (e) {
      console.log(e)
      commit('setUpdateBucketLoading', { name, hash: 'end' })
    }
  },
  async delegate({ rootState, commit, dispatch }, { name, data }) {
    try {
      commit('setDelegateLoading', { name, hash: 'start' })
      console.log('scriptData', data)
      const contractAddress = getTxAddress(rootState.wallet.chainId)
      const tx = await rootState.wallet.signer.sendTransaction({
        to: contractAddress,
        value: 0,
        data,
      })
      console.log('tx', tx)
      commit('setDelegateLoading', { name, hash: tx.hash })

      await tx.wait()

      commit('setDelegateLoading', { name, hash: 'end' })

      dispatch('getBuckets')
    } catch (e) {
      console.log(e)
      commit('setDelegateLoading', { name, hash: 'end' })
    }
  },
  async unbound({ rootState, commit, dispatch }, { name, data }) {
    try {
      commit('setUnboundLoading', { name, hash: 'start' })
      console.log('scriptData', data)
      const contractAddress = getTxAddress(rootState.wallet.chainId)
      const tx = await rootState.wallet.signer.sendTransaction({
        to: contractAddress,
        value: 0,
        data,
      })
      console.log('tx', tx)
      commit('setUnboundLoading', { name, hash: tx.hash })

      await tx.wait()

      commit('setUnboundLoading', { name, hash: 'end' })

      dispatch('getBuckets')
    } catch (e) {
      console.log(e)
      commit('setUnboundLoading', { name, hash: 'end' })
    }
  },
  async undelegate({ rootState, commit, dispatch }, { name, data }) {
    try {
      commit('setUndelegateLoading', { name, hash: 'start' })
      console.log('scriptData', data)
      const contractAddress = getTxAddress(rootState.wallet.chainId)
      const tx = await rootState.wallet.signer.sendTransaction({
        to: contractAddress,
        value: 0,
        data,
      })
      console.log('tx', tx)
      commit('setUndelegateLoading', { name, hash: tx.hash })

      await tx.wait()

      commit('setUndelegateLoading', { name, hash: 'end' })

      dispatch('getBuckets')
    } catch (e) {
      console.log(e)
      commit('setUndelegateLoading', { name, hash: 'end' })
    }
  },
}

export const bucket = { namespaced, state, getters, mutations, actions }
