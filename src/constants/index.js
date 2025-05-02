export const supportNetworkList = [
  {
    networkId: 82,
    name: 'Meter',
    nativeTokenName: 'MTR',
    nativeTokenSymbol: 'MTR',
    governanceTokenName: 'MTRG',
    governanceTokenSymbol: 'MTRG',
    governanceTokenDecimals: 18,
    nativeTokenDecimals: 18,
    rpcUrl: 'https://rpc.meter.io',
    blockExplorer: 'https://scan.meter.io',
    infoUrl: 'https://mainnet.meter.io',
    stakingAddress: '0x616B696e672D6D6F64756c652d61646472657373',
    mtrgAddress: '0x228ebBeE999c6a7ad74A6130E81b12f9Fe237Ba3',
    liquidAddress: '0x215d603293357ca222bE92A1bf75eEc38DeF0aad',
    wrapAddress: '0xE2dE616fBD8cb9180B26FcFB1B761A232FE56717',
    mode: 'mainnet',
  },
  {
    networkId: 83,
    name: 'Meter Testnet',
    nativeTokenName: 'MTR',
    nativeTokenSymbol: 'MTR',
    nativeTokenDecimals: 18,
    governanceTokenName: 'MTRG',
    governanceTokenSymbol: 'MTRG',
    governanceTokenDecimals: 18,
    rpcUrl: 'https://rpctest.meter.io',
    blockExplorer: 'https://scan-warringstakes.meter.io',
    infoUrl: 'https://testnet.meter.io',
    stakingAddress: '0x616B696e672D6D6F64756c652d61646472657373',
    liquidAddress: '0x8dc543c696d391e288ae8418c67c61947eac3908', // stMTRG
    wrapAddress: '0x871497eb8596d2cbdbe5bb23d552d35bffbb8cf5', // wstMTRG
    mtrgAddress: '0x8A419Ef4941355476cf04933E90Bf3bbF2F73814',
    mode: 'testnet',
  },
  // {
  //   networkId: 72,
  //   name: 'Verse Testnet',
  //   nativeTokenName: 'STPT',
  //   nativeTokenSymbol: 'STPT',
  //   nativeTokenDecimals: 18,
  //   governanceTokenName: 'STPD',
  //   governanceTokenSymbol: 'STPD',
  //   governanceTokenDecimals: 18,
  //   rpcUrl: 'https://test-gearrpc.stp.network',
  //   blockExplorer: 'https://testnet-explorer.stp.network',
  //   infoUrl: 'https://test-rpc0.stp.network',
  //   stakingAddress: '0x616B696e672D6D6F64756c652d61646472657373',
  //   mode: 'testnet',
  // },
]

export const regExpList = {
  address: '^0x[A-Za-z0-9]{40}$',
  ip: /([0,1]?\d{1,2}|2([0-4][0-9]|5[0-5]))(\.([0,1]?\d{1,2}|2([0-4][0-9]|5[0-5]))){3}/,
}

export const Base_Url = "https://api-scan.meter.io"
