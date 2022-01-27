import axios from 'axios'

export const getJaileds = async (url) => {
  const res = await axios.get(`${url}/slashing/injail`)
  if (res && res.data) {
    return res.data
  }
  return []
}
