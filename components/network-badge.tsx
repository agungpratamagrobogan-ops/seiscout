"use client"

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ExternalLink, AlertTriangle, Wifi, CheckCircle } from "lucide-react"
import { getNetworkStatus, requireSeiNetwork, canConnectToSei } from "@/lib/sei"

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
  const [isSwitching, setIsSwitching] = useState(false)
  const [seiNetworkAvailable, setSeiNetworkAvailable] = useState(true)

  useEffect(() => {
    const checkNetworkStatus = async () => {
      try {
        const status = await getNetworkStatus()
        setNetworkStatus(status)

        // Check if Sei network is available
        const seiAvailable = await canConnectToSei()
        setSeiNetworkAvailable(seiAvailable)
      } catch (error) {
        console.error("Error checking network status:", error)
        setNetworkStatus((prev) => ({
          ...prev,
          error: error instanceof Error ? error.message : "Network error",
        }))
      }
    }

    checkNetworkStatus()

    const interval = setInterval(checkNetworkStatus, 15000) // Check every 15 seconds

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
    setIsSwitching(true)
    try {
      await requireSeiNetwork()
      // Refresh status after switching
      const status = await getNetworkStatus()
      setNetworkStatus(status)
    } catch (error) {
      console.error("Error switching to Sei network:", error)
      setNetworkStatus((prev) => ({
        ...prev,
        error: error instanceof Error ? error.message : "Failed to switch network",
      }))
    } finally {
      setIsSwitching(false)
    }
  }

  if (networkStatus.error === "MetaMask not installed") {
    return (
      <Button
        variant="outline"
        size="sm"
        onClick={() => window.open("https://metamask.io/download/", "_blank")}
        className="border-orange-500 text-orange-500 hover:bg-orange-500/10 bg-transparent h-6 px-2 text-xs"
      >
        <AlertTriangle className="w-3 h-3 mr-1" />
        Install MetaMask
      </Button>
    )
  }

  if (networkStatus.error && networkStatus.error !== "Server-side rendering") {
    return (
      <Badge variant="outline" className="border-red-500 text-red-500">
        <AlertTriangle className="w-3 h-3 mr-1" />
        Network Error
      </Badge>
    )
  }

  if (!seiNetworkAvailable) {
    return (
      <Badge variant="outline" className="border-red-500 text-red-500">
        <AlertTriangle className="w-3 h-3 mr-1" />
        Sei RPC Unavailable
      </Badge>
    )
  }

  if (!networkStatus.isConnected) {
    return (
      <Badge variant="outline" className="border-slate-500 text-slate-400">
        <Wifi className="w-3 h-3 mr-1" />
        Wallet Not Connected
      </Badge>
    )
  }

  if (!networkStatus.isOnSeiNetwork) {
    return (
      <Button
        variant="outline"
        size="sm"
        onClick={switchToSei}
        disabled={isSwitching}
        className="border-yellow-500 text-yellow-500 hover:bg-yellow-500/10 bg-transparent h-6 px-2 text-xs"
      >
        <AlertTriangle className="w-3 h-3 mr-1" />
        {isSwitching ? "Switching..." : "Switch to Sei EVM"}
      </Button>
    )
  }

  return (
    <div className="flex items-center space-x-2">
      <Badge variant="outline" className="border-emerald-500 text-emerald-500">
        <CheckCircle className="w-3 h-3 mr-1" />
        Sei EVM (1329)
      </Badge>
      {networkStatus.latency && (
        <Badge variant="outline" className="border-emerald-400 text-emerald-400 text-xs">
          {networkStatus.latency}ms
        </Badge>
      )}
      <Button
        variant="ghost"
        size="sm"
        className="h-6 px-2 text-slate-400 hover:text-emerald-500"
        onClick={() => window.open("https://seitrace.com", "_blank")}
        title="View on Seitrace Explorer"
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
