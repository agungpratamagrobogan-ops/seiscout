"use client"

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Zap, ExternalLink, AlertTriangle, Wifi } from "lucide-react"
import { getNetworkStatus, requireSeiNetwork } from "@/lib/sei"

interface NetworkStatus {
  isConnected: boolean
  chainId: string | null
  blockNumber: number | null
  latency: number | null
  isOnSeiNetwork: boolean
  error: string | null
}

export function NetworkBadge() {
  const [networkStatus, setNetworkStatus] = useState<NetworkStatus>({
    isConnected: false,
    chainId: null,
    blockNumber: null,
    latency: null,
    isOnSeiNetwork: false,
    error: null,
  })

  useEffect(() => {
    const checkNetworkStatus = async () => {
      try {
        const status = await getNetworkStatus()
        setNetworkStatus(status)
      } catch (error) {
        console.error("Error checking network status:", error)
        setNetworkStatus((prev) => ({
          ...prev,
          error: error instanceof Error ? error.message : "Network error",
        }))
      }
    }

    checkNetworkStatus()

    const interval = setInterval(checkNetworkStatus, 10000) // Check every 10 seconds

    // Listen for chain changes
    if (typeof window !== "undefined" && window.ethereum) {
      const handleChainChanged = () => {
        setTimeout(checkNetworkStatus, 500) // Small delay to ensure chain switch is complete
      }

      const handleAccountsChanged = () => {
        setTimeout(checkNetworkStatus, 500)
      }

      window.ethereum.on("chainChanged", handleChainChanged)
      window.ethereum.on("accountsChanged", handleAccountsChanged)

      return () => {
        clearInterval(interval)
        window.ethereum?.removeListener("chainChanged", handleChainChanged)
        window.ethereum?.removeListener("accountsChanged", handleAccountsChanged)
      }
    }

    return () => {
      clearInterval(interval)
    }
  }, [])

  const switchToSei = async () => {
    try {
      await requireSeiNetwork()
      // Refresh status after switching
      const status = await getNetworkStatus()
      setNetworkStatus(status)
    } catch (error) {
      console.error("Error switching to Sei network:", error)
    }
  }

  if (networkStatus.error) {
    return (
      <Badge variant="outline" className="border-red-500 text-red-500">
        <AlertTriangle className="w-3 h-3 mr-1" />
        {networkStatus.error}
      </Badge>
    )
  }

  if (!networkStatus.isConnected) {
    return (
      <Badge variant="outline" className="border-gray-500 text-gray-500">
        <Wifi className="w-3 h-3 mr-1" />
        No Connection
      </Badge>
    )
  }

  if (!networkStatus.isOnSeiNetwork) {
    return (
      <Button
        variant="outline"
        size="sm"
        onClick={switchToSei}
        className="border-yellow-500 text-yellow-500 hover:bg-yellow-500/10 bg-transparent h-6 px-2 text-xs"
      >
        <AlertTriangle className="w-3 h-3 mr-1" />
        Switch to Sei EVM
      </Button>
    )
  }

  return (
    <div className="flex items-center space-x-2">
      <Badge variant="outline" className="border-emerald-500 text-emerald-500">
        <Zap className="w-3 h-3 mr-1" />
        Sei EVM 1329
      </Badge>
      {networkStatus.latency && (
        <Badge variant="outline" className="border-emerald-400 text-emerald-400 text-xs">
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
