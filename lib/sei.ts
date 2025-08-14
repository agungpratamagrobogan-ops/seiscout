import { createPublicClient, http, defineChain } from "viem"

// Sei EVM mainnet configuration
export const seiChain = defineChain({
  id: 1329,
  name: "Sei",
  nativeCurrency: {
    decimals: 18,
    name: "SEI",
    symbol: "SEI",
  },
  rpcUrls: {
    default: {
      http: ["https://evm-rpc.sei-apis.com"],
    },
  },
  blockExplorers: {
    default: {
      name: "Seitrace",
      url: "https://seitrace.com",
    },
  },
})

// Create public client for Sei network
export const seiClient = createPublicClient({
  chain: seiChain,
  transport: http(),
})

// Explorer URL helpers
export const seitraceAddr = (addr: string) => `https://seitrace.com/address/${addr}?chain=pacific-1`
export const seitraceTx = (tx: string) => `https://seitrace.com/tx/${tx}?chain=pacific-1`

// Network parameters for wallet connection
export const getSeiNetworkParams = () => ({
  chainId: "0x531", // 1329 in hex
  chainName: "Sei Network",
  nativeCurrency: {
    name: "SEI",
    symbol: "SEI",
    decimals: 18,
  },
  rpcUrls: ["https://evm-rpc.sei-apis.com"],
  blockExplorerUrls: ["https://seitrace.com"],
})

// DragonSwap contract addresses
export const DRAGONSWAP_ROUTER = "0x2Df1c51E09aECF9cacB7bc98cB1742757f163eA7"
export const DRAGONSWAP_FACTORY = "0x8112E18FDD716c42b72113d42C7B4b5b8C6c8A5E"

// Common token addresses on Sei
export const TOKEN_ADDRESSES = {
  WSEI: "0xE30feDd158A2e3b13e9badaeABaFc5516e95e8C7",
  USDC: "0x3894085Ef7Ff0f0aeDf52E2A2704928d259f9B3A",
  USDT: "0xB75D0B03c06A926e488e2659DF1A861F860bD3d1",
} as const

export const SEI_TOKENS = TOKEN_ADDRESSES
