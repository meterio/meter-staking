import liquidAbi from "@/abi/liquid"
import BigNumber from "bignumber.js"
import { ethers } from "ethers"

const namespaced = true

const state = {
  stBalance: '0'
}

const getters = {}

const mutations = {
  setBalance(state, balance) {
    state.stBalance = balance
  }
}

const actions = {
  async deposit({ rootState }, { amount }) {
    try {
      const { liquidAddress, mtrgAddress } = rootState.token.currentNetwork
      const { signer, account } = rootState.wallet

      const mtrgContract = new ethers.Contract(mtrgAddress, liquidAbi, signer)
  
      const allowance = await mtrgContract.allowance(account, liquidAddress)
      const decimalsAmount = new BigNumber(amount).times(1e18).toFixed()
      if (new BigNumber(allowance).lt(decimalsAmount)) {
        const approveTx = await mtrgContract.approve(liquidAddress, decimalsAmount)
  
        await approveTx.wait()
      }
  
      const liquidContract = new ethers.Contract(liquidAddress, liquidAbi, signer)
      const tx = await liquidContract.deposit(decimalsAmount)
      const res = await tx.wait()
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
  async withdraw({ rootState, dispatch }, { amount }) {
    try {
      const { liquidAddress } = rootState.token.currentNetwork
      const { signer, account } = rootState.wallet

      const liquidContract = new ethers.Contract(liquidAddress, liquidAbi, signer)

      const decimalsAmount = new BigNumber(amount).times(1e18).toFixed()

      const tx = await liquidContract.withdraw(decimalsAmount, account)
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
  async getStakeBalance({ rootState, commit }) {
    const { liquidAddress } = rootState.token.currentNetwork
    const { signer, account } = rootState.wallet
    const liquidContract = new ethers.Contract(liquidAddress, liquidAbi, signer)
    const balance = await liquidContract.balanceOf(account)
    console.log('balance', new BigNumber(String(balance)).div(1e18).toFixed())
    commit('setBalance', new BigNumber(String(balance)).div(1e18).toFixed())
  }
}

export const liquid = { namespaced, state, getters, mutations, actions }
