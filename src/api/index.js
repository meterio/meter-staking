export * from './candidate'
export * from './bucket'
export * from './token'
export * from './bailOut'
export * from './auction'
export * from './probe'
export * from './metrics'

import { supportNetworkList } from '@/constants'

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
