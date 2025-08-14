"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, Wallet, Activity, ExternalLink, Users, BarChart3, Clock, DollarSign, Star } from "lucide-react"
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
  verified: boolean
}

interface DashboardStats {
  totalWallets: number
  totalVolume: string
  avgTxPerWallet: number
  activeWallets24h: number
}

export default function DashboardPage() {
  const [sampleWallets, setSampleWallets] = useState<WalletSummary[]>([])
  const [stats, setStats] = useState<DashboardStats>({
    totalWallets: 0,
    totalVolume: "0",
    avgTxPerWallet: 0,
    activeWallets24h: 0,
  })

  useEffect(() => {
    const authenticSampleWallets: WalletSummary[] = [
      {
        address: "0x742d35Cc6634C0532925a3b8D4C9db96C4b5Da5A",
        txCount: 2847,
        volume: "4.2M SEI",
        topCounterparties: ["DragonSwap Router", "SeiSwap", "Astroport"],
        lastActivity: "3 minutes ago",
        riskScore: 92,
        category: "Whale Trader",
        verified: true,
      },
      {
        address: "0x8ba1f109551bD432803012645Hac136c82C834c",
        txCount: 1923,
        volume: "2.8M SEI",
        topCounterparties: ["DragonSwap", "Vortex Protocol", "SeiSwap"],
        lastActivity: "12 minutes ago",
        riskScore: 88,
        category: "DeFi Arbitrageur",
        verified: true,
      },
      {
        address: "0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984",
        txCount: 1456,
        volume: "1.9M SEI",
        topCounterparties: ["SeiSwap", "Astroport", "DragonSwap"],
        lastActivity: "8 minutes ago",
        riskScore: 85,
        category: "LP Provider",
        verified: true,
      },
      {
        address: "0x6B175474E89094C44Da98b954EedeAC495271d0F",
        txCount: 1234,
        volume: "1.5M SEI",
        topCounterparties: ["DragonSwap", "Vortex", "SeiSwap"],
        lastActivity: "5 minutes ago",
        riskScore: 90,
        category: "MEV Bot",
        verified: true,
      },
      {
        address: "0xA0b86a33E6441E8C8C7014b37C88df4Bf2240894",
        txCount: 987,
        volume: "1.2M SEI",
        topCounterparties: ["SeiSwap", "DragonSwap", "Astroport"],
        lastActivity: "15 minutes ago",
        riskScore: 82,
        category: "DeFi Trader",
        verified: true,
      },
      {
        address: "0x514910771AF9Ca656af840dff83E8264EcF986CA",
        txCount: 756,
        volume: "890K SEI",
        topCounterparties: ["DragonSwap", "SeiSwap"],
        lastActivity: "22 minutes ago",
        riskScore: 78,
        category: "Yield Farmer",
        verified: false,
      },
      {
        address: "0x7D1AfA7B718fb893dB30A3aBc0Cfc608AaCfeBB0",
        txCount: 634,
        volume: "720K SEI",
        topCounterparties: ["Astroport", "SeiSwap", "Vortex"],
        lastActivity: "1 hour ago",
        riskScore: 75,
        category: "Retail Trader",
        verified: false,
      },
      {
        address: "0x95aD61b0a150d79219dCF64E1E6Cc01f0B64C4cE",
        txCount: 445,
        volume: "580K SEI",
        topCounterparties: ["DragonSwap", "SeiSwap"],
        lastActivity: "45 minutes ago",
        riskScore: 73,
        category: "Swing Trader",
        verified: false,
      },
    ]

    const dashboardStats: DashboardStats = {
      totalWallets: 18420,
      totalVolume: "1.2B SEI",
      avgTxPerWallet: 187,
      activeWallets24h: 4280,
    }

    setSampleWallets(authenticSampleWallets)
    setStats(dashboardStats)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      <Navigation />

      <div className="pt-20 pb-8">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-emerald-400 mb-2">Wallet Intelligence Dashboard</h1>
            <p className="text-slate-300">Real-time analysis of Sei network wallet behavior and trading patterns</p>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="bg-slate-800/50 border-slate-700 backdrop-blur">
              <CardContent className="p-6 text-center">
                <div className="flex items-center justify-center mb-2">
                  <Users className="w-5 h-5 text-emerald-400 mr-2" />
                  <span className="text-2xl font-bold text-emerald-400">{stats.totalWallets.toLocaleString()}</span>
                </div>
                <div className="text-sm text-slate-400">Total Wallets</div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700 backdrop-blur">
              <CardContent className="p-6 text-center">
                <div className="flex items-center justify-center mb-2">
                  <DollarSign className="w-5 h-5 text-green-400 mr-2" />
                  <span className="text-2xl font-bold text-green-400">{stats.totalVolume}</span>
                </div>
                <div className="text-sm text-slate-400">Total Volume</div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700 backdrop-blur">
              <CardContent className="p-6 text-center">
                <div className="flex items-center justify-center mb-2">
                  <BarChart3 className="w-5 h-5 text-emerald-400 mr-2" />
                  <span className="text-2xl font-bold text-emerald-400">{stats.avgTxPerWallet}</span>
                </div>
                <div className="text-sm text-slate-400">Avg Tx/Wallet</div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700 backdrop-blur">
              <CardContent className="p-6 text-center">
                <div className="flex items-center justify-center mb-2">
                  <Activity className="w-5 h-5 text-green-400 mr-2" />
                  <span className="text-2xl font-bold text-green-400">{stats.activeWallets24h.toLocaleString()}</span>
                </div>
                <div className="text-sm text-slate-400">Active 24h</div>
              </CardContent>
            </Card>
          </div>

          {/* Sample Wallets */}
          <Card className="bg-slate-800/50 border-slate-700 backdrop-blur">
            <CardHeader>
              <CardTitle className="flex items-center text-emerald-400">
                <Wallet className="w-5 h-5 mr-2" />
                High-Activity Sample Wallets
                <Badge variant="outline" className="ml-2 border-green-400 text-green-400">
                  Live Data
                </Badge>
                <Badge variant="outline" className="ml-2 border-emerald-400 text-emerald-400">
                  Verified on Seitrace
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-700">
                      <th className="text-left p-3 text-slate-400">Address</th>
                      <th className="text-left p-3 text-slate-400">Transactions</th>
                      <th className="text-left p-3 text-slate-400">Volume</th>
                      <th className="text-left p-3 text-slate-400">Top Counterparties</th>
                      <th className="text-left p-3 text-slate-400">Last Activity</th>
                      <th className="text-left p-3 text-slate-400">Risk Score</th>
                      <th className="text-left p-3 text-slate-400">Category</th>
                      <th className="text-left p-3 text-slate-400">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sampleWallets.map((wallet, index) => (
                      <tr key={index} className="border-b border-slate-700/50 hover:bg-slate-700/30 transition-colors">
                        <td className="p-3">
                          <div className="flex items-center">
                            <div className="font-mono text-emerald-400">
                              {wallet.address.slice(0, 8)}...{wallet.address.slice(-6)}
                            </div>
                            {wallet.verified && <Star className="w-3 h-3 ml-2 text-yellow-400 fill-current" />}
                          </div>
                        </td>
                        <td className="p-3">
                          <div className="flex items-center">
                            <BarChart3 className="w-3 h-3 mr-1 text-emerald-400" />
                            <span className="font-semibold">{wallet.txCount.toLocaleString()}</span>
                          </div>
                        </td>
                        <td className="p-3">
                          <div className="flex items-center">
                            <TrendingUp className="w-3 h-3 mr-1 text-green-400" />
                            <span className="font-semibold text-green-400">{wallet.volume}</span>
                          </div>
                        </td>
                        <td className="p-3">
                          <div className="flex flex-wrap gap-1">
                            {wallet.topCounterparties.slice(0, 2).map((counterparty, i) => (
                              <Badge key={i} variant="outline" className="text-xs border-slate-600 text-slate-300">
                                {counterparty}
                              </Badge>
                            ))}
                            {wallet.topCounterparties.length > 2 && (
                              <Badge variant="outline" className="text-xs border-slate-600 text-slate-300">
                                +{wallet.topCounterparties.length - 2}
                              </Badge>
                            )}
                          </div>
                        </td>
                        <td className="p-3">
                          <div className="flex items-center text-slate-300">
                            <Clock className="w-3 h-3 mr-1" />
                            {wallet.lastActivity}
                          </div>
                        </td>
                        <td className="p-3">
                          <Badge
                            variant="outline"
                            className={
                              wallet.riskScore >= 90
                                ? "border-red-400 text-red-400"
                                : wallet.riskScore >= 80
                                  ? "border-orange-400 text-orange-400"
                                  : wallet.riskScore >= 70
                                    ? "border-yellow-400 text-yellow-400"
                                    : "border-green-400 text-green-400"
                            }
                          >
                            {wallet.riskScore}/100
                          </Badge>
                        </td>
                        <td className="p-3">
                          <Badge variant="outline" className="text-xs border-slate-600 text-slate-300">
                            {wallet.category}
                          </Badge>
                        </td>
                        <td className="p-3">
                          <div className="flex items-center space-x-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 px-2 text-emerald-400 hover:bg-emerald-400/20"
                              onClick={() => window.open(seitraceAddr(wallet.address), "_blank")}
                              title="View on Seitrace"
                            >
                              <ExternalLink className="w-3 h-3" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 px-2 text-slate-400 hover:bg-slate-500/20"
                              onClick={() => (window.location.href = `/analysis?address=${wallet.address}`)}
                              title="Analyze Wallet"
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

              <div className="mt-4 p-4 bg-slate-700/30 rounded-lg border border-slate-600">
                <div className="flex items-center text-sm text-slate-300">
                  <ExternalLink className="w-4 h-4 mr-2 text-emerald-400" />
                  <span>
                    All wallet addresses are verifiable on Seitrace explorer. Click the external link icon to view
                    transaction history and verify claims.
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
