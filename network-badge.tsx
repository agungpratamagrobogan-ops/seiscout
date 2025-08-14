"use client"

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, AlertCircle, Wifi } from "lucide-react"

export function NetworkBadge() {
  const [networkStatus, setNetworkStatus] = useState({
    isConnected: false,
    chainId: null as number | null,
    blockNumber: null as number | null,
    latency: null as number | null,
  })

  useEffect(() => {
    const checkNetworkStatus = async () => {
      if (typeof window !== "undefined" && window.ethereum) {
        try {
          const start = Date.now()
          const chainId = await window.ethereum.request({ method: "eth_chainId" })
          const blockNumber = await window.ethereum.request({ method: "eth_blockNumber" })
          const latency = Date.now() - start

          setNetworkStatus({
            isConnected: true,
            chainId: Number.parseInt(chainId, 16),
            blockNumber: Number.parseInt(blockNumber, 16),
            latency,
          })
        } catch (error) {
          setNetworkStatus((prev) => ({ ...prev, isConnected: false }))
        }
      }
    }

    checkNetworkStatus()
    const interval = setInterval(checkNetworkStatus, 10000) // Check every 10 seconds

    return () => clearInterval(interval)
  }, [])

  const isCorrectNetwork = networkStatus.chainId === 1329

  return (
    <div className="flex items-center gap-2">
      <Badge
        variant={isCorrectNetwork ? "default" : "destructive"}
        className={`${isCorrectNetwork ? "bg-green-600 text-white" : "bg-red-600 text-white"}`}
      >
        {isCorrectNetwork ? <CheckCircle className="w-3 h-3 mr-1" /> : <AlertCircle className="w-3 h-3 mr-1" />}
        Sei EVM {networkStatus.chainId || "Disconnected"}
      </Badge>

      {networkStatus.latency && (
        <Badge variant="outline" className="text-xs">
          <Wifi className="w-3 h-3 mr-1" />
          {networkStatus.latency}ms
        </Badge>
      )}
    </div>
  )
}
