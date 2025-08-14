"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Wallet } from "lucide-react"
import { getSeiNetworkParams } from "@/lib/sei"

interface WalletState {
  address: string | null
  isConnected: boolean
  isConnecting: boolean
  chainId: string | null
}

export function WalletConnectButton() {
  const [wallet, setWallet] = useState<WalletState>({
    address: null,
    isConnected: false,
    isConnecting: false,
    chainId: null,
  })

  useEffect(() => {
    // Check if wallet is already connected
    const checkConnection = async () => {
      if (typeof window !== "undefined" && window.ethereum) {
        try {
          const accounts = await window.ethereum.request({ method: "eth_accounts" })
          const chainId = await window.ethereum.request({ method: "eth_chainId" })

          if (accounts.length > 0) {
            setWallet({
              address: accounts[0],
              isConnected: true,
              isConnecting: false,
              chainId,
            })
          }
        } catch (error) {
          console.error("Error checking wallet connection:", error)
        }
      }
    }

    checkConnection()

    // Listen for account changes
    if (typeof window !== "undefined" && window.ethereum) {
      window.ethereum.on("accountsChanged", (accounts: string[]) => {
        if (accounts.length > 0) {
          setWallet((prev) => ({ ...prev, address: accounts[0], isConnected: true }))
        } else {
          setWallet({ address: null, isConnected: false, isConnecting: false, chainId: null })
        }
      })

      window.ethereum.on("chainChanged", (chainId: string) => {
        setWallet((prev) => ({ ...prev, chainId }))
      })
    }
  }, [])

  const connectWallet = async () => {
    if (typeof window === "undefined" || !window.ethereum) {
      alert("Please install MetaMask or another Web3 wallet")
      return
    }

    setWallet((prev) => ({ ...prev, isConnecting: true }))

    try {
      // Request account access
      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" })
      const chainId = await window.ethereum.request({ method: "eth_chainId" })

      // Check if we're on Sei network
      if (chainId !== "0x531") {
        try {
          // Try to switch to Sei network
          await window.ethereum.request({
            method: "wallet_switchEthereumChain",
            params: [{ chainId: "0x531" }],
          })
        } catch (switchError: any) {
          // If network doesn't exist, add it
          if (switchError.code === 4902) {
            await window.ethereum.request({
              method: "wallet_addEthereumChain",
              params: [getSeiNetworkParams()],
            })
          } else {
            throw switchError
          }
        }
      }

      setWallet({
        address: accounts[0],
        isConnected: true,
        isConnecting: false,
        chainId: "0x531",
      })
    } catch (error) {
      console.error("Error connecting wallet:", error)
      setWallet((prev) => ({ ...prev, isConnecting: false }))
    }
  }

  const disconnectWallet = () => {
    setWallet({ address: null, isConnected: false, isConnecting: false, chainId: null })
  }

  const isOnSeiNetwork = wallet.chainId === "0x531"

  if (wallet.isConnected && wallet.address) {
    return (
      <div className="flex items-center space-x-2">
        {!isOnSeiNetwork && (
          <Badge variant="outline" className="border-yellow-500 text-yellow-500">
            Wrong Network
          </Badge>
        )}
        <Button
          variant="outline"
          className="border-[#22D3EE] text-[#22D3EE] hover:bg-[#22D3EE]/10 bg-transparent"
          onClick={disconnectWallet}
        >
          <Wallet className="w-4 h-4 mr-2" />
          {wallet.address.slice(0, 6)}...{wallet.address.slice(-4)}
        </Button>
      </div>
    )
  }

  return (
    <Button
      onClick={connectWallet}
      disabled={wallet.isConnecting}
      className="bg-[#22D3EE] hover:bg-[#22D3EE]/90 text-[#0C101A]"
    >
      <Wallet className="w-4 h-4 mr-2" />
      {wallet.isConnecting ? "Connecting..." : "Connect Wallet"}
    </Button>
  )
}

// Extend Window interface for TypeScript
declare global {
  interface Window {
    ethereum?: {
      request: (args: { method: string; params?: any[] }) => Promise<any>
      on: (event: string, callback: (data: any) => void) => void
      removeListener: (event: string, callback: (data: any) => void) => void
    }
  }
}
