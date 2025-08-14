"use client"

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Zap, ExternalLink, AlertTriangle } from "lucide-react"
import { getSeiNetworkParams } from "@/lib/sei"

interface NetworkStatus {
  isConnected: boolean
  chainId: string | null
  blockNumber: number | null
  latency: number | null
}

export function NetworkBadge() {
  const [networkStatus, setNetworkStatus] = useState<NetworkStatus>({
    isConnected: false,
    chainId: null,
    blockNumber: null,
    latency: null,
  })

  useEffect(() => {
    const checkNetworkStatus = async () => {
      if (typeof window !== "undefined" && window.ethereum) {
        try {
          const startTime = Date.now()
          const chainId = await window.ethereum.request({ method: "eth_chainId" })
          const blockNumber = await window.ethereum.request({ method: "eth_blockNumber" })
          const latency = Date.now() - startTime

          setNetworkStatus({
            isConnected: true,
            chainId,
            blockNumber: Number.parseInt(blockNumber, 16),
            latency,
          })
        } catch (error) {
          console.error("Error checking network status:", error)
          setNetworkStatus((prev) => ({ ...prev, isConnected: false }))
        }
      }
    }

    checkNetworkStatus()

    // Check network status every 30 seconds
    const interval = setInterval(checkNetworkStatus, 30000)

    // Listen for chain changes
    if (typeof window !== "undefined" && window.ethereum) {
      window.ethereum.on("chainChanged", (chainId: string) => {
        setNetworkStatus((prev) => ({ ...prev, chainId }))
      })
    }

    return () => {
      clearInterval(interval)
    }
  }, [])

  const switchToSei = async () => {
    if (typeof window === "undefined" || !window.ethereum) {
      return
    }

    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: "0x531" }],
      })
    } catch (switchError: any) {
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: "wallet_addEthereumChain",
            params: [getSeiNetworkParams()],
          })
        } catch (addError) {
          console.error("Error adding Sei network:", addError)
        }
      }
    }
  }

  const isOnSeiNetwork = networkStatus.chainId === "0x531"
  const isConnected = networkStatus.isConnected

  if (!isConnected) {
    return (
      <Badge variant="outline" className="border-gray-500 text-gray-500">
        <AlertTriangle className="w-3 h-3 mr-1" />
        No Network
      </Badge>
    )
  }

  if (!isOnSeiNetwork) {
    return (
      <Button
        variant="outline"
        size="sm"
        onClick={switchToSei}
        className="border-yellow-500 text-yellow-500 hover:bg-yellow-500/10 bg-transparent h-6 px-2 text-xs"
      >
        <AlertTriangle className="w-3 h-3 mr-1" />
        Switch to Sei
      </Button>
    )
  }

  return (
    <div className="flex items-center space-x-2">
      <Badge variant="outline" className="border-green-500 text-green-500">
        <Zap className="w-3 h-3 mr-1" />
        Sei EVM 1329
      </Badge>
      {networkStatus.latency && (
        <Badge variant="outline" className="border-[#22D3EE] text-[#22D3EE] text-xs">
          {networkStatus.latency}ms
        </Badge>
      )}
      <Button
        variant="ghost"
        size="sm"
        className="h-6 px-2 text-gray-400 hover:bg-gray-500/20"
        onClick={() => window.open("https://seitrace.com", "_blank")}
      >
        <ExternalLink className="w-3 h-3" />
      </Button>
    </div>
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
