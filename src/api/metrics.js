import axios from "axios"

export const getMetricsAll = async (url) => {
  const res = await axios.get(url)
  if (res && res.data) {
    return res.data
  }
}