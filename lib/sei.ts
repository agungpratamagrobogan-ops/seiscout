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
  iconUrls: ["https://assets.coingecko.com/coins/images/28205/small/Sei_Logo_-_Transparent.png"],
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

export const isValidSeiNetwork = (chainId: string | null): boolean => {
  return chainId === "0x531" // 1329 in hex
}

export const requireSeiNetwork = async (): Promise<boolean> => {
  if (typeof window === "undefined" || !window.ethereum) {
    throw new Error("MetaMask not installed. Please install MetaMask to use this feature.")
  }

  try {
    // First, ensure we have account access
    const accounts = await window.ethereum.request({ method: "eth_accounts" })
    if (accounts.length === 0) {
      // Request account access first
      await window.ethereum.request({ method: "eth_requestAccounts" })
    }

    const chainId = await window.ethereum.request({ method: "eth_chainId" })

    if (!isValidSeiNetwork(chainId)) {
      // Try to switch to Sei network
      try {
        await window.ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: "0x531" }],
        })

        // Verify the switch was successful
        const newChainId = await window.ethereum.request({ method: "eth_chainId" })
        return isValidSeiNetwork(newChainId)
      } catch (switchError: any) {
        // If network doesn't exist, add it
        if (switchError.code === 4902) {
          try {
            await window.ethereum.request({
              method: "wallet_addEthereumChain",
              params: [getSeiNetworkParams()],
            })

            // Verify the addition was successful
            const newChainId = await window.ethereum.request({ method: "eth_chainId" })
            return isValidSeiNetwork(newChainId)
          } catch (addError) {
            throw new Error("Failed to add Sei network to MetaMask")
          }
        } else if (switchError.code === 4001) {
          throw new Error("User rejected network switch")
        } else {
          throw new Error("Failed to switch to Sei network")
        }
      }
    }
    return true
  } catch (error) {
    console.error("Network guard error:", error)
    throw error
  }
}

// Helper function to check if MetaMask is installed
export const isMetaMaskInstalled = (): boolean => {
  return typeof window !== "undefined" && !!window.ethereum
}

// Function to get current wallet address
export const getCurrentWalletAddress = async (): Promise<string | null> => {
  if (!isMetaMaskInstalled()) return null

  try {
    const accounts = await window.ethereum!.request({ method: "eth_accounts" })
    return accounts.length > 0 ? accounts[0] : null
  } catch (error) {
    console.error("Error getting wallet address:", error)
    return null
  }
}

export const getNetworkStatus = async () => {
  if (typeof window === "undefined") {
    return {
      isConnected: false,
      chainId: null,
      blockNumber: null,
      latency: null,
      isOnSeiNetwork: false,
      error: "Server-side rendering",
    }
  }

  if (!window.ethereum) {
    return {
      isConnected: false,
      chainId: null,
      blockNumber: null,
      latency: null,
      isOnSeiNetwork: false,
      error: "MetaMask not installed",
    }
  }

  try {
    const startTime = Date.now()

    // Check if MetaMask is unlocked and has accounts
    const accounts = await window.ethereum.request({ method: "eth_accounts" })

    if (accounts.length === 0) {
      // MetaMask is installed but not connected
      return {
        isConnected: false,
        chainId: null,
        blockNumber: null,
        latency: null,
        isOnSeiNetwork: false,
        error: null, // No error, just not connected
      }
    }

    // Get network info
    const [chainId, blockNumber] = await Promise.all([
      window.ethereum.request({ method: "eth_chainId" }),
      window.ethereum.request({ method: "eth_blockNumber" }),
    ])

    const latency = Date.now() - startTime
    const isOnSei = isValidSeiNetwork(chainId)

    return {
      isConnected: true,
      chainId,
      blockNumber: Number.parseInt(blockNumber, 16),
      latency,
      isOnSeiNetwork: isOnSei,
      error: null,
    }
  } catch (error) {
    console.error("Network status error:", error)
    return {
      isConnected: false,
      chainId: null,
      blockNumber: null,
      latency: null,
      isOnSeiNetwork: false,
      error: error instanceof Error ? error.message : "Network error",
    }
  }
}

export const canConnectToSei = async (): Promise<boolean> => {
  try {
    const blockNumber = await seiClient.getBlockNumber()
    return blockNumber > 0
  } catch (error) {
    console.error("Cannot connect to Sei network:", error)
    return false
  }
}
