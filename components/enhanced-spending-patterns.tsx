"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { PieChart } from "lucide-react"

export default function EnhancedSpendingPatterns() {
  const [activeTab, setActiveTab] = useState("overview")

  const spendingCategories = [
    { name: "DeFi Trading", percentage: 45, amount: "234.5K SEI", color: "#22D3EE", transactions: 156 },
    { name: "NFT Purchases", percentage: 28, amount: "145.8K SEI", color: "#8B5CF6", transactions: 23 },
    { name: "Staking Rewards", percentage: 15, amount: "78.2K SEI", color: "#10B981", transactions: 45 },
    { name: "P2P Transfers", percentage: 12, amount: "62.5K SEI", color: "#F59E0B", transactions: 89 },
  ]

  return (
    <Card className="bg-[#1A202C] border-[#2D3748]">
      <CardHeader>
        <CardTitle className="flex items-center text-[#22D3EE] text-xl">
          <PieChart className="w-6 h-6 mr-3" />
          Spending Patterns Intelligence
          <Badge variant="outline" className="ml-3 border-[#22D3EE] text-[#22D3EE] animate-pulse">
            Live Analysis
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>{/* ... existing component content ... */}</CardContent>
    </Card>
  )
}
