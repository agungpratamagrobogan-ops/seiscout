"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Target } from "lucide-react"

export default function InvestmentStrategy() {
  const portfolioComposition = [
    { token: "SEI", percentage: 60, amount: "508.3K SEI", value: "$430,284" },
    { token: "USDC", percentage: 25, amount: "212.0K USDC", value: "$212,000" },
    { token: "Other Tokens", percentage: 15, amount: "Various", value: "$75,000" },
  ]

  return (
    <Card className="bg-[#1A202C] border-[#2D3748]">
      <CardHeader>
        <CardTitle className="flex items-center text-[#22D3EE]">
          <Target className="w-5 h-5 mr-2" />
          Investment Strategy Intelligence
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">{/* ... existing component content ... */}</CardContent>
    </Card>
  )
}
