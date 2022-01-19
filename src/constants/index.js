export const urls = {
  82: 'https://mainnet.meter.io',
  83: 'https://warringstakes.meter.io',
  72: 'http://13.251.129.32:8669',
}

export const supportNetworkList = [
  {
    networkId: 82,
    name: 'Meter',
    nativeTokenName: 'MTR',
    nativeTokenSymbol: 'MTR',
    nativeTokenDecimals: 18,
    rpcUrl: 'https://rpc.meter.io',
    blockExplorer: 'https://scan.meter.io',
    mode: 'mainnet',
  },
  {
    networkId: 83,
    name: 'Meter Testnet',
    nativeTokenName: 'MTR',
    nativeTokenSymbol: 'MTR',
    nativeTokenDecimals: 18,
    rpcUrl: 'https://rpctest.meter.io',
    blockExplorer: 'https://scan-warringstakes.meter.io',
    mode: 'testnet',
  },
  {
    networkId: 72,
    name: 'Verse Testnet',
    nativeTokenName: 'MTRT',
    nativeTokenSymbol: 'MTRT',
    nativeTokenDecimals: 18,
    rpcUrl: 'http://18.141.219.204:8545',
    blockExplorer: 'http://18.141.219.204:8000',
    mode: 'testnet',
  },
]

export const tokens = [
  {
    name: 'Meter Governance',
    address: '0x228ebBeE999c6a7ad74A6130E81b12f9Fe237Ba3',
    symbol: 'MTRG',
    decimals: 18,
    chainId: 82,
    logoURI: 'https://raw.githubusercontent.com/meterio/token-list/master/data/MTRG/logo.png',
    coinId: 'meter',
    native: false,
    resourceId: '0x0000000000000000000000bd2949f67dcdc549c6ebe98696449fa79d988a9f01',
  },
  {
    name: 'Meter Governance',
    address: '0x8A419EF4941355476CF04933E90BF3BBF2F73814',
    symbol: 'MTRG',
    decimals: 18,
    chainId: 83,
    logoURI: 'https://raw.githubusercontent.com/meterio/token-list/master/data/MTRG/logo.png',
    coinId: 'meter',
    native: false,
    resourceId: '0x0000000000000000000000228ebBeE999c6a7ad74A6130E81b12f9Fe237Ba301',
  },
  {
    name: 'Verse Governance',
    address: '0x000000000000004d65746572476f764552433230',
    symbol: 'MTRG',
    decimals: 18,
    chainId: 72,
    logoURI: 'https://raw.githubusercontent.com/meterio/token-list/master/data/MTRG/logo.png',
    coinId: 'meter',
    native: false,
    resourceId: '0x',
  },
]

export const regExpList = {
  address: '^0x[A-Za-z0-9]{40}$',
}

// the contract address send transaction to
export const contractAddress = {
  82: '0x616B696e672D6D6F64756c652d61646472657373',
  83: '0x616B696e672D6D6F64756c652d61646472657373',
  72: '0x616B696e672D6D6F64756c652d61646472657373',
}
