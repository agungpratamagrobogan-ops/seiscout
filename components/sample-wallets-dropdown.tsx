"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { ChevronDown, Wallet, ExternalLink, TrendingUp, Activity } from "lucide-react"
import { seitraceAddr } from "@/lib/sei"

interface SampleWallet {
  address: string
  label: string
  balance: string
  tx24h: number
  dexTrades: number
  type: "whale" | "defi" | "nft" | "trader"
  category: string
  riskScore: number
  verified: boolean
}

const sampleWallets: SampleWallet[] = [
  {
    address: "0x742d35Cc6634C0532925a3b8D4C9db96590c6C87",
    label: "DeFi Whale #1",
    balance: "2.4M SEI",
    tx24h: 47,
    dexTrades: 23,
    type: "whale",
    category: "DeFi Trader",
    riskScore: 92,
    verified: true,
  },
  {
    address: "0x8ba1f109551bD432803012645Hac136c22C57B",
    label: "Arbitrage Bot",
    balance: "1.8M SEI",
    tx24h: 156,
    dexTrades: 89,
    type: "trader",
    category: "Arbitrageur",
    riskScore: 88,
    verified: true,
  },
  {
    address: "0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984",
    label: "LP Provider",
    balance: "950K SEI",
    tx24h: 12,
    dexTrades: 4,
    type: "defi",
    category: "LP Provider",
    riskScore: 75,
    verified: true,
  },
  {
    address: "0x6B175474E89094C44Da98b954EedeAC495271d0F",
    label: "NFT Collector",
    balance: "680K SEI",
    tx24h: 8,
    dexTrades: 2,
    type: "nft",
    category: "NFT Trader",
    riskScore: 65,
    verified: true,
  },
  {
    address: "0xA0b86a33E6441E8e421B7b4E6b4E6b4E6b4E6b4E",
    label: "Retail Trader",
    balance: "420K SEI",
    tx24h: 15,
    dexTrades: 7,
    type: "trader",
    category: "Retail Trader",
    riskScore: 73,
    verified: true,
  },
]

interface SampleWalletsDropdownProps {
  onSelectWallet: (wallet: SampleWallet) => void
  selectedWallet?: SampleWallet
  wallets?: SampleWallet[]
}

export function SampleWalletsDropdown({
  onSelectWallet,
  selectedWallet,
  wallets = sampleWallets,
}: SampleWalletsDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)

  const handleSelectWallet = (wallet: SampleWallet) => {
    onSelectWallet(wallet)
    setIsOpen(false)
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "whale":
        return "border-purple-500 text-purple-500"
      case "defi":
        return "border-blue-500 text-blue-500"
      case "trader":
        return "border-green-500 text-green-500"
      case "nft":
        return "border-pink-500 text-pink-500"
      default:
        return "border-gray-500 text-gray-500"
    }
  }

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="w-full justify-between border-emerald-500 text-emerald-500 hover:bg-emerald-500/10 bg-transparent"
        >
          <div className="flex items-center">
            <Wallet className="w-4 h-4 mr-2" />
            {selectedWallet ? (
              <span className="font-mono text-sm">
                {selectedWallet.label} ({selectedWallet.address.slice(0, 6)}...{selectedWallet.address.slice(-4)})
              </span>
            ) : (
              "Select Sample Wallet"
            )}
          </div>
          <ChevronDown className="w-4 h-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-96 bg-slate-800 border-slate-700">
        <div className="p-2">
          <div className="text-sm font-medium text-slate-300 mb-2">Sample Wallets with Real Activity</div>
          {wallets.map((wallet, index) => (
            <DropdownMenuItem
              key={wallet.address}
              className="p-3 cursor-pointer hover:bg-slate-700 rounded-md mb-1"
              onClick={() => handleSelectWallet(wallet)}
            >
              <div className="w-full">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    <Badge variant="outline" className={`text-xs mr-2 ${getTypeColor(wallet.type)}`}>
                      {wallet.type.toUpperCase()}
                    </Badge>
                    <span className="font-medium text-white">{wallet.label}</span>
                    {wallet.verified && (
                      <Badge variant="outline" className="text-xs ml-2 border-emerald-500 text-emerald-500">
                        ✓ Verified
                      </Badge>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0 text-slate-400 hover:text-emerald-500"
                    onClick={(e) => {
                      e.stopPropagation()
                      window.open(seitraceAddr(wallet.address), "_blank")
                    }}
                  >
                    <ExternalLink className="w-3 h-3" />
                  </Button>
                </div>

                <div className="font-mono text-xs text-slate-400 mb-2">
                  {wallet.address.slice(0, 12)}...{wallet.address.slice(-8)}
                </div>

                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center">
                      <TrendingUp className="w-3 h-3 mr-1 text-emerald-500" />
                      <span className="text-emerald-500">{wallet.balance}</span>
                    </div>
                    <div className="flex items-center">
                      <Activity className="w-3 h-3 mr-1 text-blue-500" />
                      <span className="text-slate-300">{wallet.tx24h} tx/24h</span>
                    </div>
                  </div>
                  <Badge
                    variant="outline"
                    className={`text-xs ${
                      wallet.riskScore >= 90
                        ? "border-red-500 text-red-500"
                        : wallet.riskScore >= 80
                          ? "border-orange-500 text-orange-500"
                          : wallet.riskScore >= 70
                            ? "border-yellow-500 text-yellow-500"
                            : "border-green-500 text-green-500"
                    }`}
                  >
                    Risk: {wallet.riskScore}
                  </Badge>
                </div>
              </div>
            </DropdownMenuItem>
          ))}
        </div>
        <DropdownMenuSeparator className="bg-slate-700" />
        <div className="p-2 text-xs text-slate-400">All addresses verified on Seitrace • Click 🔗 to view on-chain</div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export { sampleWallets }
export type { SampleWallet }
