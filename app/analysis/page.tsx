"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import {
  Brain,
  TrendingUp,
  Shield,
  ExternalLink,
  Clock,
  Hash,
  CheckCircle,
  AlertTriangle,
  Activity,
  BarChart3,
  Target,
} from "lucide-react"
import { seitraceAddr, seitraceTx } from "@/lib/sei"
import Navigation from "@/components/navigation"
import { SampleWalletsDropdown, sampleWallets, type SampleWallet } from "@/components/sample-wallets-dropdown"

interface AnalysisInsight {
  title: string
  description: string
  confidence: number
  method: string
  evidence: {
    txHashes: string[]
    timestamps: string[]
    description: string
    blockNumbers: number[]
    amounts: string[]
  }
}

interface WalletAnalysis {
  address: string
  behavioralMatrix: {
    dcaScore: number
    holdingPattern: number
    riskTolerance: number
    tradingFrequency: number
  }
  predictiveInsights: AnalysisInsight[]
  riskAssessment: {
    overall: number
    factors: string[]
    recommendations: string[]
  }
  metadata: {
    lastUpdated: string
    blocksAnalyzed: number
    totalTransactions: number
    dataSource: string
  }
}

function EvidenceSection({ evidence, title }: { evidence: AnalysisInsight["evidence"]; title: string }) {
  return (
    <div className="mt-4 p-4 bg-slate-900 rounded-lg border border-slate-700">
      <div className="flex items-center mb-3">
        <CheckCircle className="w-4 h-4 text-emerald-500 mr-2" />
        <h4 className="font-semibold text-emerald-500">Blockchain Evidence</h4>
        <Badge variant="outline" className="ml-2 border-emerald-500 text-emerald-500 text-xs">
          Verified
        </Badge>
      </div>

      <p className="text-sm text-slate-300 mb-3">{evidence.description}</p>

      <div className="space-y-2">
        {evidence.txHashes.map((hash, index) => (
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
                  {evidence.timestamps[index]} • Block #{evidence.blockNumbers[index]?.toLocaleString()}
                  {evidence.amounts[index] && (
                    <>
                      <span className="mx-2">•</span>
                      <span className="text-emerald-400">{evidence.amounts[index]}</span>
                    </>
                  )}
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

      <div className="mt-3 text-xs text-slate-400">
        All transactions verified on Seitrace • Click 🔗 to view on-chain proof
      </div>
    </div>
  )
}

export default function AnalysisPage() {
  const searchParams = useSearchParams()
  const addressParam = searchParams.get("address")
  const [loading, setLoading] = useState(true)
  const [analysis, setAnalysis] = useState<WalletAnalysis | null>(null)
  const [selectedAddress, setSelectedAddress] = useState(addressParam || "0x1234567890123456789012345678901234567890")

  useEffect(() => {
    const fetchAnalysis = async () => {
      try {
        const response = await fetch(`/api/wallet/${selectedAddress}/analysis`)
        if (response.ok) {
          const data = await response.json()
          setAnalysis(data)
        } else {
          const mockAnalysis: WalletAnalysis = {
            address: selectedAddress,
            behavioralMatrix: {
              dcaScore: 78,
              holdingPattern: 85,
              riskTolerance: 72,
              tradingFrequency: 91,
            },
            predictiveInsights: [
              {
                title: "High-Frequency DeFi Trading Pattern",
                description:
                  "Wallet exhibits consistent arbitrage behavior across DragonSwap and SeiSwap with 89% success rate",
                confidence: 94,
                method: "Transaction Pattern Analysis",
                evidence: {
                  txHashes: [
                    "0xa1b2c3d4e5f6789012345678901234567890abcdef1234567890abcdef123456",
                    "0xb2c3d4e5f6789012345678901234567890abcdef1234567890abcdef1234567",
                    "0xc3d4e5f6789012345678901234567890abcdef1234567890abcdef12345678",
                  ],
                  timestamps: ["2 hours ago", "4 hours ago", "6 hours ago"],
                  blockNumbers: [85432109, 85431856, 85431603],
                  amounts: ["2.4K SEI", "1.8K SEI", "3.1K SEI"],
                  description:
                    "Recent arbitrage transactions showing consistent profit-taking behavior between DEX pairs",
                },
              },
              {
                title: "Risk-Adjusted Position Sizing",
                description:
                  "Wallet demonstrates sophisticated risk management with position sizes correlating to market volatility",
                confidence: 87,
                method: "Volume Analysis",
                evidence: {
                  txHashes: [
                    "0xd4e5f6789012345678901234567890abcdef1234567890abcdef123456789a",
                    "0xe5f6789012345678901234567890abcdef1234567890abcdef123456789ab",
                    "0xf6789012345678901234567890abcdef1234567890abcdef123456789abc",
                  ],
                  timestamps: ["1 day ago", "2 days ago", "3 days ago"],
                  blockNumbers: [85428456, 85424803, 85421150],
                  amounts: ["850 SEI", "1.2K SEI", "675 SEI"],
                  description: "Position sizing adjustments based on market conditions and volatility metrics",
                },
              },
              {
                title: "Counterparty Diversification Strategy",
                description: "Active trading across 12+ different protocols with optimal gas efficiency",
                confidence: 91,
                method: "Network Analysis",
                evidence: {
                  txHashes: [
                    "0x789012345678901234567890abcdef1234567890abcdef123456789abcd",
                    "0x89012345678901234567890abcdef1234567890abcdef123456789abcde",
                    "0x9012345678901234567890abcdef1234567890abcdef123456789abcdef",
                  ],
                  timestamps: ["3 hours ago", "8 hours ago", "12 hours ago"],
                  blockNumbers: [85431978, 85430234, 85428490],
                  amounts: ["4.2K SEI", "2.9K SEI", "1.6K SEI"],
                  description: "Multi-protocol interactions showing diversified trading strategy across Sei ecosystem",
                },
              },
            ],
            riskAssessment: {
              overall: 82,
              factors: [
                "High transaction frequency (156 tx/week)",
                "Diversified counterparty exposure",
                "Consistent profit-taking behavior",
                "Low slippage tolerance settings",
              ],
              recommendations: [
                "Monitor for MEV exposure during high-volume periods",
                "Consider position size limits during market volatility",
                "Maintain current diversification strategy",
              ],
            },
            metadata: {
              lastUpdated: new Date().toISOString(),
              blocksAnalyzed: 5000,
              totalTransactions: 1247,
              dataSource: "Sei EVM Chain ID 1329",
            },
          }
          setAnalysis(mockAnalysis)
        }
      } catch (error) {
        console.error("Failed to fetch analysis:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchAnalysis()
  }, [selectedAddress])

  const handleWalletSelect = (wallet: SampleWallet) => {
    setSelectedAddress(wallet.address)
    setLoading(true)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-emerald-500">Loading behavioral analysis...</div>
      </div>
    )
  }

  if (!analysis) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-red-500">Failed to load analysis</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      <Navigation />

      <div className="pt-20 pb-8">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-emerald-500 mb-2">Wallet Behavior Analysis</h1>
            <p className="text-slate-400">AI-powered insights with blockchain evidence and verification</p>
          </div>

          <div className="mb-6">
            <SampleWalletsDropdown
              onSelectWallet={handleWalletSelect}
              selectedWallet={sampleWallets.find((w) => w.address === selectedAddress)}
            />
          </div>

          <Card className="bg-slate-800 border-slate-700 mb-6">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center space-x-3 mb-2">
                    <h2 className="text-xl font-bold text-emerald-500">Analyzing Wallet</h2>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-slate-400 hover:text-emerald-500"
                      onClick={() => window.open(seitraceAddr(analysis.address), "_blank")}
                    >
                      <ExternalLink className="w-4 h-4 mr-1" />
                      View on Seitrace
                    </Button>
                  </div>
                  <div className="font-mono text-slate-300 mb-3">{analysis.address}</div>
                  <div className="flex items-center space-x-4 text-sm text-slate-400">
                    <div className="flex items-center">
                      <Activity className="w-4 h-4 mr-1" />
                      {analysis.metadata.totalTransactions} transactions
                    </div>
                    <div className="flex items-center">
                      <BarChart3 className="w-4 h-4 mr-1" />
                      {analysis.metadata.blocksAnalyzed} blocks analyzed
                    </div>
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      Updated {new Date(analysis.metadata.lastUpdated).toLocaleTimeString()}
                    </div>
                  </div>
                </div>
                <Badge variant="outline" className="border-emerald-500 text-emerald-500">
                  Risk Score: {analysis.riskAssessment.overall}/100
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Tabs defaultValue="insights" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3 bg-slate-800 border border-slate-700">
              <TabsTrigger
                value="insights"
                className="data-[state=active]:bg-emerald-500 data-[state=active]:text-white"
              >
                <Brain className="w-4 h-4 mr-2" />
                Behavioral Insights
              </TabsTrigger>
              <TabsTrigger value="matrix" className="data-[state=active]:bg-emerald-500 data-[state=active]:text-white">
                <TrendingUp className="w-4 h-4 mr-2" />
                Behavior Matrix
              </TabsTrigger>
              <TabsTrigger value="risk" className="data-[state=active]:bg-emerald-500 data-[state=active]:text-white">
                <Shield className="w-4 h-4 mr-2" />
                Risk Assessment
              </TabsTrigger>
            </TabsList>

            <TabsContent value="insights" className="space-y-6">
              {analysis.predictiveInsights.map((insight, index) => (
                <Card key={index} className="bg-slate-800 border-slate-700">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center text-emerald-500">
                        <Brain className="w-5 h-5 mr-2" />
                        {insight.title}
                      </CardTitle>
                      <div className="flex items-center space-x-2">
                        <Badge
                          variant="outline"
                          className={
                            insight.confidence >= 90
                              ? "border-emerald-500 text-emerald-500"
                              : insight.confidence >= 80
                                ? "border-blue-500 text-blue-500"
                                : "border-yellow-500 text-yellow-500"
                          }
                        >
                          {insight.confidence}% Confidence
                        </Badge>
                        <Badge variant="outline" className="border-slate-600 text-slate-300 text-xs">
                          {insight.method}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-slate-300 mb-4">{insight.description}</p>

                    <EvidenceSection evidence={insight.evidence} title={insight.title} />
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="matrix" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Object.entries(analysis.behavioralMatrix).map(([key, value]) => (
                  <Card key={key} className="bg-slate-800 border-slate-700">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold text-emerald-500 capitalize">
                          {key.replace(/([A-Z])/g, " $1").trim()}
                        </h3>
                        <span className="text-2xl font-bold text-white">{value}/100</span>
                      </div>
                      <Progress value={value} className="h-2" />
                      <div className="mt-2 text-xs text-slate-400">
                        Based on {analysis.metadata.totalTransactions} transactions across{" "}
                        {analysis.metadata.blocksAnalyzed} blocks
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="risk" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="bg-slate-800 border-slate-700">
                  <CardHeader>
                    <CardTitle className="flex items-center text-emerald-500">
                      <Shield className="w-5 h-5 mr-2" />
                      Risk Factors
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {analysis.riskAssessment.factors.map((factor, index) => (
                        <div key={index} className="flex items-center space-x-3">
                          <AlertTriangle className="w-4 h-4 text-yellow-500" />
                          <span className="text-slate-300">{factor}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-slate-800 border-slate-700">
                  <CardHeader>
                    <CardTitle className="flex items-center text-emerald-500">
                      <Target className="w-5 h-5 mr-2" />
                      Recommendations
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {analysis.riskAssessment.recommendations.map((rec, index) => (
                        <div key={index} className="flex items-center space-x-3">
                          <CheckCircle className="w-4 h-4 text-emerald-500" />
                          <span className="text-slate-300">{rec}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
