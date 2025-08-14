"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Wallet, AlertCircle, CheckCircle, ExternalLink } from "lucide-react"
import { getSeiNetworkParams } from "@/lib/sei"

interface WalletState {
  isConnected: boolean
  address: string | null
  chainId: number | null
  isCorrectNetwork: boolean
}

export function WalletConnectButton() {
  const [walletState, setWalletState] = useState<WalletState>({
    isConnected: false,
    address: null,
    chainId: null,
    isCorrectNetwork: false,
  })
  const [isConnecting, setIsConnecting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const checkWalletConnection = async () => {
    if (typeof window !== "undefined" && window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: "eth_accounts" })
        const chainId = await window.ethereum.request({ method: "eth_chainId" })

        setWalletState({
          isConnected: accounts.length > 0,
          address: accounts[0] || null,
          chainId: Number.parseInt(chainId, 16),
          isCorrectNetwork: Number.parseInt(chainId, 16) === 1329,
        })
      } catch (error) {
        console.error("Error checking wallet connection:", error)
      }
    }
  }

  const switchToSeiNetwork = async () => {
    if (!window.ethereum) return

    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: "0x531" }], // 1329 in hex
      })
    } catch (switchError: any) {
      // Network not added to wallet
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: "wallet_addEthereumChain",
            params: [getSeiNetworkParams()],
          })
        } catch (addError) {
          setError("Failed to add Sei Network to wallet")
        }
      } else {
        setError("Failed to switch to Sei Network")
      }
    }
  }

  const connectWallet = async () => {
    if (!window.ethereum) {
      setError("Please install MetaMask or another Web3 wallet")
      return
    }

    setIsConnecting(true)
    setError(null)

    try {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      })

      const chainId = await window.ethereum.request({ method: "eth_chainId" })

      setWalletState({
        isConnected: true,
        address: accounts[0],
        chainId: Number.parseInt(chainId, 16),
        isCorrectNetwork: Number.parseInt(chainId, 16) === 1329,
      })

      // Auto-switch to Sei if not on correct network
      if (Number.parseInt(chainId, 16) !== 1329) {
        await switchToSeiNetwork()
      }
    } catch (error: any) {
      setError(error.message || "Failed to connect wallet")
    } finally {
      setIsConnecting(false)
    }
  }

  useEffect(() => {
    checkWalletConnection()

    if (window.ethereum) {
      const handleAccountsChanged = (accounts: string[]) => {
        setWalletState((prev) => ({
          ...prev,
          isConnected: accounts.length > 0,
          address: accounts[0] || null,
        }))
      }

      const handleChainChanged = (chainId: string) => {
        setWalletState((prev) => ({
          ...prev,
          chainId: Number.parseInt(chainId, 16),
          isCorrectNetwork: Number.parseInt(chainId, 16) === 1329,
        }))
      }

      window.ethereum.on("accountsChanged", handleAccountsChanged)
      window.ethereum.on("chainChanged", handleChainChanged)

      return () => {
        window.ethereum?.removeListener("accountsChanged", handleAccountsChanged)
        window.ethereum?.removeListener("chainChanged", handleChainChanged)
      }
    }
  }, [])

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="flex items-center gap-3">
        {/* Network Badge */}
        <Badge
          variant={walletState.isCorrectNetwork ? "default" : "destructive"}
          className={`cursor-pointer ${
            walletState.isCorrectNetwork ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700"
          }`}
          onClick={walletState.isConnected && !walletState.isCorrectNetwork ? switchToSeiNetwork : undefined}
        >
          {walletState.isCorrectNetwork ? (
            <>
              <CheckCircle className="w-3 h-3 mr-1" />
              Sei EVM 1329
            </>
          ) : (
            <>
              <AlertCircle className="w-3 h-3 mr-1" />
              {walletState.chainId ? `Chain ${walletState.chainId}` : "Wrong Network"}
            </>
          )}
        </Badge>

        {/* Connect/Disconnect Button */}
        {walletState.isConnected ? (
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="font-mono bg-transparent">
              {walletState.address?.slice(0, 6)}...{walletState.address?.slice(-4)}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() =>
                window.open(`https://seitrace.com/address/${walletState.address}?chain=pacific-1`, "_blank")
              }
            >
              <ExternalLink className="w-4 h-4" />
            </Button>
          </div>
        ) : (
          <Button variant="outline" size="sm" onClick={connectWallet} disabled={isConnecting}>
            <Wallet className="w-4 h-4 mr-2" />
            {isConnecting ? "Connecting..." : "Connect Wallet"}
          </Button>
        )}
      </div>

      {/* Error Alert */}
      {error && (
        <Alert className="max-w-md">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Network Switch Alert */}
      {walletState.isConnected && !walletState.isCorrectNetwork && (
        <Alert className="max-w-md">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Please switch to Sei Network (Chain ID: 1329) to use SeiScout features.
            <Button variant="link" className="p-0 h-auto ml-2 text-blue-600" onClick={switchToSeiNetwork}>
              Switch Network
            </Button>
          </AlertDescription>
        </Alert>
      )}
    </div>
  )
}
