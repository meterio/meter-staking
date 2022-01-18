export * from './candidate'
export * from './bucket'

import { supportNetworkList, scanUrls } from '@/constants'

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
  return scanUrls[chainId]
}
