"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Wallet, AlertTriangle } from "lucide-react"
import { requireSeiNetwork, isValidSeiNetwork } from "@/lib/sei"

interface WalletState {
  address: string | null
  isConnected: boolean
  isConnecting: boolean
  chainId: string | null
  error: string | null
}

export function WalletConnectButton() {
  const [wallet, setWallet] = useState<WalletState>({
    address: null,
    isConnected: false,
    isConnecting: false,
    chainId: null,
    error: null,
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
              error: null,
            })
          }
        } catch (error) {
          console.error("Error checking wallet connection:", error)
          setWallet((prev) => ({
            ...prev,
            error: error instanceof Error ? error.message : "Connection error",
          }))
        }
      }
    }

    checkConnection()

    // Listen for account changes
    if (typeof window !== "undefined" && window.ethereum) {
      const handleAccountsChanged = (accounts: string[]) => {
        if (accounts.length > 0) {
          setWallet((prev) => ({
            ...prev,
            address: accounts[0],
            isConnected: true,
            error: null,
          }))
        } else {
          setWallet({
            address: null,
            isConnected: false,
            isConnecting: false,
            chainId: null,
            error: null,
          })
        }
      }

      const handleChainChanged = (chainId: string) => {
        setWallet((prev) => ({ ...prev, chainId }))
      }

      window.ethereum.on("accountsChanged", handleAccountsChanged)
      window.ethereum.on("chainChanged", handleChainChanged)

      return () => {
        window.ethereum?.removeListener("accountsChanged", handleAccountsChanged)
        window.ethereum?.removeListener("chainChanged", handleChainChanged)
      }
    }
  }, [])

  const connectWallet = async () => {
    if (typeof window === "undefined" || !window.ethereum) {
      setWallet((prev) => ({
        ...prev,
        error: "Please install MetaMask to connect your wallet",
      }))
      return
    }

    setWallet((prev) => ({ ...prev, isConnecting: true, error: null }))

    try {
      // Request account access
      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" })

      if (accounts.length === 0) {
        throw new Error("No accounts found")
      }

      // Get current chain ID
      const chainId = await window.ethereum.request({ method: "eth_chainId" })

      // Try to switch to Sei network
      const networkSuccess = await requireSeiNetwork()

      if (!networkSuccess) {
        throw new Error("Failed to connect to Sei network")
      }

      setWallet({
        address: accounts[0],
        isConnected: true,
        isConnecting: false,
        chainId: "0x531", // Sei chain ID
        error: null,
      })
    } catch (error) {
      console.error("Error connecting wallet:", error)
      setWallet((prev) => ({
        ...prev,
        isConnecting: false,
        error: error instanceof Error ? error.message : "Connection failed",
      }))
    }
  }

  const disconnectWallet = () => {
    setWallet({
      address: null,
      isConnected: false,
      isConnecting: false,
      chainId: null,
      error: null,
    })
  }

  const isOnSeiNetwork = isValidSeiNetwork(wallet.chainId)

  if (wallet.error) {
    return (
      <div className="flex items-center space-x-2">
        <Badge variant="outline" className="border-red-500 text-red-500">
          <AlertTriangle className="w-3 h-3 mr-1" />
          Error
        </Badge>
        <Button
          variant="outline"
          onClick={connectWallet}
          className="border-red-500 text-red-500 hover:bg-red-500/10 bg-transparent"
        >
          Retry
        </Button>
      </div>
    )
  }

  if (wallet.isConnected && wallet.address) {
    return (
      <div className="flex items-center space-x-2">
        {!isOnSeiNetwork && (
          <Badge variant="outline" className="border-yellow-500 text-yellow-500">
            <AlertTriangle className="w-3 h-3 mr-1" />
            Wrong Network
          </Badge>
        )}
        <Button
          variant="outline"
          className="border-emerald-500 text-emerald-500 hover:bg-emerald-500/10 bg-transparent"
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
      className="bg-emerald-500 hover:bg-emerald-600 text-white"
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
