import axios from "axios"

const preUrl = "https://api.meter.io:8000/probe"

export const getProbe = async (ip) => {
  const res = await axios.get(`${preUrl}/${ip}`)

  return res.data.result
}