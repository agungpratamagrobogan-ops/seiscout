"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Target } from "lucide-react"

export default function EnhancedInvestmentStrategy() {
  const portfolioComposition = [
    {
      token: "SEI",
      percentage: 60,
      amount: "508.3K SEI",
      value: "$430,284",
      change24h: "+5.2%",
      allocation: "Core Holding",
    },
    {
      token: "USDC",
      percentage: 25,
      amount: "212.0K USDC",
      value: "$212,000",
      change24h: "0%",
      allocation: "Stable Reserve",
    },
    {
      token: "ATOM",
      percentage: 10,
      amount: "8.5K ATOM",
      value: "$45,000",
      change24h: "+3.1%",
      allocation: "Cosmos Exposure",
    },
    {
      token: "Other Tokens",
      percentage: 5,
      amount: "Various",
      value: "$30,000",
      change24h: "+12.8%",
      allocation: "Speculative",
    },
  ]

  return (
    <Card className="bg-[#1A202C] border-[#2D3748]">
      <CardHeader>
        <CardTitle className="flex items-center text-[#22D3EE] text-xl">
          <Target className="w-6 h-6 mr-3" />
          Investment Strategy Intelligence
          <Badge variant="outline" className="ml-3 border-purple-500 text-purple-500">
            AI-Powered
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>{/* ... existing component content ... */}</CardContent>
    </Card>
  )
}
