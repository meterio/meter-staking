import axios from 'axios'
import { urls } from '@/constants'

export const getBuckets = async (chainId) => {
  const res = await axios.get(`${urls[chainId]}/staking/buckets`)
  if (res && res.data) {
    return res.data
  }
  return []
}
