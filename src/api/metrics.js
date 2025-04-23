import axios from "axios"
import { Base_Url } from "../constants"

export const getMetricsAll = async () => {
  const res = await axios.get(`${Base_Url}/api/metrics/all`)
  if (res && res.data) {
    return res.data
  }
}