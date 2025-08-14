"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Network } from "lucide-react"

export default function EnhancedSeiIntegration() {
  return (
    <Card className="bg-[#1A202C] border-[#2D3748]">
      <CardHeader>
        <CardTitle className="flex items-center text-[#22D3EE] text-xl">
          <Network className="w-6 h-6 mr-3" />
          Sei Network Integration
          <Badge variant="outline" className="ml-3 border-green-500 text-green-500 animate-pulse">
            Live Data
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>{/* ... existing component content ... */}</CardContent>
    </Card>
  )
}
