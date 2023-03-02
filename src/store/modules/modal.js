const namespaced = true

const state = {
  showQRCodeModal: false,
  showLogoutModal: false,
  headerUserOperationActive: false,

  // show candidate or bucket
  // candidate:  default
  // bucket: vote
  // bailout: bailout
  // auction: auction
  // liquid staking: liquid
  status: 'candidate',
  candidateAddr: '',
}

const getters = {}

const mutations = {
  setShowQRCodeModal(state) {
    state.showQRCodeModal = !state.showQRCodeModal
  },
  setShowLogoutModal(state) {
    state.showLogoutModal = !state.showLogoutModal
  },

  setHeaderUserOperationActive(state, status) {
    if (status !== undefined) {
      state.headerUserOperationActive = status
    } else {
      state.headerUserOperationActive = !state.headerUserOperationActive
    }
  },

  setStatus(state, status) {
    state.status = status
  },
  setCandidateAddr(state, addr) {
    console.log('addr', addr)
    state.candidateAddr = addr
  }
}

const actions = {}

export const modal = { namespaced, state, getters, mutations, actions }
