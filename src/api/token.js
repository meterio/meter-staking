import axios from 'axios'
import { urls } from '../constants'

export const getBalance = async (chainId, address) => {
  const res = await axios.get(`${urls[chainId]}/accounts/${address}`)
  if (res && res.data) {
    return res.data
  }
}
