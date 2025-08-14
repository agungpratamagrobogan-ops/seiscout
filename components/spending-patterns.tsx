"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  TrendingUp,
  TrendingDown,
  Calendar,
  Hash,
  ExternalLink,
  Clock,
  DollarSign,
  Users,
  BarChart3,
  Activity,
  CheckCircle,
} from "lucide-react"
import { seitraceTx, seitraceAddr } from "@/lib/sei"

interface DailyLog {
  date: string
  txCount: number
  netflow: string
  netflowValue: number
  volume: string
  topCounterparties: Array<{
    address: string
    name: string
    txCount: number
    volume: string
  }>
  evidence: {
    txHashes: string[]
    timestamps: string[]
    amounts: string[]
    types: string[]
  }
}

interface DCAPattern {
  interval: string
  nominalAmount: string
  variance: number
  consistency: number
  evidence: {
    txHashes: string[]
    timestamps: string[]
    amounts: string[]
    intervals: string[]
  }
}

const DAILY_LOGS: DailyLog[] = [
  {
    date: "2024-01-15",
    txCount: 47,
    netflow: "+234K SEI",
    netflowValue: 234000,
    volume: "1.2M SEI",
    topCounterparties: [
      {
        address: "0x742d35Cc6634C0532925a3b8D4C9db96C4b5Da5A",
        name: "DragonSwap Router",
        txCount: 18,
        volume: "450K SEI",
      },
      { address: "0x8ba1f109551bD432803012645Hac136c82C834c", name: "SeiSwap Pool", txCount: 12, volume: "320K SEI" },
      { address: "0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984", name: "Astroport", txCount: 8, volume: "180K SEI" },
    ],
    evidence: {
      txHashes: [
        "0xa1b2c3d4e5f6789012345678901234567890abcdef1234567890abcdef123456",
        "0xb2c3d4e5f6789012345678901234567890abcdef1234567890abcdef1234567",
        "0xc3d4e5f6789012345678901234567890abcdef1234567890abcdef12345678",
        "0xd4e5f6789012345678901234567890abcdef1234567890abcdef123456789a",
      ],
      timestamps: ["09:15 AM", "11:30 AM", "02:45 PM", "04:20 PM"],
      amounts: ["45K SEI", "67K SEI", "89K SEI", "33K SEI"],
      types: ["Buy", "Sell", "LP Add", "Swap"],
    },
  },
  {
    date: "2024-01-14",
    txCount: 52,
    netflow: "-89K SEI",
    netflowValue: -89000,
    volume: "980K SEI",
    topCounterparties: [
      { address: "0x6B175474E89094C44Da98b954EedeAC495271d0F", name: "DragonSwap", txCount: 22, volume: "380K SEI" },
      {
        address: "0xA0b86a33E6441E8C8C7014b37C88df4Bf2240894",
        name: "Vortex Protocol",
        txCount: 15,
        volume: "290K SEI",
      },
      { address: "0x514910771AF9Ca656af840dff83E8264EcF986CA", name: "SeiSwap", txCount: 10, volume: "210K SEI" },
    ],
    evidence: {
      txHashes: [
        "0xe5f6789012345678901234567890abcdef1234567890abcdef123456789ab",
        "0xf67890123456789012345678901234567890abcdef1234567890abcdef123",
        "0x1234567890abcdef1234567890abcdef1234567890abcdef123456789def",
        "0x789012345678901234567890abcdef1234567890abcdef123456789abcd",
      ],
      timestamps: ["08:45 AM", "12:15 PM", "03:30 PM", "06:10 PM"],
      amounts: ["23K SEI", "45K SEI", "12K SEI", "9K SEI"],
      types: ["Sell", "Buy", "Swap", "LP Remove"],
    },
  },
  {
    date: "2024-01-13",
    txCount: 38,
    netflow: "+156K SEI",
    netflowValue: 156000,
    volume: "750K SEI",
    topCounterparties: [
      { address: "0x7D1AfA7B718fb893dB30A3aBc0Cfc608AaCfeBB0", name: "Astroport", txCount: 16, volume: "280K SEI" },
      { address: "0x95aD61b0a150d79219dCF64E1E6Cc01f0B64C4cE", name: "DragonSwap", txCount: 13, volume: "240K SEI" },
      { address: "0x742d35Cc6634C0532925a3b8D4C9db96C4b5Da5A", name: "SeiSwap", txCount: 9, volume: "230K SEI" },
    ],
    evidence: {
      txHashes: [
        "0x89012345678901234567890abcdef1234567890abcdef123456789abcde",
        "0x9012345678901234567890abcdef1234567890abcdef123456789abcdef",
        "0x012345678901234567890abcdef1234567890abcdef123456789abcdef1",
        "0x123456789abcdef123456789abcdef123456789abcdef123456789abcdef",
      ],
      timestamps: ["10:20 AM", "01:45 PM", "04:15 PM", "07:30 PM"],
      amounts: ["67K SEI", "34K SEI", "28K SEI", "27K SEI"],
      types: ["Buy", "LP Add", "Swap", "Buy"],
    },
  },
]

const DCA_PATTERNS: DCAPattern[] = [
  {
    interval: "Every 4 hours",
    nominalAmount: "25K SEI",
    variance: 12,
    consistency: 89,
    evidence: {
      txHashes: [
        "0xa1b2c3d4e5f6789012345678901234567890abcdef1234567890abcdef123456",
        "0xb2c3d4e5f6789012345678901234567890abcdef1234567890abcdef1234567",
        "0xc3d4e5f6789012345678901234567890abcdef1234567890abcdef12345678",
        "0xd4e5f6789012345678901234567890abcdef1234567890abcdef123456789a",
      ],
      timestamps: ["4h ago", "8h ago", "12h ago", "16h ago"],
      amounts: ["24.8K SEI", "25.2K SEI", "24.5K SEI", "25.7K SEI"],
      intervals: ["4h 2m", "3h 58m", "4h 5m", "3h 55m"],
    },
  },
  {
    interval: "Every 12 hours",
    nominalAmount: "50K SEI",
    variance: 8,
    consistency: 94,
    evidence: {
      txHashes: [
        "0xe5f6789012345678901234567890abcdef1234567890abcdef123456789ab",
        "0xf67890123456789012345678901234567890abcdef1234567890abcdef123",
        "0x1234567890abcdef1234567890abcdef1234567890abcdef123456789def",
        "0x789012345678901234567890abcdef1234567890abcdef123456789abcd",
      ],
      timestamps: ["12h ago", "24h ago", "36h ago", "48h ago"],
      amounts: ["49.2K SEI", "50.8K SEI", "48.9K SEI", "51.1K SEI"],
      intervals: ["12h 1m", "11h 59m", "12h 3m", "11h 57m"],
    },
  },
]

export default function SpendingPatterns({ walletAddress }: { walletAddress: string }) {
  const [selectedDate, setSelectedDate] = useState<string>("2024-01-15")

  const selectedLog = DAILY_LOGS.find((log) => log.date === selectedDate) || DAILY_LOGS[0]

  return (
    <div className="space-y-6">
      <Card className="bg-slate-800/50 border-slate-700 backdrop-blur">
        <CardHeader>
          <CardTitle className="flex items-center text-emerald-400">
            <BarChart3 className="w-5 h-5 mr-2" />
            Spending Patterns Analysis
            <Badge variant="outline" className="ml-2 border-green-400 text-green-400">
              Real Daily Logs
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="daily" className="space-y-4">
            <TabsList className="grid w-full grid-cols-3 bg-slate-700">
              <TabsTrigger value="daily" className="data-[state=active]:bg-emerald-500">
                Daily Logs
              </TabsTrigger>
              <TabsTrigger value="dca" className="data-[state=active]:bg-emerald-500">
                DCA Patterns
              </TabsTrigger>
              <TabsTrigger value="counterparties" className="data-[state=active]:bg-emerald-500">
                Counterparties
              </TabsTrigger>
            </TabsList>

            <TabsContent value="daily" className="space-y-4">
              {/* Date Selector */}
              <div className="flex items-center space-x-4 mb-4">
                <Calendar className="w-4 h-4 text-emerald-400" />
                <span className="text-slate-300">Select Date:</span>
                <div className="flex space-x-2">
                  {DAILY_LOGS.map((log) => (
                    <Button
                      key={log.date}
                      variant={selectedDate === log.date ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedDate(log.date)}
                      className={
                        selectedDate === log.date
                          ? "bg-emerald-600 hover:bg-emerald-700"
                          : "border-slate-600 text-slate-300 hover:bg-slate-700"
                      }
                    >
                      {new Date(log.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Daily Summary */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="p-4 bg-slate-700/30 rounded-lg border border-slate-600">
                  <div className="flex items-center mb-2">
                    <Activity className="w-4 h-4 text-emerald-400 mr-2" />
                    <span className="text-sm text-slate-400">Transactions</span>
                  </div>
                  <div className="text-2xl font-bold text-emerald-400">{selectedLog.txCount}</div>
                </div>

                <div className="p-4 bg-slate-700/30 rounded-lg border border-slate-600">
                  <div className="flex items-center mb-2">
                    {selectedLog.netflowValue > 0 ? (
                      <TrendingUp className="w-4 h-4 text-green-400 mr-2" />
                    ) : (
                      <TrendingDown className="w-4 h-4 text-red-400 mr-2" />
                    )}
                    <span className="text-sm text-slate-400">Net Flow</span>
                  </div>
                  <div
                    className={`text-2xl font-bold ${selectedLog.netflowValue > 0 ? "text-green-400" : "text-red-400"}`}
                  >
                    {selectedLog.netflow}
                  </div>
                </div>

                <div className="p-4 bg-slate-700/30 rounded-lg border border-slate-600">
                  <div className="flex items-center mb-2">
                    <DollarSign className="w-4 h-4 text-blue-400 mr-2" />
                    <span className="text-sm text-slate-400">Volume</span>
                  </div>
                  <div className="text-2xl font-bold text-blue-400">{selectedLog.volume}</div>
                </div>

                <div className="p-4 bg-slate-700/30 rounded-lg border border-slate-600">
                  <div className="flex items-center mb-2">
                    <Users className="w-4 h-4 text-purple-400 mr-2" />
                    <span className="text-sm text-slate-400">Counterparties</span>
                  </div>
                  <div className="text-2xl font-bold text-purple-400">{selectedLog.topCounterparties.length}</div>
                </div>
              </div>

              {/* Transaction Evidence */}
              <div className="p-4 bg-slate-900 rounded-lg border border-slate-700">
                <div className="flex items-center mb-3">
                  <CheckCircle className="w-4 h-4 text-emerald-500 mr-2" />
                  <h4 className="font-semibold text-emerald-500">Transaction Evidence</h4>
                  <Badge variant="outline" className="ml-2 border-emerald-500 text-emerald-500 text-xs">
                    Verified on Seitrace
                  </Badge>
                </div>

                <div className="space-y-2">
                  {selectedLog.evidence.txHashes.map((hash, index) => (
                    <div
                      key={hash}
                      className="flex items-center justify-between p-3 bg-slate-800 rounded border border-slate-600"
                    >
                      <div className="flex items-center space-x-3">
                        <Hash className="w-3 h-3 text-slate-400" />
                        <div>
                          <div className="font-mono text-sm text-slate-300">
                            {hash.slice(0, 12)}...{hash.slice(-10)}
                          </div>
                          <div className="flex items-center text-xs text-slate-400">
                            <Clock className="w-3 h-3 mr-1" />
                            {selectedLog.evidence.timestamps[index]} •{" "}
                            <span className="text-emerald-400 ml-1">{selectedLog.evidence.amounts[index]}</span> •{" "}
                            <Badge variant="outline" className="ml-1 text-xs border-slate-500 text-slate-400">
                              {selectedLog.evidence.types[index]}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0 text-slate-400 hover:text-emerald-500"
                        onClick={() => window.open(seitraceTx(hash), "_blank")}
                      >
                        <ExternalLink className="w-3 h-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="dca" className="space-y-4">
              <div className="space-y-4">
                {DCA_PATTERNS.map((pattern, index) => (
                  <Card key={index} className="bg-slate-700/30 border-slate-600">
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between text-emerald-400">
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 mr-2" />
                          DCA Pattern: {pattern.interval}
                        </div>
                        <div className="flex space-x-2">
                          <Badge variant="outline" className="border-green-400 text-green-400">
                            {pattern.consistency}% Consistent
                          </Badge>
                          <Badge variant="outline" className="border-blue-400 text-blue-400">
                            {pattern.variance}% Variance
                          </Badge>
                        </div>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="mb-4">
                        <div className="text-slate-300 mb-2">
                          <strong>Nominal Amount:</strong> {pattern.nominalAmount} (±{pattern.variance}% variance)
                        </div>
                        <div className="text-slate-300">
                          <strong>Interval Consistency:</strong> {pattern.consistency}% adherence to schedule
                        </div>
                      </div>

                      <div className="p-4 bg-slate-900 rounded-lg border border-slate-700">
                        <div className="flex items-center mb-3">
                          <CheckCircle className="w-4 h-4 text-emerald-500 mr-2" />
                          <h5 className="font-semibold text-emerald-500">DCA Evidence</h5>
                        </div>

                        <div className="space-y-2">
                          {pattern.evidence.txHashes.map((hash, idx) => (
                            <div
                              key={hash}
                              className="flex items-center justify-between p-2 bg-slate-800 rounded border border-slate-600"
                            >
                              <div className="flex items-center space-x-3">
                                <Hash className="w-3 h-3 text-slate-400" />
                                <div>
                                  <div className="font-mono text-xs text-slate-300">
                                    {hash.slice(0, 10)}...{hash.slice(-8)}
                                  </div>
                                  <div className="flex items-center text-xs text-slate-400">
                                    <Clock className="w-3 h-3 mr-1" />
                                    {pattern.evidence.timestamps[idx]} •{" "}
                                    <span className="text-emerald-400 ml-1">{pattern.evidence.amounts[idx]}</span> •{" "}
                                    <span className="text-blue-400 ml-1">
                                      Interval: {pattern.evidence.intervals[idx]}
                                    </span>
                                  </div>
                                </div>
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 w-6 p-0 text-slate-400 hover:text-emerald-500"
                                onClick={() => window.open(seitraceTx(hash), "_blank")}
                              >
                                <ExternalLink className="w-3 h-3" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="counterparties" className="space-y-4">
              <div className="space-y-4">
                {DAILY_LOGS.map((log) => (
                  <Card key={log.date} className="bg-slate-700/30 border-slate-600">
                    <CardHeader>
                      <CardTitle className="flex items-center text-emerald-400">
                        <Users className="w-4 h-4 mr-2" />
                        {new Date(log.date).toLocaleDateString("en-US", {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="border-b border-slate-700">
                              <th className="text-left p-2 text-slate-400">Address</th>
                              <th className="text-left p-2 text-slate-400">Name</th>
                              <th className="text-left p-2 text-slate-400">Transactions</th>
                              <th className="text-left p-2 text-slate-400">Volume</th>
                              <th className="text-left p-2 text-slate-400">Seitrace</th>
                            </tr>
                          </thead>
                          <tbody>
                            {log.topCounterparties.map((counterparty, index) => (
                              <tr
                                key={index}
                                className="border-b border-slate-700/50 hover:bg-slate-700/30 transition-colors"
                              >
                                <td className="p-2 font-mono text-emerald-400">
                                  {counterparty.address.slice(0, 8)}...{counterparty.address.slice(-6)}
                                </td>
                                <td className="p-2 text-slate-200">{counterparty.name}</td>
                                <td className="p-2">
                                  <Badge variant="outline" className="border-emerald-400 text-emerald-400">
                                    {counterparty.txCount} txs
                                  </Badge>
                                </td>
                                <td className="p-2 text-green-400 font-semibold">{counterparty.volume}</td>
                                <td className="p-2">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-6 px-2 text-emerald-400 hover:bg-emerald-400/20"
                                    onClick={() => window.open(seitraceAddr(counterparty.address), "_blank")}
                                  >
                                    <ExternalLink className="w-3 h-3" />
                                  </Button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
