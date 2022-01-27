import axios from 'axios'

export const getAuctions = async (url) => {
  const res = await axios.get(`${url}/auction/present`)
  if (res && res.data) {
    return res.data
  }
  return []
}
export const getBest = async (url) => {
  const res = await axios.get(`${url}/blocks/best`)
  return res.data ? res.data : {}
}
