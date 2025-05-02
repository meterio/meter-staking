import axios from "axios"
import { Base_Url } from "../constants"

export const getProbe = async (ip) => {
  const res = await axios.get(`${Base_Url}/probe/${ip}`)

  return res.data.result
}