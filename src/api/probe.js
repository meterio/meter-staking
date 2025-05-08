import axios from "axios"
import { Base_Url } from "../constants"

export const getProbe = async (ip) => {
  const res = await axios.get(`${Base_Url}/probe/${ip}`)

  const result = res?.data?.result
  if (!result) {
    throw new Error(`Can't get info from http://${ip}:8670/probe`)
  }
  return result
}