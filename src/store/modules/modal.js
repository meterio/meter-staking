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
  status: 'candidate',
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
}

const actions = {}

export const modal = { namespaced, state, getters, mutations, actions }
