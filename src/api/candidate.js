import axios from 'axios'
import { urls } from '../constants'

export const getCandidates = async (chainId) => {
  const res = await axios.get(`${urls[chainId]}/staking/candidates`)
  if (res && res.data) {
    return res.data
  }
  return []
}
