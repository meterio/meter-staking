import axios from 'axios'

export const getBuckets = async (url) => {
  const res = await axios.get(`${url}/staking/buckets`)
  if (res && res.data) {
    return res.data
  }
  return []
}

export const getBucketById = async (url, id) => {
  const res = await axios.get(`${url}/staking/buckets/${id}`)
  if (res && res.data) {
    return res.data
  }
  return []
}
