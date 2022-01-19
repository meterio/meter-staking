export * from './candidate'
export * from './bucket'

import { supportNetworkList, contractAddress } from '@/constants'

export const getCurrentNetwork = (chainId) => {
  return supportNetworkList.filter((network) => network.networkId === Number(chainId))[0]
}

export const getSupportNetworkListByMode = () => {
  return supportNetworkList
  // return supportNetworkList.filter((network) => {
  //   if (String(mode) === 'mainnet') {
  //     return network.mode === mode
  //   } else {
  //     return true
  //   }
  // })
}

export const getMeterScanUrl = (chainId) => {
  const currNetwork = supportNetworkList.find((n) => n.networkId === chainId)
  return currNetwork.blockExplorer
}

export const getTxAddress = (chainId) => {
  return contractAddress[chainId]
}
