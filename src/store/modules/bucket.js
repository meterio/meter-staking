import { getBuckets } from '@/api'

const namespaced = true

const state = {
  loading: true,
  buckets: [],
  updateBucketLoading: {},
  delegateLoading: {},
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
}

const actions = {
  async getBuckets({ rootState, state, commit }) {
    commit('setLoading', true)
    const buckets = await getBuckets(rootState.wallet.chainId)
    commit('setBuckets', buckets)
    commit('setLoading', false)
  },
  async updateBucket({ rootState, commit, dispatch }, { name, data }) {
    try {
      commit('setUpdateBucketLoading', { name, hash: 'start' })
      console.log('scriptData', data)
      const tx = await rootState.wallet.signer.sendTransaction({
        to: '0x616B696e672D6D6F64756c652d61646472657373',
        value: 1,
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
      const tx = await rootState.wallet.signer.sendTransaction({
        to: '0x616B696e672D6D6F64756c652d61646472657373',
        value: 1,
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
}

export const bucket = { namespaced, state, getters, mutations, actions }
