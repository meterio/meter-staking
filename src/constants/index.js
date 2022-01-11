export const urls = {
  82: 'https://mainnet.meter.io',
  83: 'https://warringstakes.meter.io',
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
]

export const bnfmt1 = {
  prefix: '$',
  decimalSeparator: '.',
  groupSeparator: ',',
  groupSize: 3,
  secondaryGroupSize: 0,
  fractionGroupSeparator: ' ',
  fractionGroupSize: 0,
  suffix: '',
}
export const bnfmt2 = {
  prefix: '',
  decimalSeparator: '.',
  groupSeparator: ',',
  groupSize: 3,
  secondaryGroupSize: 0,
  fractionGroupSeparator: ' ',
  fractionGroupSize: 0,
  suffix: '',
}

export const regExpList = {
  address: '^0x[A-Za-z0-9]{40}$',
}
