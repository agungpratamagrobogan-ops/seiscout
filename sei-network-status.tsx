"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Network, Activity, DollarSign, Zap, Wallet, ExternalLink } from "lucide-react"

export default function SeiNetworkStatus() {
  const [networkData, setNetworkData] = useState({
    seiPrice: 0.847,
    blockHeight: 4567890,
    tps: 1247,
    validators: 125,
    stakingApr: 15.8,
    totalStaked: "68.5%",
  })

  const defiProtocols = [
    { name: "Astroport DEX", tvl: "$45.2M", status: "Active" },
    { name: "White Whale", tvl: "$23.8M", status: "Active" },
    { name: "Levana Protocol", tvl: "$18.5M", status: "Active" },
    { name: "Kujira", tvl: "$12.3M", status: "Active" },
  ]

  const walletOptions = [
    { name: "Compass", status: "Available", icon: "🧭" },
    { name: "Keplr", status: "Available", icon: "🔑" },
    { name: "Leap", status: "Available", icon: "🦘" },
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setNetworkData((prev) => ({
        ...prev,
        seiPrice: prev.seiPrice + (Math.random() - 0.5) * 0.01,
        blockHeight: prev.blockHeight + Math.floor(Math.random() * 3) + 1,
        tps: prev.tps + Math.floor(Math.random() * 100) - 50,
      }))
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  return (
    <Card className="bg-[#1A202C] border-[#2D3748]">
      <CardHeader>
        <CardTitle className="flex items-center text-[#22D3EE]">
          <Network className="w-5 h-5 mr-2" />
          Sei Network Status
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Network Metrics */}
        <div className="grid grid-cols-2 gap-4">
          <div className="p-3 bg-[#0C101A] rounded-lg border border-[#2D3748]">
            <div className="flex items-center space-x-2 mb-1">
              <DollarSign className="w-4 h-4 text-[#22D3EE]" />
              <span className="text-sm text-gray-400">SEI Price</span>
            </div>
            <div className="text-lg font-bold text-[#22D3EE]">${networkData.seiPrice.toFixed(3)}</div>
          </div>
          <div className="p-3 bg-[#0C101A] rounded-lg border border-[#2D3748]">
            <div className="flex items-center space-x-2 mb-1">
              <Activity className="w-4 h-4 text-[#22D3EE]" />
              <span className="text-sm text-gray-400">Block Height</span>
            </div>
            <div className="text-lg font-bold text-[#22D3EE]">{networkData.blockHeight.toLocaleString()}</div>
          </div>
          <div className="p-3 bg-[#0C101A] rounded-lg border border-[#2D3748]">
            <div className="flex items-center space-x-2 mb-1">
              <Zap className="w-4 h-4 text-[#22D3EE]" />
              <span className="text-sm text-gray-400">TPS</span>
            </div>
            <div className="text-lg font-bold text-[#22D3EE]">{networkData.tps.toLocaleString()}</div>
          </div>
          <div className="p-3 bg-[#0C101A] rounded-lg border border-[#2D3748]">
            <div className="flex items-center space-x-2 mb-1">
              <Network className="w-4 h-4 text-[#22D3EE]" />
              <span className="text-sm text-gray-400">Validators</span>
            </div>
            <div className="text-lg font-bold text-[#22D3EE]">{networkData.validators}</div>
          </div>
        </div>

        {/* Staking Info */}
        <div className="p-4 bg-[#0C101A] rounded-lg border border-[#2D3748]">
          <div className="flex items-center justify-between mb-3">
            <span className="font-semibold">Staking Rewards</span>
            <Badge variant="outline" className="border-green-500 text-green-500">
              {networkData.stakingApr}% APR
            </Badge>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Total Staked</span>
              <span className="text-[#22D3EE]">{networkData.totalStaked}</span>
            </div>
            <Progress value={68.5} className="h-2" />
          </div>
        </div>

        {/* DeFi Ecosystem */}
        <div>
          <h4 className="font-semibold mb-3 flex items-center">
            <DollarSign className="w-4 h-4 mr-2 text-[#22D3EE]" />
            Sei DeFi Ecosystem
          </h4>
          <div className="space-y-2">
            {defiProtocols.map((protocol, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-2 bg-[#0C101A] rounded border border-[#2D3748]"
              >
                <div>
                  <div className="text-sm font-medium">{protocol.name}</div>
                  <div className="text-xs text-gray-400">TVL: {protocol.tvl}</div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant="outline" className="border-green-500 text-green-500 text-xs">
                    {protocol.status}
                  </Badge>
                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                    <ExternalLink className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Wallet Integration */}
        <div>
          <h4 className="font-semibold mb-3 flex items-center">
            <Wallet className="w-4 h-4 mr-2 text-[#22D3EE]" />
            Wallet Integration
          </h4>
          <div className="space-y-2">
            {walletOptions.map((wallet, index) => (
              <Button
                key={index}
                variant="outline"
                className="w-full justify-between border-[#2D3748] text-[#F7FAFC] hover:bg-[#2D3748] bg-transparent"
              >
                <div className="flex items-center space-x-2">
                  <span>{wallet.icon}</span>
                  <span>{wallet.name}</span>
                </div>
                <Badge variant="outline" className="border-green-500 text-green-500 text-xs">
                  {wallet.status}
                </Badge>
              </Button>
            ))}
          </div>
        </div>

        {/* Block Explorer Link */}
        <Button className="w-full bg-[#22D3EE] hover:bg-[#22D3EE]/90 text-[#0C101A]">
          <ExternalLink className="w-4 h-4 mr-2" />
          Open Sei Block Explorer
        </Button>
      </CardContent>
    </Card>
  )
}
