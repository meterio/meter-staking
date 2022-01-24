import axios from 'axios'

export const getBalance = async (url, address) => {
  const res = await axios.get(`${url}/accounts/${address}`)
  if (res && res.data) {
    return res.data
  }
}
