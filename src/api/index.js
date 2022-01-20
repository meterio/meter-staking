export * from './candidate'
export * from './bucket'
export * from './token'

import { supportNetworkList, contractAddress } from '@/constants'

export const getCurrentNetwork = (chainId) => {
  return supportNetworkList.find((network) => network.networkId === chainId)
}

export const getSupportNetworkListByMode = () => {
  return supportNetworkList
}

export const getMeterScanUrl = (chainId) => {
  const currNetwork = supportNetworkList.find((n) => n.networkId === chainId)
  return currNetwork.blockExplorer
}

export const getTxAddress = (chainId) => {
  return contractAddress[chainId]
}
