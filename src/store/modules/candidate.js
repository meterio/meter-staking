import { getCandidates, getCandidate, getTxAddress } from '@/api'

const namespaced = true

const state = {
  getCandidatesloading: true,
  stakingVoteLoading: {},
  stakingCandidateLoading: {},
  updateCandidateLoading: {},
  uncandidateLoading: {},
  candidates: [],
}

const getters = {}

const mutations = {
  setGetCandidatesLoading(state, loading) {
    state.getCandidatesloading = loading
  },
  setStakingVoteLoading(state, { name, hash }) {
    state.stakingVoteLoading = Object.assign({}, { ...state.stakingVoteLoading }, { [name]: hash })
  },
  setStakingCandidateLoading(state, { name, hash }) {
    state.stakingCandidateLoading = Object.assign({}, { ...state.stakingCandidateLoading }, { [name]: hash })
  },
  setUpdateCandidateLoading(state, { name, hash }) {
    state.updateCandidateLoading = Object.assign({}, { ...state.updateCandidateLoading }, { [name]: hash })
  },
  setUncandidateLoading(state, { name, hash }) {
    state.uncandidateLoading = Object.assign({}, { ...state.uncandidateLoading }, { [name]: hash })
  },
  setCandidates(state, candidates) {
    state.candidates = candidates
  },
}

const actions = {
  async getCandidates({ rootState, commit }) {
    commit('setGetCandidatesLoading', true)
    const candidates = await getCandidates(rootState.wallet.chainId)
    commit('setCandidates', candidates)
    commit('setGetCandidatesLoading', false)
  },
  async getCandidatesNoLoading({ rootState, commit }) {
    const candidates = await getCandidates(rootState.wallet.chainId)
    commit('setCandidates', candidates)
  },
  async getCandidate({ rootState }, { address }) {
    return await getCandidate(rootState.wallet.chainId, address)
  },
  async stakingVote({ rootState, commit, dispatch }, { name, data }) {
    try {
      commit('setStakingVoteLoading', { name, hash: 'start' })
      console.log('scriptData', data)
      const contractAddress = getTxAddress(rootState.wallet.chainId)
      const tx = await rootState.wallet.signer.sendTransaction({
        to: contractAddress,
        value: 0,
        data,
      })
      console.log('tx', tx)
      commit('setStakingVoteLoading', { name, hash: tx.hash })

      await tx.wait()

      commit('setStakingVoteLoading', { name, hash: 'end' })

      dispatch('getCandidates')
      dispatch('bucket/getBuckets', null, { root: true })
    } catch (e) {
      console.log(e)
      commit('setStakingVoteLoading', { name, hash: 'end' })
    }
  },
  async stakingCandidate({ rootState, commit, dispatch }, { name, data }) {
    try {
      commit('setStakingCandidateLoading', { name, hash: 'start' })
      console.log('scriptData', data)
      const contractAddress = getTxAddress(rootState.wallet.chainId)
      const tx = await rootState.wallet.signer.sendTransaction({
        to: contractAddress,
        value: 0,
        data,
      })
      console.log('tx', tx)
      commit('setStakingCandidateLoading', { name, hash: tx.hash })

      await tx.wait()

      commit('setStakingCandidateLoading', { name, hash: 'end' })

      dispatch('getCandidates')
    } catch (e) {
      console.log(e)
      commit('setStakingCandidateLoading', { name, hash: 'end' })
    }
  },
  async updateCandidate({ rootState, commit, dispatch }, { name, data }) {
    try {
      commit('setUpdateCandidateLoading', { name, hash: 'start' })
      console.log('scriptData', data)
      const contractAddress = getTxAddress(rootState.wallet.chainId)
      const tx = await rootState.wallet.signer.sendTransaction({
        to: contractAddress,
        value: 0,
        data,
      })
      console.log('tx', tx)
      commit('setUpdateCandidateLoading', { name, hash: tx.hash })

      await tx.wait()

      commit('setUpdateCandidateLoading', { name, hash: 'end' })

      dispatch('getCandidates')
    } catch (e) {
      console.log(e)
      commit('setUpdateCandidateLoading', { name, hash: 'end' })
    }
  },
  async uncandidate({ rootState, commit, dispatch }, { name, data }) {
    try {
      commit('setUncandidateLoading', { name, hash: 'start' })
      console.log('scriptData', data)
      const contractAddress = getTxAddress(rootState.wallet.chainId)
      const tx = await rootState.wallet.signer.sendTransaction({
        to: contractAddress,
        value: 0,
        data,
      })
      console.log('tx', tx)
      commit('setUncandidateLoading', { name, hash: tx.hash })

      await tx.wait()

      commit('setUncandidateLoading', { name, hash: 'end' })

      dispatch('getCandidates')
    } catch (e) {
      console.log(e)
      commit('setUncandidateLoading', { name, hash: 'end' })
    }
  },
}

export const candidate = { namespaced, state, getters, mutations, actions }
