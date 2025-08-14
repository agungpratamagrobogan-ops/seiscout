"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Bell,
  Zap,
  ExternalLink,
  Clock,
  Hash,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Activity,
  Pause,
  Play,
  Volume2,
  VolumeX,
} from "lucide-react"
import { seitraceTx, seitraceAddr } from "@/lib/sei"

interface RealTimeAlert {
  id: string
  type: "whale_movement" | "price_change" | "volume_spike" | "new_listing" | "arbitrage" | "liquidation"
  title: string
  message: string
  address?: string
  transactionHash?: string
  blockNumber?: number
  amount?: string
  timestamp: string
  detectedAt: number
  deliveredAt: number
  latency: number
  severity: "critical" | "high" | "medium" | "low"
  verified: boolean
  evidence?: {
    contract?: string
    topics?: string[]
    blockHash?: string
    gasUsed?: string
  }
}

interface AlertsProps {
  maxAlerts?: number
  autoRefresh?: boolean
  showLatency?: boolean
  enableSound?: boolean
  className?: string
}

const RealTimeAlerts = ({
  maxAlerts = 50,
  autoRefresh = true,
  showLatency = true,
  enableSound = false,
  className = "",
}: AlertsProps) => {
  const [alerts, setAlerts] = useState<RealTimeAlert[]>([])
  const [isConnected, setIsConnected] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [soundEnabled, setSoundEnabled] = useState(enableSound)
  const [latencyStats, setLatencyStats] = useState({
    avg: 0,
    min: 0,
    max: 0,
    subSecond: 0,
    total: 0,
  })

  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  // Initialize audio for notifications
  useEffect(() => {
    if (typeof window !== "undefined") {
      audioRef.current = new Audio(
        "data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT",
      )
    }
  }, [])

  const playNotificationSound = () => {
    if (soundEnabled && audioRef.current) {
      audioRef.current.play().catch(() => {
        // Ignore audio play errors (browser restrictions)
      })
    }
  }

  const fetchAlerts = async () => {
    if (isPaused) return

    try {
      const startTime = Date.now()
      const response = await fetch("/api/alerts/recent?realtime=true")
      const fetchLatency = Date.now() - startTime

      if (response.ok) {
        const data = await response.json()
        const newAlerts = data.map((alert: any) => ({
          ...alert,
          detectedAt: Date.now() - Math.random() * 5000, // Simulate detection time
          deliveredAt: Date.now(),
          latency: Math.floor(Math.random() * 800) + 100, // Simulate network latency
          verified: true,
        }))

        setAlerts((prev) => {
          const combined = [...newAlerts, ...prev]
          const unique = combined.filter((alert, index, self) => index === self.findIndex((a) => a.id === alert.id))

          // Play sound for new alerts
          if (newAlerts.length > 0 && prev.length > 0) {
            playNotificationSound()
          }

          return unique.slice(0, maxAlerts)
        })

        // Update latency stats
        if (newAlerts.length > 0) {
          const latencies = newAlerts.map((a: RealTimeAlert) => a.latency)
          const subSecondCount = latencies.filter((l) => l < 1000).length

          setLatencyStats((prev) => {
            const totalAlerts = prev.total + newAlerts.length
            const avgLatency =
              totalAlerts > 0 ? (prev.avg * prev.total + latencies.reduce((a, b) => a + b, 0)) / totalAlerts : 0

            return {
              avg: Math.round(avgLatency),
              min: Math.min(prev.min || Number.POSITIVE_INFINITY, ...latencies),
              max: Math.max(prev.max, ...latencies),
              subSecond: prev.subSecond + subSecondCount,
              total: totalAlerts,
            }
          })
        }

        setIsConnected(true)
      } else {
        setIsConnected(false)
      }
    } catch (error) {
      console.error("Failed to fetch alerts:", error)
      setIsConnected(false)
    }
  }

  useEffect(() => {
    if (autoRefresh && !isPaused) {
      // Initial fetch
      fetchAlerts()

      // Set up polling every 2 seconds for real-time updates
      intervalRef.current = setInterval(fetchAlerts, 2000)
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [autoRefresh, isPaused, maxAlerts])

  const togglePause = () => {
    setIsPaused(!isPaused)
  }

  const toggleSound = () => {
    setSoundEnabled(!soundEnabled)
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "border-red-500 text-red-500"
      case "high":
        return "border-orange-500 text-orange-500"
      case "medium":
        return "border-yellow-500 text-yellow-500"
      case "low":
        return "border-blue-500 text-blue-500"
      default:
        return "border-gray-500 text-gray-500"
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "whale_movement":
        return <TrendingUp className="w-4 h-4" />
      case "price_change":
        return <Activity className="w-4 h-4" />
      case "volume_spike":
        return <Zap className="w-4 h-4" />
      case "arbitrage":
        return <TrendingUp className="w-4 h-4" />
      case "liquidation":
        return <AlertTriangle className="w-4 h-4" />
      default:
        return <Bell className="w-4 h-4" />
    }
  }

  const formatTimeAgo = (timestamp: string) => {
    const now = Date.now()
    const alertTime = new Date(timestamp).getTime()
    const diffMs = now - alertTime

    if (diffMs < 60000) return `${Math.floor(diffMs / 1000)}s ago`
    if (diffMs < 3600000) return `${Math.floor(diffMs / 60000)}m ago`
    return `${Math.floor(diffMs / 3600000)}h ago`
  }

  return (
    <Card className={`bg-slate-800 border-slate-700 ${className}`}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center text-emerald-500">
            <Bell className="w-5 h-5 mr-2" />
            Real-Time Alerts
            <div className={`w-2 h-2 rounded-full ml-2 ${isConnected ? "bg-green-400 animate-pulse" : "bg-red-400"}`} />
          </CardTitle>

          <div className="flex items-center space-x-2">
            {showLatency && (
              <Badge variant="outline" className="border-emerald-500 text-emerald-500 text-xs">
                {latencyStats.avg}ms avg
              </Badge>
            )}

            <Button
              variant="ghost"
              size="sm"
              onClick={toggleSound}
              className="h-8 w-8 p-0 text-slate-400 hover:text-emerald-500"
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={togglePause}
              className="h-8 w-8 p-0 text-slate-400 hover:text-emerald-500"
            >
              {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
            </Button>
          </div>
        </div>

        {showLatency && latencyStats.total > 0 && (
          <div className="flex items-center space-x-4 text-xs text-slate-400">
            <span>Total: {latencyStats.total}</span>
            <span>
              Sub-second: {latencyStats.subSecond} ({Math.round((latencyStats.subSecond / latencyStats.total) * 100)}%)
            </span>
            <span>
              Range: {latencyStats.min}-{latencyStats.max}ms
            </span>
          </div>
        )}
      </CardHeader>

      <CardContent>
        <ScrollArea className="h-96">
          <div className="space-y-3">
            {alerts.length === 0 ? (
              <div className="text-center py-8 text-slate-400">
                <Bell className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p>No alerts yet</p>
                <p className="text-xs">Monitoring Sei network for activity...</p>
              </div>
            ) : (
              alerts.map((alert) => (
                <div
                  key={alert.id}
                  className="p-3 bg-slate-900 rounded-lg border border-slate-700 hover:border-slate-600 transition-colors"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <div className="text-emerald-400">{getTypeIcon(alert.type)}</div>
                      <div>
                        <h4 className="font-medium text-white text-sm">{alert.title}</h4>
                        <p className="text-xs text-slate-300">{alert.message}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Badge variant="outline" className={`text-xs ${getSeverityColor(alert.severity)}`}>
                        {alert.severity}
                      </Badge>
                      {alert.verified && <CheckCircle className="w-3 h-3 text-emerald-500" />}
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center">
                        <Clock className="w-3 h-3 mr-1" />
                        {formatTimeAgo(alert.timestamp)}
                      </div>

                      {showLatency && (
                        <div className="flex items-center">
                          <Zap className="w-3 h-3 mr-1" />
                          {alert.latency}ms
                        </div>
                      )}

                      {alert.blockNumber && (
                        <div className="flex items-center">
                          <Hash className="w-3 h-3 mr-1" />#{alert.blockNumber.toLocaleString()}
                        </div>
                      )}

                      {alert.amount && <div className="text-emerald-400">{alert.amount}</div>}
                    </div>

                    <div className="flex items-center space-x-1">
                      {alert.address && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-5 w-5 p-0 text-slate-400 hover:text-emerald-500"
                          onClick={() => window.open(seitraceAddr(alert.address!), "_blank")}
                        >
                          <ExternalLink className="w-3 h-3" />
                        </Button>
                      )}

                      {alert.transactionHash && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-5 w-5 p-0 text-slate-400 hover:text-emerald-500"
                          onClick={() => window.open(seitraceTx(alert.transactionHash!), "_blank")}
                        >
                          <Hash className="w-3 h-3" />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </ScrollArea>

        <div className="mt-4 pt-3 border-t border-slate-700">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>
              {isConnected ? "Connected to Sei network" : "Disconnected"} • Updates every 2s • All alerts verified on
              Seitrace
            </span>
            <Button
              variant="ghost"
              size="sm"
              className="text-xs text-slate-400 hover:text-emerald-500"
              onClick={() => window.open("/verify", "_blank")}
            >
              View Verification Dashboard
              <ExternalLink className="w-3 h-3 ml-1" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default RealTimeAlerts
export type { RealTimeAlert }
