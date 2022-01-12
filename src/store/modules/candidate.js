import { getCandidates } from '@/api'

const namespaced = true

const state = {
  getCandidatesloading: true,
  stakingVoteLoading: {},
  stakingCandidateLoading: {},
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
  async stakingVote({ rootState, commit, dispatch }, { name, data }) {
    try {
      commit('setStakingVoteLoading', { name, hash: 'start' })
      console.log('scriptData', data)
      const tx = await rootState.wallet.signer.sendTransaction({
        to: '0x616B696e672D6D6F64756c652d61646472657373',
        value: 1,
        data,
      })
      console.log('tx', tx)
      commit('setStakingVoteLoading', { name, hash: tx.hash })

      await tx.wait()

      commit('setStakingVoteLoading', { name, hash: 'end' })

      dispatch('getCandidates')
    } catch (e) {
      console.log(e)
      commit('setStakingVoteLoading', { name, hash: 'end' })
    }
  },
  async stakingCandidate({ rootState, commit, dispatch }, { name, data }) {
    try {
      commit('setStakingCandidateLoading', { name, hash: 'start' })
      console.log('scriptData', data)
      const tx = await rootState.wallet.signer.sendTransaction({
        to: '0x616B696e672D6D6F64756c652d61646472657373',
        value: 1,
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
}

export const candidate = { namespaced, state, getters, mutations, actions }
