export const CHAINS = {
  bscTestnet: {
    chainId: 97,
    chainIdHex: '0x61',
    name: 'BNB Smart Chain Testnet',
    shortName: 'BSC Testnet',
    realChain: 'BNB Smart Chain',
    tokenStandard: 'BEP20',
  },
  sepolia: {
    chainId: 11_155_111,
    chainIdHex: '0xaa36a7',
    name: 'Sepolia Test Network',
    shortName: 'Sepolia',
    realChain: 'Ethereum',
    tokenStandard: 'ERC20',
  },
}

export const CHAINS_NAME = {
  [CHAINS.bscTestnet.chainId]: CHAINS.bscTestnet.realChain,
  [CHAINS.sepolia.chainId]: CHAINS.sepolia.realChain,
}

export const TOKEN_NAME = {
  [CHAINS.bscTestnet.chainId]: CHAINS.bscTestnet.tokenStandard,
  [CHAINS.sepolia.chainId]: CHAINS.sepolia.tokenStandard,
}
