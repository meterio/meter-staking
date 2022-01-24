import axios from 'axios'

export const getCandidates = async (url) => {
  const res = await axios.get(`${url}/staking/candidates`)
  if (res && res.data) {
    return res.data
  }
  return []
}

export const getCandidate = async (url, address) => {
  const res = await axios.get(`${url}/staking/candidates/${address.substr(2)}`)
  if (res && res.data) {
    return res.data
  }
}
