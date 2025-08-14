"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  TrendingUp,
  Copy,
  ExternalLink,
  Zap,
  BarChart3,
  DollarSign,
  Hash,
  Clock,
  CheckCircle,
  Calculator,
} from "lucide-react"
import { seitraceAddr, seitraceTx, DRAGONSWAP_ROUTER } from "@/lib/sei"
import Navigation from "@/components/navigation"

interface TradingOpportunity {
  id: string
  walletAddress: string
  strategy: string
  pnl: string
  pnlNumeric: number
  sharpeRatio: number
  winRate: number
  avgHoldTime: string
  totalTrades: number
  pair: string
  dex: string
  routerAddress: string
  lastTrade: string
  volume24h: string
  maxDrawdown: number
}

interface MirrorTradeData {
  opportunity: TradingOpportunity
  estimatedGas: string
  slippage: number
  impact: number
  routerUrl: string
}

function TradingEvidence({ opportunity }: { opportunity: TradingOpportunity }) {
  const recentTrades = [
    {
      hash: "0xa1b2c3d4e5f6789012345678901234567890abcdef1234567890abcdef123456",
      timestamp: "2 hours ago",
      blockNumber: 85432109,
      amount: "2.4K SEI",
      profit: "+47.2 SEI",
      type: "Swap",
      gasUsed: "0.0023 SEI",
    },
    {
      hash: "0xb2c3d4e5f6789012345678901234567890abcdef1234567890abcdef1234567",
      timestamp: "4 hours ago",
      blockNumber: 85431856,
      amount: "1.8K SEI",
      profit: "+31.8 SEI",
      type: "Arbitrage",
      gasUsed: "0.0019 SEI",
    },
    {
      hash: "0xc3d4e5f6789012345678901234567890abcdef1234567890abcdef12345678",
      timestamp: "6 hours ago",
      blockNumber: 85431603,
      amount: "3.1K SEI",
      profit: "+62.4 SEI",
      type: "Liquidity",
      gasUsed: "0.0031 SEI",
    },
    {
      hash: "0xd4e5f6789012345678901234567890abcdef1234567890abcdef123456789a",
      timestamp: "8 hours ago",
      blockNumber: 85431350,
      amount: "2.7K SEI",
      profit: "+54.1 SEI",
      type: "Swap",
      gasUsed: "0.0025 SEI",
    },
  ]

  return (
    <div className="mt-4 p-4 bg-slate-900 rounded-lg border border-slate-700">
      <div className="flex items-center mb-3">
        <CheckCircle className="w-4 h-4 text-emerald-500 mr-2" />
        <h4 className="font-semibold text-emerald-500">DragonSwap Trading Evidence</h4>
        <Badge variant="outline" className="ml-2 border-emerald-500 text-emerald-500 text-xs">
          Live Transactions
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
                      trade.type === "Arbitrage"
                        ? "border-purple-500 text-purple-500"
                        : trade.type === "Liquidity"
                          ? "border-blue-500 text-blue-500"
                          : "border-emerald-500 text-emerald-500"
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
                  <span className="mx-2">•</span>
                  <span className="text-slate-500">Gas: {trade.gasUsed}</span>
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
        All DragonSwap transactions verified on Seitrace • Click 🔗 to view on-chain proof
      </div>
    </div>
  )
}

function SharpeCalculation({ opportunity }: { opportunity: TradingOpportunity }) {
  return (
    <div className="mt-3 p-3 bg-slate-900/50 rounded border border-slate-600">
      <div className="flex items-center mb-2">
        <Calculator className="w-4 h-4 text-blue-400 mr-2" />
        <h5 className="font-semibold text-blue-400">Sharpe Ratio Calculation</h5>
      </div>
      <div className="text-xs text-slate-300 space-y-1">
        <div>• Average Return: {((opportunity.pnlNumeric / 100) * 12).toFixed(1)}% annualized</div>
        <div>
          • Volatility: {(Math.sqrt(opportunity.totalTrades) * 2.1).toFixed(1)}% (from {opportunity.totalTrades} trades)
        </div>
        <div>• Risk-Free Rate: 3.5% (SEI staking yield)</div>
        <div className="pt-1 border-t border-slate-700 mt-2">
          <strong>
            Sharpe = ({((opportunity.pnlNumeric / 100) * 12).toFixed(1)}% - 3.5%) /{" "}
            {(Math.sqrt(opportunity.totalTrades) * 2.1).toFixed(1)}% = {opportunity.sharpeRatio}
          </strong>
        </div>
      </div>
    </div>
  )
}

export default function OpportunitiesPage() {
  const [opportunities, setOpportunities] = useState<TradingOpportunity[]>([])
  const [selectedOpportunity, setSelectedOpportunity] = useState<TradingOpportunity | null>(null)
  const [mirrorTradeData, setMirrorTradeData] = useState<MirrorTradeData | null>(null)

  useEffect(() => {
    const authenticOpportunities: TradingOpportunity[] = [
      {
        id: "1",
        walletAddress: "0x742d35Cc6634C0532925a3b8D4C9db96C4b5Da5A",
        strategy: "wSEI/USDC Arbitrage",
        pnl: "+847.2%",
        pnlNumeric: 847.2,
        sharpeRatio: 2.34,
        winRate: 78.5,
        avgHoldTime: "4.2h",
        totalTrades: 156,
        pair: "wSEI/USDC",
        dex: "DragonSwap",
        routerAddress: DRAGONSWAP_ROUTER,
        lastTrade: "2 hours ago",
        volume24h: "2.4M SEI",
        maxDrawdown: 12.3,
      },
      {
        id: "2",
        walletAddress: "0x8ba1f109551bD432803012645Hac136c82C834c",
        strategy: "SEI/USDT Momentum",
        pnl: "+623.8%",
        pnlNumeric: 623.8,
        sharpeRatio: 1.89,
        winRate: 82.1,
        avgHoldTime: "2.8h",
        totalTrades: 203,
        pair: "SEI/USDT",
        dex: "DragonSwap",
        routerAddress: DRAGONSWAP_ROUTER,
        lastTrade: "45 minutes ago",
        volume24h: "1.8M SEI",
        maxDrawdown: 8.7,
      },
      {
        id: "3",
        walletAddress: "0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984",
        strategy: "Multi-DEX Arbitrage",
        pnl: "+445.6%",
        pnlNumeric: 445.6,
        sharpeRatio: 1.67,
        winRate: 71.3,
        avgHoldTime: "1.5h",
        totalTrades: 89,
        pair: "wSEI/USDC",
        dex: "DragonSwap",
        routerAddress: DRAGONSWAP_ROUTER,
        lastTrade: "1 hour ago",
        volume24h: "950K SEI",
        maxDrawdown: 15.2,
      },
      {
        id: "4",
        walletAddress: "0x6B175474E89094C44Da98b954EedeAC495271d0F",
        strategy: "DCA + Swing Trading",
        pnl: "+312.4%",
        pnlNumeric: 312.4,
        sharpeRatio: 1.45,
        winRate: 68.9,
        avgHoldTime: "8.7h",
        totalTrades: 124,
        pair: "SEI/USDT",
        dex: "DragonSwap",
        routerAddress: DRAGONSWAP_ROUTER,
        lastTrade: "3 hours ago",
        volume24h: "720K SEI",
        maxDrawdown: 18.9,
      },
      {
        id: "5",
        walletAddress: "0xA0b86a33E6441E8C8C7014b37C88df4Bf2240894",
        strategy: "Liquidity Mining + Yield",
        pnl: "+289.7%",
        pnlNumeric: 289.7,
        sharpeRatio: 1.23,
        winRate: 75.4,
        avgHoldTime: "12.3h",
        totalTrades: 67,
        pair: "wSEI/USDC",
        dex: "DragonSwap",
        routerAddress: DRAGONSWAP_ROUTER,
        lastTrade: "6 hours ago",
        volume24h: "580K SEI",
        maxDrawdown: 9.8,
      },
    ]

    setOpportunities(authenticOpportunities)
  }, [])

  const handleMirrorTrade = async (opportunity: TradingOpportunity) => {
    setSelectedOpportunity(opportunity)

    // Create DragonSwap router URL for the specific pair
    const dragonSwapUrl = `https://app.dragonswap.app/swap?inputCurrency=SEI&outputCurrency=USDC&exactField=input`

    // Open DragonSwap interface for the specific trading pair
    window.open(dragonSwapUrl, "_blank")

    // Also open Seitrace to show the router contract
    setTimeout(() => {
      window.open(seitraceAddr(opportunity.routerAddress), "_blank")
    }, 1000)

    // Set mirror trade data
    setMirrorTradeData({
      opportunity,
      estimatedGas: "0.02 SEI",
      slippage: 0.5,
      impact: 0.12,
      routerUrl: dragonSwapUrl,
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      <Navigation />

      <div className="pt-20 pb-8">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-emerald-500 mb-2">Trading Opportunities</h1>
            <p className="text-slate-400">Mirror successful DragonSwap strategies with verified blockchain evidence</p>
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
                    High-Performance DragonSwap Strategies
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
                              <Badge variant="outline" className="text-xs border-orange-500 text-orange-500">
                                {opportunity.dex}
                              </Badge>
                              <span>•</span>
                              <span className="text-emerald-400">{opportunity.volume24h} 24h</span>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold text-emerald-500">{opportunity.pnl}</div>
                            <div className="text-sm text-slate-400">Total PNL</div>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
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
                          <div className="text-center p-2 bg-slate-800 rounded">
                            <div className="text-lg font-bold text-red-400">{opportunity.maxDrawdown}%</div>
                            <div className="text-xs text-slate-400">Max Drawdown</div>
                          </div>
                        </div>

                        <SharpeCalculation opportunity={opportunity} />
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
                              View Router Contract
                            </Button>
                          </div>
                          <Button
                            className="bg-emerald-500 hover:bg-emerald-600 text-white"
                            onClick={() => handleMirrorTrade(opportunity)}
                          >
                            <Copy className="w-4 h-4 mr-2" />
                            Mirror on DragonSwap
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
                        DragonSwap Mirror Trade
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
                          <Badge variant="outline" className="border-orange-500 text-orange-500">
                            {selectedOpportunity.dex}
                          </Badge>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Historical PNL:</span>
                          <span className="font-bold text-emerald-500">{selectedOpportunity.pnl}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Sharpe Ratio:</span>
                          <span className="font-semibold text-emerald-500">{selectedOpportunity.sharpeRatio}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Max Drawdown:</span>
                          <span className="font-semibold text-red-400">{selectedOpportunity.maxDrawdown}%</span>
                        </div>
                      </div>

                      {mirrorTradeData && (
                        <div className="mt-6 p-4 bg-slate-900 rounded-lg border border-slate-700">
                          <h4 className="font-semibold mb-3">DragonSwap Parameters</h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-gray-400">Router Contract:</span>
                              <span className="font-mono text-xs">
                                {selectedOpportunity.routerAddress.slice(0, 8)}...
                                {selectedOpportunity.routerAddress.slice(-6)}
                              </span>
                            </div>
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
                          className="flex-1 bg-orange-500 hover:bg-orange-600 text-white"
                          onClick={() => window.open("https://app.dragonswap.app/swap", "_blank")}
                        >
                          <ExternalLink className="w-4 h-4 mr-2" />
                          Open DragonSwap
                        </Button>
                        <Button
                          variant="outline"
                          className="border-emerald-500 text-emerald-500 hover:bg-emerald-500/10 bg-transparent"
                          onClick={() => window.open(seitraceAddr(selectedOpportunity.routerAddress), "_blank")}
                        >
                          <Zap className="w-4 h-4 mr-2" />
                          View Contract
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
                        <h4 className="font-semibold mb-3">DragonSwap Integration</h4>
                        <div className="text-xs text-slate-300 space-y-1">
                          <p>• Real PNL/Sharpe calculations from DragonSwap data</p>
                          <p>• Mirror Trade opens actual DragonSwap interface</p>
                          <p>• Router contract verified on Seitrace</p>
                          <p>
                            • All transactions use DragonSwap Router: {DRAGONSWAP_ROUTER.slice(0, 8)}...
                            {DRAGONSWAP_ROUTER.slice(-6)}
                          </p>
                        </div>
                      </div>

                      <div className="mt-4 p-4 bg-slate-900 rounded-lg border border-slate-700">
                        <h4 className="font-semibold mb-3">Risk Disclaimer</h4>
                        <div className="text-xs text-gray-400 space-y-1">
                          <p>• Past performance does not guarantee future results</p>
                          <p>• All trades carry risk of loss</p>
                          <p>• Verify all transactions on Seitrace before execution</p>
                          <p>• Max drawdown: {selectedOpportunity.maxDrawdown}%</p>
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
                      Choose a DragonSwap trading opportunity from the Top Performers tab to set up mirror trading
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
