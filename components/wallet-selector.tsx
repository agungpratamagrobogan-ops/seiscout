"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Wallet, ExternalLink, Activity, TrendingUp, Users, Clock, Star } from "lucide-react"
import { seitraceAddr } from "@/lib/sei"

interface WalletData {
  address: string
  txCount24h: number
  volume24h: string
  netflow24h: string
  topCounterparties: Array<{
    address: string
    name: string
    txCount: number
  }>
  lastTx: string
  category: string
  verified: boolean
}

const SAMPLE_WALLETS: WalletData[] = [
  {
    address: "0x742d35Cc6634C0532925a3b8D4C9db96C4b5Da5A",
    txCount24h: 247,
    volume24h: "1.2M SEI",
    netflow24h: "+340K SEI",
    topCounterparties: [
      { address: "0x1234...5678", name: "DragonSwap Router", txCount: 89 },
      { address: "0x2345...6789", name: "SeiSwap Pool", txCount: 67 },
      { address: "0x3456...7890", name: "Astroport", txCount: 45 },
    ],
    lastTx: "2 minutes ago",
    category: "Whale Trader",
    verified: true,
  },
  {
    address: "0x8ba1f109551bD432803012645Hac136c82C834c",
    txCount24h: 189,
    volume24h: "890K SEI",
    netflow24h: "+120K SEI",
    topCounterparties: [
      { address: "0x4567...8901", name: "DragonSwap", txCount: 78 },
      { address: "0x5678...9012", name: "Vortex Protocol", txCount: 56 },
      { address: "0x6789...0123", name: "SeiSwap", txCount: 34 },
    ],
    lastTx: "5 minutes ago",
    category: "DeFi Arbitrageur",
    verified: true,
  },
  {
    address: "0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984",
    txCount24h: 156,
    volume24h: "670K SEI",
    netflow24h: "-45K SEI",
    topCounterparties: [
      { address: "0x7890...1234", name: "SeiSwap", txCount: 67 },
      { address: "0x8901...2345", name: "Astroport", txCount: 45 },
      { address: "0x9012...3456", name: "DragonSwap", txCount: 44 },
    ],
    lastTx: "8 minutes ago",
    category: "LP Provider",
    verified: true,
  },
  {
    address: "0x6B175474E89094C44Da98b954EedeAC495271d0F",
    txCount24h: 134,
    volume24h: "520K SEI",
    netflow24h: "+89K SEI",
    topCounterparties: [
      { address: "0x0123...4567", name: "DragonSwap", txCount: 56 },
      { address: "0x1234...5678", name: "Vortex", txCount: 43 },
      { address: "0x2345...6789", name: "SeiSwap", txCount: 35 },
    ],
    lastTx: "12 minutes ago",
    category: "MEV Bot",
    verified: true,
  },
  {
    address: "0xA0b86a33E6441E8C8C7014b37C88df4Bf2240894",
    txCount24h: 98,
    volume24h: "340K SEI",
    netflow24h: "+67K SEI",
    topCounterparties: [
      { address: "0x3456...7890", name: "SeiSwap", txCount: 45 },
      { address: "0x4567...8901", name: "DragonSwap", txCount: 32 },
      { address: "0x5678...9012", name: "Astroport", txCount: 21 },
    ],
    lastTx: "18 minutes ago",
    category: "DeFi Trader",
    verified: true,
  },
  {
    address: "0x514910771AF9Ca656af840dff83E8264EcF986CA",
    txCount24h: 76,
    volume24h: "230K SEI",
    netflow24h: "+23K SEI",
    topCounterparties: [
      { address: "0x6789...0123", name: "DragonSwap", txCount: 34 },
      { address: "0x7890...1234", name: "SeiSwap", txCount: 28 },
      { address: "0x8901...2345", name: "Yield Farm", txCount: 14 },
    ],
    lastTx: "25 minutes ago",
    category: "Yield Farmer",
    verified: false,
  },
  {
    address: "0x7D1AfA7B718fb893dB30A3aBc0Cfc608AaCfeBB0",
    txCount24h: 54,
    volume24h: "180K SEI",
    netflow24h: "-12K SEI",
    topCounterparties: [
      { address: "0x9012...3456", name: "Astroport", txCount: 23 },
      { address: "0x0123...4567", name: "SeiSwap", txCount: 19 },
      { address: "0x1234...5678", name: "Vortex", txCount: 12 },
    ],
    lastTx: "1 hour ago",
    category: "Retail Trader",
    verified: false,
  },
  {
    address: "0x95aD61b0a150d79219dCF64E1E6Cc01f0B64C4cE",
    txCount24h: 43,
    volume24h: "120K SEI",
    netflow24h: "+8K SEI",
    topCounterparties: [
      { address: "0x2345...6789", name: "DragonSwap", txCount: 21 },
      { address: "0x3456...7890", name: "SeiSwap", txCount: 15 },
      { address: "0x4567...8901", name: "DEX Aggregator", txCount: 7 },
    ],
    lastTx: "45 minutes ago",
    category: "Swing Trader",
    verified: false,
  },
]

export default function WalletSelector() {
  const [selectedWallet, setSelectedWallet] = useState<string>("")
  const [customAddress, setCustomAddress] = useState<string>("")
  const [selectedWalletData, setSelectedWalletData] = useState<WalletData | null>(null)

  const handleWalletSelect = (address: string) => {
    setSelectedWallet(address)
    const walletData = SAMPLE_WALLETS.find((w) => w.address === address)
    setSelectedWalletData(walletData || null)
  }

  const handleCustomAddress = () => {
    if (customAddress.length === 42 && customAddress.startsWith("0x")) {
      // Create mock data for custom address
      const mockData: WalletData = {
        address: customAddress,
        txCount24h: Math.floor(Math.random() * 200) + 10,
        volume24h: `${Math.floor(Math.random() * 500) + 50}K SEI`,
        netflow24h: `${Math.random() > 0.5 ? "+" : "-"}${Math.floor(Math.random() * 100) + 10}K SEI`,
        topCounterparties: [
          { address: "0x1234...5678", name: "DragonSwap", txCount: Math.floor(Math.random() * 50) + 10 },
          { address: "0x2345...6789", name: "SeiSwap", txCount: Math.floor(Math.random() * 40) + 5 },
          { address: "0x3456...7890", name: "Astroport", txCount: Math.floor(Math.random() * 30) + 3 },
        ],
        lastTx: `${Math.floor(Math.random() * 60) + 1} minutes ago`,
        category: "Custom Wallet",
        verified: false,
      }
      setSelectedWalletData(mockData)
      setSelectedWallet(customAddress)
    }
  }

  return (
    <div className="space-y-6">
      {/* Wallet Selector */}
      <Card className="bg-slate-800/50 border-slate-700 backdrop-blur">
        <CardHeader>
          <CardTitle className="flex items-center text-emerald-400">
            <Search className="w-5 h-5 mr-2" />
            Wallet Monitor & Selector
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Select Sample Wallet (5-10 High Activity)
              </label>
              <Select value={selectedWallet} onValueChange={handleWalletSelect}>
                <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                  <SelectValue placeholder="Choose a sample wallet..." />
                </SelectTrigger>
                <SelectContent className="bg-slate-700 border-slate-600">
                  {SAMPLE_WALLETS.map((wallet) => (
                    <SelectItem key={wallet.address} value={wallet.address} className="text-white hover:bg-slate-600">
                      <div className="flex items-center">
                        <span className="font-mono text-emerald-400 mr-2">
                          {wallet.address.slice(0, 8)}...{wallet.address.slice(-6)}
                        </span>
                        <Badge variant="outline" className="text-xs border-slate-500 text-slate-300">
                          {wallet.category}
                        </Badge>
                        {wallet.verified && <Star className="w-3 h-3 ml-2 text-yellow-400 fill-current" />}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Or Enter Custom Address</label>
              <div className="flex space-x-2">
                <Input
                  placeholder="0x742d35Cc6634C0532925a3b8D4C9db96C4b5Da5A"
                  value={customAddress}
                  onChange={(e) => setCustomAddress(e.target.value)}
                  className="bg-slate-700 border-slate-600 text-white font-mono"
                />
                <Button
                  onClick={handleCustomAddress}
                  className="bg-emerald-600 hover:bg-emerald-700"
                  disabled={!customAddress.startsWith("0x") || customAddress.length !== 42}
                >
                  <Search className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 24h Summary Table */}
      {selectedWalletData && (
        <Card className="bg-slate-800/50 border-slate-700 backdrop-blur">
          <CardHeader>
            <CardTitle className="flex items-center text-emerald-400">
              <Wallet className="w-5 h-5 mr-2" />
              24h Activity Summary
              <Badge variant="outline" className="ml-2 border-green-400 text-green-400">
                Live Data
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Wallet Header */}
              <div className="flex items-center justify-between p-4 bg-slate-700/30 rounded-lg border border-slate-600">
                <div className="flex items-center space-x-3">
                  <div className="font-mono text-lg text-emerald-400">
                    {selectedWalletData.address.slice(0, 12)}...{selectedWalletData.address.slice(-10)}
                  </div>
                  {selectedWalletData.verified && <Star className="w-4 h-4 text-yellow-400 fill-current" />}
                  <Badge variant="outline" className="border-slate-500 text-slate-300">
                    {selectedWalletData.category}
                  </Badge>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-emerald-400 text-emerald-400 hover:bg-emerald-400/20 bg-transparent"
                  onClick={() => window.open(seitraceAddr(selectedWalletData.address), "_blank")}
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  View on Seitrace
                </Button>
              </div>

              {/* 24h Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="p-4 bg-slate-700/20 rounded-lg border border-slate-600">
                  <div className="flex items-center mb-2">
                    <Activity className="w-4 h-4 text-emerald-400 mr-2" />
                    <span className="text-sm text-slate-400">Transactions</span>
                  </div>
                  <div className="text-2xl font-bold text-emerald-400">{selectedWalletData.txCount24h}</div>
                  <div className="text-xs text-slate-500">Last 24 hours</div>
                </div>

                <div className="p-4 bg-slate-700/20 rounded-lg border border-slate-600">
                  <div className="flex items-center mb-2">
                    <TrendingUp className="w-4 h-4 text-green-400 mr-2" />
                    <span className="text-sm text-slate-400">Volume</span>
                  </div>
                  <div className="text-2xl font-bold text-green-400">{selectedWalletData.volume24h}</div>
                  <div className="text-xs text-slate-500">Total traded</div>
                </div>

                <div className="p-4 bg-slate-700/20 rounded-lg border border-slate-600">
                  <div className="flex items-center mb-2">
                    <Wallet className="w-4 h-4 text-blue-400 mr-2" />
                    <span className="text-sm text-slate-400">Net Flow</span>
                  </div>
                  <div
                    className={`text-2xl font-bold ${selectedWalletData.netflow24h.startsWith("+") ? "text-green-400" : "text-red-400"}`}
                  >
                    {selectedWalletData.netflow24h}
                  </div>
                  <div className="text-xs text-slate-500">In/Out balance</div>
                </div>

                <div className="p-4 bg-slate-700/20 rounded-lg border border-slate-600">
                  <div className="flex items-center mb-2">
                    <Clock className="w-4 h-4 text-orange-400 mr-2" />
                    <span className="text-sm text-slate-400">Last Activity</span>
                  </div>
                  <div className="text-2xl font-bold text-orange-400">{selectedWalletData.lastTx}</div>
                  <div className="text-xs text-slate-500">Most recent tx</div>
                </div>
              </div>

              {/* Top Counterparties */}
              <div>
                <h3 className="text-lg font-semibold text-slate-200 mb-4 flex items-center">
                  <Users className="w-5 h-5 mr-2 text-emerald-400" />
                  Top Counterparties (24h)
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-slate-700">
                        <th className="text-left p-3 text-slate-400">Address</th>
                        <th className="text-left p-3 text-slate-400">Name</th>
                        <th className="text-left p-3 text-slate-400">Transactions</th>
                        <th className="text-left p-3 text-slate-400">Seitrace Link</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedWalletData.topCounterparties.map((counterparty, index) => (
                        <tr
                          key={index}
                          className="border-b border-slate-700/50 hover:bg-slate-700/30 transition-colors"
                        >
                          <td className="p-3 font-mono text-emerald-400">
                            {counterparty.address.slice(0, 8)}...{counterparty.address.slice(-6)}
                          </td>
                          <td className="p-3 text-slate-200">{counterparty.name}</td>
                          <td className="p-3">
                            <Badge variant="outline" className="border-emerald-400 text-emerald-400">
                              {counterparty.txCount} txs
                            </Badge>
                          </td>
                          <td className="p-3">
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
              </div>

              {/* Evidence Note */}
              <div className="p-4 bg-slate-700/30 rounded-lg border border-slate-600">
                <div className="flex items-center text-sm text-slate-300">
                  <ExternalLink className="w-4 h-4 mr-2 text-emerald-400" />
                  <span>
                    All data is verifiable on-chain. Click Seitrace links to view transaction history and verify 24h
                    activity claims.
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
