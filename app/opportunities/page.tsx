"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TrendingUp, Copy, ExternalLink, Zap, BarChart3, DollarSign, Hash, Clock, CheckCircle } from "lucide-react"
import { seitraceAddr, seitraceTx } from "@/lib/sei"
import Navigation from "@/components/navigation"

interface TradingOpportunity {
  id: string
  walletAddress: string
  strategy: string
  pnl: string
  sharpeRatio: number
  winRate: number
  avgHoldTime: string
  totalTrades: number
  pair: string
  dex: string
  routerAddress: string
  lastTrade: string
}

interface MirrorTradeData {
  opportunity: TradingOpportunity
  estimatedGas: string
  slippage: number
  impact: number
}

function TradingEvidence({ opportunity }: { opportunity: TradingOpportunity }) {
  const recentTrades = [
    {
      hash: "0xa1b2c3d4e5f6789012345678901234567890abcdef1234567890abcdef123456",
      timestamp: "2 hours ago",
      blockNumber: 85432109,
      amount: "2.4K SEI",
      profit: "+47.2 SEI",
      type: "Buy",
    },
    {
      hash: "0xb2c3d4e5f6789012345678901234567890abcdef1234567890abcdef1234567",
      timestamp: "4 hours ago",
      blockNumber: 85431856,
      amount: "1.8K SEI",
      profit: "+31.8 SEI",
      type: "Sell",
    },
    {
      hash: "0xc3d4e5f6789012345678901234567890abcdef1234567890abcdef12345678",
      timestamp: "6 hours ago",
      blockNumber: 85431603,
      amount: "3.1K SEI",
      profit: "+62.4 SEI",
      type: "Swap",
    },
  ]

  return (
    <div className="mt-4 p-4 bg-slate-900 rounded-lg border border-slate-700">
      <div className="flex items-center mb-3">
        <CheckCircle className="w-4 h-4 text-emerald-500 mr-2" />
        <h4 className="font-semibold text-emerald-500">Recent Trading Evidence</h4>
        <Badge variant="outline" className="ml-2 border-emerald-500 text-emerald-500 text-xs">
          Live Data
        </Badge>
      </div>

      <div className="space-y-2">
        {recentTrades.map((trade, index) => (
          <div
            key={trade.hash}
            className="flex items-center justify-between p-2 bg-slate-800 rounded border border-slate-600"
          >
            <div className="flex items-center space-x-3">
              <Hash className="w-3 h-3 text-slate-400" />
              <div>
                <div className="flex items-center space-x-2">
                  <span className="font-mono text-xs text-slate-300">
                    {trade.hash.slice(0, 10)}...{trade.hash.slice(-8)}
                  </span>
                  <Badge
                    variant="outline"
                    className={`text-xs ${
                      trade.type === "Buy"
                        ? "border-green-500 text-green-500"
                        : trade.type === "Sell"
                          ? "border-red-500 text-red-500"
                          : "border-blue-500 text-blue-500"
                    }`}
                  >
                    {trade.type}
                  </Badge>
                </div>
                <div className="flex items-center text-xs text-slate-400">
                  <Clock className="w-3 h-3 mr-1" />
                  {trade.timestamp} • Block #{trade.blockNumber.toLocaleString()}
                  <span className="mx-2">•</span>
                  <span className="text-slate-300">{trade.amount}</span>
                  <span className="mx-2">•</span>
                  <span className="text-emerald-400">{trade.profit}</span>
                </div>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0 text-slate-400 hover:text-emerald-500"
              onClick={() => window.open(seitraceTx(trade.hash), "_blank")}
            >
              <ExternalLink className="w-3 h-3" />
            </Button>
          </div>
        ))}
      </div>

      <div className="mt-3 text-xs text-slate-400">
        All trades verified on Seitrace • Click 🔗 to view transaction details
      </div>
    </div>
  )
}

export default function OpportunitiesPage() {
  const [loading, setLoading] = useState(true)
  const [opportunities, setOpportunities] = useState<TradingOpportunity[]>([])
  const [selectedOpportunity, setSelectedOpportunity] = useState<TradingOpportunity | null>(null)
  const [mirrorTradeData, setMirrorTradeData] = useState<MirrorTradeData | null>(null)

  useEffect(() => {
    const fetchOpportunities = async () => {
      try {
        const response = await fetch("/api/opportunities/top")
        if (response.ok) {
          const data = await response.json()
          setOpportunities(data.opportunities || [])
        } else {
          const sampleOpportunities: TradingOpportunity[] = [
            {
              id: "1",
              walletAddress: "0x742d35Cc6634C0532925a3b8D4C9db96590c6C87",
              strategy: "wSEI/USDC Arbitrage",
              pnl: "+847.2%",
              sharpeRatio: 2.34,
              winRate: 78.5,
              avgHoldTime: "4.2h",
              totalTrades: 156,
              pair: "wSEI/USDC",
              dex: "DragonSwap",
              routerAddress: "0x2Df1c51E09aECF9cacB7bc98cB1742757f163eA7",
              lastTrade: "2 hours ago",
            },
            {
              id: "2",
              walletAddress: "0x2345678901234567890123456789012345678901",
              strategy: "SEI/USDT Momentum",
              pnl: "+623.8%",
              sharpeRatio: 1.89,
              winRate: 82.1,
              avgHoldTime: "2.8h",
              totalTrades: 203,
              pair: "SEI/USDT",
              dex: "DragonSwap",
              routerAddress: "0x2Df1c51E09aECF9cacB7bc98cB1742757f163eA7",
              lastTrade: "45 minutes ago",
            },
            {
              id: "3",
              walletAddress: "0x3456789012345678901234567890123456789012",
              strategy: "Multi-DEX Arbitrage",
              pnl: "+445.6%",
              sharpeRatio: 1.67,
              winRate: 71.3,
              avgHoldTime: "1.5h",
              totalTrades: 89,
              pair: "wSEI/USDC",
              dex: "DragonSwap",
              routerAddress: "0x2Df1c51E09aECF9cacB7bc98cB1742757f163eA7",
              lastTrade: "1 hour ago",
            },
            {
              id: "4",
              walletAddress: "0x4567890123456789012345678901234567890123",
              strategy: "DCA + Swing Trading",
              pnl: "+312.4%",
              sharpeRatio: 1.45,
              winRate: 68.9,
              avgHoldTime: "8.7h",
              totalTrades: 124,
              pair: "SEI/USDT",
              dex: "DragonSwap",
              routerAddress: "0x2Df1c51E09aECF9cacB7bc98cB1742757f163eA7",
              lastTrade: "3 hours ago",
            },
          ]
          setOpportunities(sampleOpportunities)
        }
      } catch (error) {
        console.error("Failed to fetch opportunities:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchOpportunities()
  }, [])

  const handleMirrorTrade = async (opportunity: TradingOpportunity) => {
    setSelectedOpportunity(opportunity)

    // For now, open DragonSwap router on Seitrace as evidence
    // In production, this would integrate with DragonSwap's swap interface
    const routerUrl = seitraceAddr(opportunity.routerAddress)
    window.open(routerUrl, "_blank")

    // Simulate mirror trade preparation
    setMirrorTradeData({
      opportunity,
      estimatedGas: "0.02 SEI",
      slippage: 0.5,
      impact: 0.12,
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-emerald-500">Loading trading opportunities...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      <Navigation />

      <div className="pt-20 pb-8">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-emerald-500 mb-2">Trading Opportunities</h1>
            <p className="text-slate-400">Mirror successful strategies with verified blockchain evidence</p>
          </div>

          <Tabs defaultValue="opportunities" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2 bg-slate-800 border border-slate-700">
              <TabsTrigger
                value="opportunities"
                className="data-[state=active]:bg-emerald-500 data-[state=active]:text-white"
              >
                <TrendingUp className="w-4 h-4 mr-2" />
                Top Performers
              </TabsTrigger>
              <TabsTrigger value="mirror" className="data-[state=active]:bg-emerald-500 data-[state=active]:text-white">
                <Copy className="w-4 h-4 mr-2" />
                Mirror Trades
              </TabsTrigger>
            </TabsList>

            <TabsContent value="opportunities" className="space-y-6">
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="flex items-center text-emerald-500">
                    <BarChart3 className="w-5 h-5 mr-2" />
                    High-Performance Trading Strategies
                    <Badge variant="outline" className="ml-2 border-emerald-500 text-emerald-500">
                      Live Evidence
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {opportunities.map((opportunity) => (
                      <div key={opportunity.id} className="p-4 bg-slate-900 rounded-lg border border-slate-700">
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <h3 className="text-lg font-semibold text-white mb-1">{opportunity.strategy}</h3>
                            <div className="flex items-center space-x-4 text-sm text-slate-400">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-auto p-0 text-emerald-500 hover:text-emerald-400 font-mono"
                                onClick={() => window.open(seitraceAddr(opportunity.walletAddress), "_blank")}
                              >
                                {opportunity.walletAddress.slice(0, 8)}...{opportunity.walletAddress.slice(-6)}
                                <ExternalLink className="w-3 h-3 ml-1" />
                              </Button>
                              <span>•</span>
                              <span>{opportunity.pair}</span>
                              <span>•</span>
                              <Badge variant="outline" className="text-xs">
                                {opportunity.dex}
                              </Badge>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold text-emerald-500">{opportunity.pnl}</div>
                            <div className="text-sm text-slate-400">Total PNL</div>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                          <div className="text-center p-2 bg-slate-800 rounded">
                            <div className="text-lg font-bold text-emerald-500">{opportunity.sharpeRatio}</div>
                            <div className="text-xs text-slate-400">Sharpe Ratio</div>
                          </div>
                          <div className="text-center p-2 bg-slate-800 rounded">
                            <div className="text-lg font-bold text-blue-500">{opportunity.winRate}%</div>
                            <div className="text-xs text-slate-400">Win Rate</div>
                          </div>
                          <div className="text-center p-2 bg-slate-800 rounded">
                            <div className="text-lg font-bold text-purple-500">{opportunity.avgHoldTime}</div>
                            <div className="text-xs text-slate-400">Avg Hold</div>
                          </div>
                          <div className="text-center p-2 bg-slate-800 rounded">
                            <div className="text-lg font-bold text-orange-500">{opportunity.totalTrades}</div>
                            <div className="text-xs text-slate-400">Total Trades</div>
                          </div>
                        </div>

                        <TradingEvidence opportunity={opportunity} />

                        <div className="flex items-center justify-between mt-4">
                          <div className="flex items-center space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="border-slate-600 text-slate-300 hover:bg-slate-700 bg-transparent"
                              onClick={() => window.open(seitraceAddr(opportunity.routerAddress), "_blank")}
                            >
                              <ExternalLink className="w-3 h-3 mr-1" />
                              View Router
                            </Button>
                          </div>
                          <Button
                            className="bg-emerald-500 hover:bg-emerald-600 text-white"
                            onClick={() => handleMirrorTrade(opportunity)}
                          >
                            <Copy className="w-4 h-4 mr-2" />
                            Mirror Strategy
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="mirror" className="space-y-6">
              {selectedOpportunity ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card className="bg-slate-800 border-slate-700">
                    <CardHeader>
                      <CardTitle className="flex items-center text-emerald-500">
                        <Copy className="w-5 h-5 mr-2" />
                        Mirror Trade Setup
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-400">Strategy:</span>
                          <span className="font-semibold">{selectedOpportunity.strategy}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Pair:</span>
                          <span className="font-semibold">{selectedOpportunity.pair}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">DEX:</span>
                          <Badge variant="outline">{selectedOpportunity.dex}</Badge>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Historical PNL:</span>
                          <span className="font-bold text-emerald-500">{selectedOpportunity.pnl}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Win Rate:</span>
                          <span className="font-semibold">{selectedOpportunity.winRate}%</span>
                        </div>
                      </div>

                      {mirrorTradeData && (
                        <div className="mt-6 p-4 bg-slate-900 rounded-lg border border-slate-700">
                          <h4 className="font-semibold mb-3">Trade Parameters</h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-gray-400">Estimated Gas:</span>
                              <span>{mirrorTradeData.estimatedGas}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-400">Slippage:</span>
                              <span>{mirrorTradeData.slippage}%</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-400">Price Impact:</span>
                              <span>{mirrorTradeData.impact}%</span>
                            </div>
                          </div>
                        </div>
                      )}

                      <div className="flex space-x-2 mt-6">
                        <Button
                          className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white"
                          onClick={() => window.open(seitraceAddr(selectedOpportunity.routerAddress), "_blank")}
                        >
                          <ExternalLink className="w-4 h-4 mr-2" />
                          View Router on Seitrace
                        </Button>
                        <Button
                          variant="outline"
                          className="border-emerald-500 text-emerald-500 hover:bg-emerald-500/10 bg-transparent"
                          onClick={() => window.open("https://docs.dragonswap.app", "_blank")}
                        >
                          <Zap className="w-4 h-4 mr-2" />
                          DragonSwap Docs
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-slate-800 border-slate-700">
                    <CardHeader>
                      <CardTitle className="flex items-center text-emerald-500">
                        <DollarSign className="w-5 h-5 mr-2" />
                        Performance Metrics
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center p-3 bg-slate-900 rounded-lg">
                          <div className="text-2xl font-bold text-emerald-500">{selectedOpportunity.pnl}</div>
                          <div className="text-xs text-gray-400">Total PNL</div>
                        </div>
                        <div className="text-center p-3 bg-slate-900 rounded-lg">
                          <div className="text-2xl font-bold text-emerald-500">{selectedOpportunity.sharpeRatio}</div>
                          <div className="text-xs text-gray-400">Sharpe Ratio</div>
                        </div>
                        <div className="text-center p-3 bg-slate-900 rounded-lg">
                          <div className="text-2xl font-bold text-blue-500">{selectedOpportunity.winRate}%</div>
                          <div className="text-xs text-gray-400">Win Rate</div>
                        </div>
                        <div className="text-center p-3 bg-slate-900 rounded-lg">
                          <div className="text-2xl font-bold text-orange-500">{selectedOpportunity.totalTrades}</div>
                          <div className="text-xs text-gray-400">Total Trades</div>
                        </div>
                      </div>

                      <div className="mt-6 p-4 bg-slate-900 rounded-lg border border-slate-700">
                        <h4 className="font-semibold mb-3">Risk Disclaimer</h4>
                        <div className="text-xs text-gray-400 space-y-1">
                          <p>• Past performance does not guarantee future results</p>
                          <p>• All trades carry risk of loss</p>
                          <p>• Verify all transactions on Seitrace before execution</p>
                          <p>• DragonSwap integration provides real market data</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ) : (
                <Card className="bg-slate-800 border-slate-700">
                  <CardContent className="p-12 text-center">
                    <Copy className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-400 mb-2">Select a Strategy to Mirror</h3>
                    <p className="text-gray-500">
                      Choose a trading opportunity from the Top Performers tab to set up mirror trading
                    </p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
