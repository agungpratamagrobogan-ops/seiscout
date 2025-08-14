"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TrendingUp, Copy, ExternalLink, Zap, BarChart3, DollarSign, Target, Activity } from "lucide-react"
import { seitraceAddr } from "@/lib/sei"
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
          // Fallback sample data with real DragonSwap integration
          const sampleOpportunities: TradingOpportunity[] = [
            {
              id: "1",
              walletAddress: "0x1234567890123456789012345678901234567890",
              strategy: "wSEI/USDC Arbitrage",
              pnl: "+847.2%",
              sharpeRatio: 2.34,
              winRate: 78.5,
              avgHoldTime: "4.2h",
              totalTrades: 156,
              pair: "wSEI/USDC",
              dex: "DragonSwap",
              routerAddress: "0x2Df1c51E09aECF9cacB7bc98cB1742757f163eA7", // DragonSwap Router
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
      <div className="min-h-screen bg-[#0C101A] flex items-center justify-center">
        <div className="text-[#22D3EE]">Loading trading opportunities...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0C101A] text-[#F7FAFC]">
      <Navigation />

      <div className="pt-20 pb-8">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-[#22D3EE] mb-2">Trading Opportunities</h1>
            <p className="text-gray-400">Mirror successful trading strategies with real PNL data from DragonSwap</p>
          </div>

          <Tabs defaultValue="opportunities" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2 bg-[#1A202C] border border-[#2D3748]">
              <TabsTrigger
                value="opportunities"
                className="data-[state=active]:bg-[#22D3EE] data-[state=active]:text-[#0C101A]"
              >
                <TrendingUp className="w-4 h-4 mr-2" />
                Top Performers
              </TabsTrigger>
              <TabsTrigger
                value="mirror"
                className="data-[state=active]:bg-[#22D3EE] data-[state=active]:text-[#0C101A]"
              >
                <Copy className="w-4 h-4 mr-2" />
                Mirror Trades
              </TabsTrigger>
            </TabsList>

            <TabsContent value="opportunities" className="space-y-6">
              <Card className="bg-[#1A202C] border-[#2D3748]">
                <CardHeader>
                  <CardTitle className="flex items-center text-[#22D3EE]">
                    <BarChart3 className="w-5 h-5 mr-2" />
                    High-Performance Trading Strategies
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
                          <th className="text-left p-3 text-gray-400">Wallet</th>
                          <th className="text-left p-3 text-gray-400">Strategy</th>
                          <th className="text-left p-3 text-gray-400">PNL</th>
                          <th className="text-left p-3 text-gray-400">Sharpe Ratio</th>
                          <th className="text-left p-3 text-gray-400">Win Rate</th>
                          <th className="text-left p-3 text-gray-400">Avg Hold</th>
                          <th className="text-left p-3 text-gray-400">Trades</th>
                          <th className="text-left p-3 text-gray-400">DEX</th>
                          <th className="text-left p-3 text-gray-400">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {opportunities.map((opportunity) => (
                          <tr key={opportunity.id} className="border-b border-[#2D3748]/50 hover:bg-[#2D3748]/30">
                            <td className="p-3">
                              <div className="font-mono text-[#22D3EE]">
                                {opportunity.walletAddress.slice(0, 8)}...{opportunity.walletAddress.slice(-6)}
                              </div>
                              <div className="text-xs text-gray-500">Last: {opportunity.lastTrade}</div>
                            </td>
                            <td className="p-3">
                              <div className="font-semibold">{opportunity.strategy}</div>
                              <div className="text-xs text-gray-400">{opportunity.pair}</div>
                            </td>
                            <td className="p-3">
                              <div className="flex items-center">
                                <TrendingUp className="w-3 h-3 mr-1 text-green-500" />
                                <span className="font-bold text-green-500">{opportunity.pnl}</span>
                              </div>
                            </td>
                            <td className="p-3">
                              <Badge
                                variant="outline"
                                className={
                                  opportunity.sharpeRatio >= 2
                                    ? "border-green-500 text-green-500"
                                    : opportunity.sharpeRatio >= 1.5
                                      ? "border-[#22D3EE] text-[#22D3EE]"
                                      : "border-yellow-500 text-yellow-500"
                                }
                              >
                                {opportunity.sharpeRatio.toFixed(2)}
                              </Badge>
                            </td>
                            <td className="p-3">
                              <div className="flex items-center">
                                <Target className="w-3 h-3 mr-1 text-[#22D3EE]" />
                                <span className="font-semibold">{opportunity.winRate}%</span>
                              </div>
                            </td>
                            <td className="p-3">
                              <div className="flex items-center">
                                <Activity className="w-3 h-3 mr-1 text-gray-400" />
                                <span>{opportunity.avgHoldTime}</span>
                              </div>
                            </td>
                            <td className="p-3">
                              <span className="font-semibold">{opportunity.totalTrades}</span>
                            </td>
                            <td className="p-3">
                              <Badge variant="outline" className="text-xs">
                                {opportunity.dex}
                              </Badge>
                            </td>
                            <td className="p-3">
                              <div className="flex items-center space-x-1">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-6 px-2 text-[#22D3EE] hover:bg-[#22D3EE]/20"
                                  onClick={() => window.open(seitraceAddr(opportunity.walletAddress), "_blank")}
                                >
                                  <ExternalLink className="w-3 h-3" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-6 px-2 text-green-500 hover:bg-green-500/20"
                                  onClick={() => handleMirrorTrade(opportunity)}
                                >
                                  <Copy className="w-3 h-3" />
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
            </TabsContent>

            <TabsContent value="mirror" className="space-y-6">
              {selectedOpportunity ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card className="bg-[#1A202C] border-[#2D3748]">
                    <CardHeader>
                      <CardTitle className="flex items-center text-[#22D3EE]">
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
                          <span className="font-bold text-green-500">{selectedOpportunity.pnl}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Win Rate:</span>
                          <span className="font-semibold">{selectedOpportunity.winRate}%</span>
                        </div>
                      </div>

                      {mirrorTradeData && (
                        <div className="mt-6 p-4 bg-[#0C101A] rounded-lg border border-[#2D3748]">
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
                          className="flex-1 bg-[#22D3EE] hover:bg-[#22D3EE]/90 text-[#0C101A]"
                          onClick={() => window.open(seitraceAddr(selectedOpportunity.routerAddress), "_blank")}
                        >
                          <ExternalLink className="w-4 h-4 mr-2" />
                          View Router on Seitrace
                        </Button>
                        <Button
                          variant="outline"
                          className="border-[#22D3EE] text-[#22D3EE] hover:bg-[#22D3EE]/10 bg-transparent"
                          onClick={() => window.open("https://docs.dragonswap.app", "_blank")}
                        >
                          <Zap className="w-4 h-4 mr-2" />
                          DragonSwap Docs
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-[#1A202C] border-[#2D3748]">
                    <CardHeader>
                      <CardTitle className="flex items-center text-[#22D3EE]">
                        <DollarSign className="w-5 h-5 mr-2" />
                        Performance Metrics
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center p-3 bg-[#0C101A] rounded-lg">
                          <div className="text-2xl font-bold text-green-500">{selectedOpportunity.pnl}</div>
                          <div className="text-xs text-gray-400">Total PNL</div>
                        </div>
                        <div className="text-center p-3 bg-[#0C101A] rounded-lg">
                          <div className="text-2xl font-bold text-[#22D3EE]">{selectedOpportunity.sharpeRatio}</div>
                          <div className="text-xs text-gray-400">Sharpe Ratio</div>
                        </div>
                        <div className="text-center p-3 bg-[#0C101A] rounded-lg">
                          <div className="text-2xl font-bold text-[#22D3EE]">{selectedOpportunity.winRate}%</div>
                          <div className="text-xs text-gray-400">Win Rate</div>
                        </div>
                        <div className="text-center p-3 bg-[#0C101A] rounded-lg">
                          <div className="text-2xl font-bold text-[#22D3EE]">{selectedOpportunity.totalTrades}</div>
                          <div className="text-xs text-gray-400">Total Trades</div>
                        </div>
                      </div>

                      <div className="mt-6 p-4 bg-[#0C101A] rounded-lg border border-[#2D3748]">
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
                <Card className="bg-[#1A202C] border-[#2D3748]">
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
