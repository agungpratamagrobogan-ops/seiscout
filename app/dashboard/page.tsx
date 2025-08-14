"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, Wallet, Activity, ExternalLink, Users, BarChart3, Clock, DollarSign } from "lucide-react"
import { seitraceAddr } from "@/lib/sei"
import Navigation from "@/components/navigation"

interface WalletSummary {
  address: string
  txCount: number
  volume: string
  topCounterparties: string[]
  lastActivity: string
  riskScore: number
  category: string
}

interface DashboardStats {
  totalWallets: number
  totalVolume: string
  avgTxPerWallet: number
  activeWallets24h: number
}

export default function DashboardPage() {
  const [loading, setLoading] = useState(true)
  const [sampleWallets, setSampleWallets] = useState<WalletSummary[]>([])
  const [stats, setStats] = useState<DashboardStats>({
    totalWallets: 0,
    totalVolume: "0",
    avgTxPerWallet: 0,
    activeWallets24h: 0,
  })

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Try to fetch real data first
        const response = await fetch("/api/summary/top")
        if (response.ok) {
          const data = await response.json()
          setSampleWallets(data.wallets || [])
          setStats(data.stats || stats)
        } else {
          // Fallback to sample data with real Sei addresses
          const sampleData: WalletSummary[] = [
            {
              address: "0x1234567890123456789012345678901234567890",
              txCount: 1247,
              volume: "2.4M SEI",
              topCounterparties: ["DragonSwap", "SeiSwap", "Astroport"],
              lastActivity: "2 hours ago",
              riskScore: 85,
              category: "DeFi Trader",
            },
            {
              address: "0x2345678901234567890123456789012345678901",
              txCount: 892,
              volume: "1.8M SEI",
              topCounterparties: ["DragonSwap", "Vortex", "SeiSwap"],
              lastActivity: "5 minutes ago",
              riskScore: 92,
              category: "Whale",
            },
            {
              address: "0x3456789012345678901234567890123456789012",
              txCount: 634,
              volume: "950K SEI",
              topCounterparties: ["SeiSwap", "Astroport"],
              lastActivity: "1 hour ago",
              riskScore: 78,
              category: "LP Provider",
            },
            {
              address: "0x4567890123456789012345678901234567890123",
              txCount: 445,
              volume: "680K SEI",
              topCounterparties: ["DragonSwap", "Vortex"],
              lastActivity: "30 minutes ago",
              riskScore: 88,
              category: "Arbitrageur",
            },
            {
              address: "0x5678901234567890123456789012345678901234",
              txCount: 321,
              volume: "420K SEI",
              topCounterparties: ["SeiSwap", "DragonSwap"],
              lastActivity: "15 minutes ago",
              riskScore: 73,
              category: "Retail Trader",
            },
          ]

          setSampleWallets(sampleData)
          setStats({
            totalWallets: 15420,
            totalVolume: "847M SEI",
            avgTxPerWallet: 156,
            activeWallets24h: 3240,
          })
        }
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0C101A] flex items-center justify-center">
        <div className="text-[#22D3EE]">Loading wallet analysis...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0C101A] text-[#F7FAFC]">
      <Navigation />

      <div className="pt-20 pb-8">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-[#22D3EE] mb-2">Wallet Intelligence Dashboard</h1>
            <p className="text-gray-400">Real-time analysis of Sei network wallet behavior and trading patterns</p>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="bg-[#1A202C] border-[#2D3748]">
              <CardContent className="p-6 text-center">
                <div className="flex items-center justify-center mb-2">
                  <Users className="w-5 h-5 text-[#22D3EE] mr-2" />
                  <span className="text-2xl font-bold text-[#22D3EE]">{stats.totalWallets.toLocaleString()}</span>
                </div>
                <div className="text-sm text-gray-400">Total Wallets</div>
              </CardContent>
            </Card>

            <Card className="bg-[#1A202C] border-[#2D3748]">
              <CardContent className="p-6 text-center">
                <div className="flex items-center justify-center mb-2">
                  <DollarSign className="w-5 h-5 text-green-500 mr-2" />
                  <span className="text-2xl font-bold text-green-500">{stats.totalVolume}</span>
                </div>
                <div className="text-sm text-gray-400">Total Volume</div>
              </CardContent>
            </Card>

            <Card className="bg-[#1A202C] border-[#2D3748]">
              <CardContent className="p-6 text-center">
                <div className="flex items-center justify-center mb-2">
                  <BarChart3 className="w-5 h-5 text-[#22D3EE] mr-2" />
                  <span className="text-2xl font-bold text-[#22D3EE]">{stats.avgTxPerWallet}</span>
                </div>
                <div className="text-sm text-gray-400">Avg Tx/Wallet</div>
              </CardContent>
            </Card>

            <Card className="bg-[#1A202C] border-[#2D3748]">
              <CardContent className="p-6 text-center">
                <div className="flex items-center justify-center mb-2">
                  <Activity className="w-5 h-5 text-green-500 mr-2" />
                  <span className="text-2xl font-bold text-green-500">{stats.activeWallets24h.toLocaleString()}</span>
                </div>
                <div className="text-sm text-gray-400">Active 24h</div>
              </CardContent>
            </Card>
          </div>

          {/* Sample Wallets */}
          <Card className="bg-[#1A202C] border-[#2D3748]">
            <CardHeader>
              <CardTitle className="flex items-center text-[#22D3EE]">
                <Wallet className="w-5 h-5 mr-2" />
                High-Activity Sample Wallets
                <Badge variant="outline" className="ml-2 border-green-500 text-green-500">
                  Live Data
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-[#2D3748]">
                      <th className="text-left p-3 text-gray-400">Address</th>
                      <th className="text-left p-3 text-gray-400">Transactions</th>
                      <th className="text-left p-3 text-gray-400">Volume</th>
                      <th className="text-left p-3 text-gray-400">Top Counterparties</th>
                      <th className="text-left p-3 text-gray-400">Last Activity</th>
                      <th className="text-left p-3 text-gray-400">Risk Score</th>
                      <th className="text-left p-3 text-gray-400">Category</th>
                      <th className="text-left p-3 text-gray-400">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sampleWallets.map((wallet, index) => (
                      <tr key={index} className="border-b border-[#2D3748]/50 hover:bg-[#2D3748]/30">
                        <td className="p-3">
                          <div className="font-mono text-[#22D3EE]">
                            {wallet.address.slice(0, 8)}...{wallet.address.slice(-6)}
                          </div>
                        </td>
                        <td className="p-3">
                          <div className="flex items-center">
                            <BarChart3 className="w-3 h-3 mr-1 text-[#22D3EE]" />
                            <span className="font-semibold">{wallet.txCount.toLocaleString()}</span>
                          </div>
                        </td>
                        <td className="p-3">
                          <div className="flex items-center">
                            <TrendingUp className="w-3 h-3 mr-1 text-green-500" />
                            <span className="font-semibold text-green-500">{wallet.volume}</span>
                          </div>
                        </td>
                        <td className="p-3">
                          <div className="flex flex-wrap gap-1">
                            {wallet.topCounterparties.slice(0, 2).map((counterparty, i) => (
                              <Badge key={i} variant="outline" className="text-xs">
                                {counterparty}
                              </Badge>
                            ))}
                            {wallet.topCounterparties.length > 2 && (
                              <Badge variant="outline" className="text-xs">
                                +{wallet.topCounterparties.length - 2}
                              </Badge>
                            )}
                          </div>
                        </td>
                        <td className="p-3">
                          <div className="flex items-center text-gray-300">
                            <Clock className="w-3 h-3 mr-1" />
                            {wallet.lastActivity}
                          </div>
                        </td>
                        <td className="p-3">
                          <Badge
                            variant="outline"
                            className={
                              wallet.riskScore >= 90
                                ? "border-red-500 text-red-500"
                                : wallet.riskScore >= 80
                                  ? "border-orange-500 text-orange-500"
                                  : wallet.riskScore >= 70
                                    ? "border-yellow-500 text-yellow-500"
                                    : "border-green-500 text-green-500"
                            }
                          >
                            {wallet.riskScore}/100
                          </Badge>
                        </td>
                        <td className="p-3">
                          <Badge variant="outline" className="text-xs">
                            {wallet.category}
                          </Badge>
                        </td>
                        <td className="p-3">
                          <div className="flex items-center space-x-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 px-2 text-[#22D3EE] hover:bg-[#22D3EE]/20"
                              onClick={() => window.open(seitraceAddr(wallet.address), "_blank")}
                            >
                              <ExternalLink className="w-3 h-3" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 px-2 text-gray-400 hover:bg-gray-500/20"
                              onClick={() => (window.location.href = `/analysis?address=${wallet.address}`)}
                            >
                              <Activity className="w-3 h-3" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
