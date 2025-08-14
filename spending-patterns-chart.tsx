"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { PieChart, BarChart3, Calendar, Gauge, TrendingUp } from "lucide-react"

export default function SpendingPatternsChart() {
  const [activeTab, setActiveTab] = useState("overview")

  const spendingCategories = [
    { name: "DeFi Trading", percentage: 45, amount: "234.5K SEI", color: "bg-[#22D3EE]" },
    { name: "NFT Purchases", percentage: 28, amount: "145.8K SEI", color: "bg-purple-500" },
    { name: "Staking", percentage: 15, amount: "78.2K SEI", color: "bg-green-500" },
    { name: "Transfers", percentage: 12, amount: "62.5K SEI", color: "bg-yellow-500" },
  ]

  const transactionSizes = [
    { range: "< 100 SEI", count: 45, percentage: 60 },
    { range: "100-1K SEI", count: 23, percentage: 30 },
    { range: "1K-10K SEI", count: 6, percentage: 8 },
    { range: "> 10K SEI", count: 2, percentage: 2 },
  ]

  return (
    <Card className="bg-[#1A202C] border-[#2D3748]">
      <CardHeader>
        <CardTitle className="flex items-center text-[#22D3EE]">
          <PieChart className="w-5 h-5 mr-2" />
          Spending Patterns Analysis
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4 bg-[#0C101A]">
            <TabsTrigger
              value="overview"
              className="data-[state=active]:bg-[#22D3EE] data-[state=active]:text-[#0C101A]"
            >
              Overview
            </TabsTrigger>
            <TabsTrigger
              value="categories"
              className="data-[state=active]:bg-[#22D3EE] data-[state=active]:text-[#0C101A]"
            >
              Categories
            </TabsTrigger>
            <TabsTrigger
              value="timeline"
              className="data-[state=active]:bg-[#22D3EE] data-[state=active]:text-[#0C101A]"
            >
              Timeline
            </TabsTrigger>
            <TabsTrigger
              value="frequency"
              className="data-[state=active]:bg-[#22D3EE] data-[state=active]:text-[#0C101A]"
            >
              Frequency
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-6">
            <div className="space-y-6">
              {/* Category Breakdown */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Category Breakdown</h3>
                <div className="space-y-3">
                  {spendingCategories.map((category, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`w-4 h-4 rounded ${category.color}`}></div>
                        <span className="text-sm">{category.name}</span>
                      </div>
                      <div className="flex items-center space-x-4">
                        <Progress value={category.percentage} className="w-24 h-2" />
                        <span className="text-sm font-semibold text-[#22D3EE] w-16">{category.percentage}%</span>
                        <span className="text-sm text-gray-400 w-20">{category.amount}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Behavior Score */}
              <div className="p-4 bg-[#0C101A] rounded-lg border border-[#2D3748]">
                <div className="flex items-center space-x-2 mb-2">
                  <TrendingUp className="w-5 h-5 text-[#22D3EE]" />
                  <span className="font-semibold">Behavior Analysis</span>
                </div>
                <p className="text-sm text-gray-300">
                  "Sophisticated DeFi user with consistent trading patterns. Shows strong preference for yield farming
                  and liquidity provision."
                </p>
                <div className="mt-3 flex space-x-2">
                  <Badge variant="outline" className="border-green-500 text-green-500">
                    Consistent Trader
                  </Badge>
                  <Badge variant="outline" className="border-blue-500 text-blue-500">
                    DeFi Native
                  </Badge>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="categories" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Pie Chart Placeholder */}
              <div className="h-64 bg-[#0C101A] rounded-lg border-2 border-dashed border-[#2D3748] flex items-center justify-center">
                <div className="text-center">
                  <PieChart className="w-12 h-12 text-[#22D3EE] mx-auto mb-2" />
                  <p className="text-sm text-gray-400">Interactive Pie Chart</p>
                </div>
              </div>

              {/* Category Details */}
              <div className="space-y-4">
                {spendingCategories.map((category, index) => (
                  <Card key={index} className="bg-[#0C101A] border-[#2D3748]">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold">{category.name}</span>
                        <span className="text-[#22D3EE] font-bold">{category.percentage}%</span>
                      </div>
                      <div className="text-sm text-gray-400 mb-2">{category.amount}</div>
                      <Progress value={category.percentage} className="h-2" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="timeline" className="mt-6">
            <div className="h-64 bg-[#0C101A] rounded-lg border-2 border-dashed border-[#2D3748] flex items-center justify-center">
              <div className="text-center">
                <BarChart3 className="w-12 h-12 text-[#22D3EE] mx-auto mb-2" />
                <p className="text-sm text-gray-400">Transaction Timeline Chart</p>
                <p className="text-xs text-gray-500 mt-1">Spending patterns over time</p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="frequency" className="mt-6">
            <div className="space-y-6">
              {/* Frequency Heatmap */}
              <div className="h-32 bg-[#0C101A] rounded-lg border-2 border-dashed border-[#2D3748] flex items-center justify-center">
                <div className="text-center">
                  <Calendar className="w-12 h-12 text-[#22D3EE] mx-auto mb-2" />
                  <p className="text-sm text-gray-400">Activity Heatmap</p>
                </div>
              </div>

              {/* Transaction Size Distribution */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Transaction Size Distribution</h3>
                <div className="space-y-3">
                  {transactionSizes.map((size, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm w-24">{size.range}</span>
                      <div className="flex items-center space-x-4 flex-1">
                        <Progress value={size.percentage} className="flex-1 h-2" />
                        <span className="text-sm text-[#22D3EE] w-12">{size.count}</span>
                        <span className="text-sm text-gray-400 w-12">{size.percentage}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Spending Velocity */}
              <div className="p-4 bg-[#0C101A] rounded-lg border border-[#2D3748]">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <Gauge className="w-5 h-5 text-[#22D3EE]" />
                    <span className="font-semibold">Spending Velocity</span>
                  </div>
                  <Badge variant="outline" className="border-green-500 text-green-500">
                    High Activity
                  </Badge>
                </div>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-[#22D3EE]">2.3</div>
                    <div className="text-xs text-gray-400">Tx/Hour</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-[#22D3EE]">56</div>
                    <div className="text-xs text-gray-400">Tx/Day</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-[#22D3EE]">1.2K</div>
                    <div className="text-xs text-gray-400">SEI/Day</div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
