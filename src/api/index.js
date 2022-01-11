export * from './candidate'
export * from './bucket'

import { supportNetworkList } from '@/constants'

export const getCurrentNetwork = (chainId) => {
  return supportNetworkList.filter((network) => network.networkId === Number(chainId))[0]
}

export const getSupportNetworkListByMode = (mode) => {
  return supportNetworkList
  // return supportNetworkList.filter((network) => {
  //   if (String(mode) === 'mainnet') {
  //     return network.mode === mode
  //   } else {
  //     return true
  //   }
  // })
}
