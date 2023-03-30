import liquidAbi from "@/abi/liquid"
import wrapAbi from "@/abi/wrap"
import BigNumber from "bignumber.js"
import { ethers } from "ethers"

const namespaced = true

const state = {
  stBalance: '0',
  wstBalance: '0',
  currentAction: '',
  wCurrentAction: '',
}

const getters = {}

const mutations = {
  setBalance(state, balance) {
    state.stBalance = balance
  },
  setWBalance(state, balance) {
    state.wstBalance = balance
  },
  setCurrentAction(state, currentAction) {
    state.currentAction = currentAction
  },
  setWCurrentAction(state, currentAction) {
    state.wCurrentAction = currentAction
  }
}

const actions = {
  async deposit({ rootState, commit, dispatch }, { amount }) {
    try {
      const { liquidAddress, mtrgAddress } = rootState.token.currentNetwork
      const { signer, account } = rootState.wallet

      const mtrgContract = new ethers.Contract(mtrgAddress, liquidAbi, signer)
  
      const allowance = await mtrgContract.allowance(account, liquidAddress)
      const decimalsAmount = new BigNumber(amount).times(1e18).toFixed()
      if (new BigNumber(String(allowance)).lt(decimalsAmount)) {

        commit('setCurrentAction', 'Approve')

        const approveTx = await mtrgContract.approve(liquidAddress, decimalsAmount)
  
        await approveTx.wait()
      }

      commit('setCurrentAction', 'Deposit')
  
      const liquidContract = new ethers.Contract(liquidAddress, liquidAbi, signer)
      const tx = await liquidContract.deposit(decimalsAmount)
      const res = await tx.wait()

      dispatch('token/initTokens', null, { root: true })
      dispatch('getStakeBalance')

      return {
        hash: res.transactionHash,
      }
    } catch(e) {
      console.log(e)

      return {
        error: e.data ? (e.data.message ? e.data.message : e.message) : e.message
      }
    } finally {
      commit('setCurrentAction', '')
    }
  },
  async withdraw({ rootState, state, dispatch }, { amount }) {
    try {
      const { liquidAddress } = rootState.token.currentNetwork
      const { signer, account } = rootState.wallet

      const liquidContract = new ethers.Contract(liquidAddress, liquidAbi, signer)

      const decimalsAmount = new BigNumber(amount)
      let tx;
      if (decimalsAmount.eq(state.stBalance)) {
        console.log('exit')
        tx = await liquidContract.exit(account)
      } else {
        tx = await liquidContract.withdraw(decimalsAmount.times(1e18).toFixed(), account)
      }

      const res = await tx.wait()

      dispatch('getStakeBalance')

      return {
        hash: res.transactionHash,
      }
    } catch(e) {
      console.log(e)

      return {
        error: e.data ? (e.data.message ? e.data.message : e.message) : e.message
      }
    }
  },
  async wrap({ rootState, commit, dispatch }, { amount }) {
    try {
      const { liquidAddress, wrapAddress } = rootState.token.currentNetwork
      const { signer, account } = rootState.wallet

      const liquidContract = new ethers.Contract(liquidAddress, liquidAbi, signer)
  
      const allowance = await liquidContract.allowance(account, wrapAddress)
      const decimalsAmount = new BigNumber(amount).times(1e18).toFixed()
      if (new BigNumber(String(allowance)).lt(decimalsAmount)) {

        commit('setWCurrentAction', 'Approve')

        const approveTx = await liquidContract.approve(wrapAddress, decimalsAmount)
  
        await approveTx.wait()
      }

      commit('setWCurrentAction', 'Wrap')
  
      const wrapContract = new ethers.Contract(wrapAddress, wrapAbi, signer)
      const tx = await wrapContract.wrap(decimalsAmount)
      const res = await tx.wait()

      dispatch('getStakeBalance')
      dispatch('getWStakeBalance')

      return {
        hash: res.transactionHash,
      }
    } catch(e) {
      console.log(e)

      return {
        error: e.data ? (e.data.message ? e.data.message : e.message) : e.message
      }
    } finally {
      commit('setWCurrentAction', '')
    }
  },
  async unwrap({ rootState, state, dispatch }, { amount }) {
    try {
      const { wrapAddress } = rootState.token.currentNetwork
      const { signer, account } = rootState.wallet

      const wrapContract = new ethers.Contract(wrapAddress, wrapAbi, signer)

      const decimalsAmount = new BigNumber(amount)
      let tx = await wrapContract.unwrap(decimalsAmount.times(1e18).toFixed())

      const res = await tx.wait()

      dispatch('getStakeBalance')
      dispatch('getWStakeBalance')

      return {
        hash: res.transactionHash,
      }
    } catch(e) {
      console.log(e)

      return {
        error: e.data ? (e.data.message ? e.data.message : e.message) : e.message
      }
    }
  },
  async getStakeBalance({ rootState, commit }) {
    const { liquidAddress } = rootState.token.currentNetwork
    const { signer, account } = rootState.wallet
    const liquidContract = new ethers.Contract(liquidAddress, liquidAbi, signer)
    const balance = await liquidContract.balanceOf(account)
    commit('setBalance', new BigNumber(String(balance)).div(1e18).toFixed())
  },
  async getWStakeBalance({ rootState, commit }) {
    const { wrapAddress } = rootState.token.currentNetwork
    const { signer, account } = rootState.wallet
    const liquidContract = new ethers.Contract(wrapAddress, wrapAbi, signer)
    const balance = await liquidContract.balanceOf(account)
    commit('setWBalance', new BigNumber(String(balance)).div(1e18).toFixed())
  }
}

export const liquid = { namespaced, state, getters, mutations, actions }
