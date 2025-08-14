"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Trash2, ExternalLink, Eye, Star, StarOff, Activity, TrendingUp } from "lucide-react"
import { seitraceAddr } from "@/lib/sei"

interface WatchlistWallet {
  address: string
  label?: string
  addedAt: string
  isFavorite: boolean
  lastChecked?: string
  txCount?: number
  volume?: string
  riskScore?: number
}

interface WalletWatchlistProps {
  wallets: WatchlistWallet[]
  onRemoveWallet: (address: string) => void
  onToggleFavorite: (address: string) => void
  onAnalyzeWallet: (address: string) => void
  className?: string
}

export function WalletWatchlist({
  wallets,
  onRemoveWallet,
  onToggleFavorite,
  onAnalyzeWallet,
  className = "",
}: WalletWatchlistProps) {
  const [sortBy, setSortBy] = useState<"added" | "favorite" | "activity">("favorite")

  const sortedWallets = [...wallets].sort((a, b) => {
    switch (sortBy) {
      case "favorite":
        if (a.isFavorite && !b.isFavorite) return -1
        if (!a.isFavorite && b.isFavorite) return 1
        return new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime()
      case "activity":
        return (b.txCount || 0) - (a.txCount || 0)
      case "added":
      default:
        return new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime()
    }
  })

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

    if (diffInHours < 1) return "Just now"
    if (diffInHours < 24) return `${diffInHours}h ago`
    const diffInDays = Math.floor(diffInHours / 24)
    return `${diffInDays}d ago`
  }

  if (wallets.length === 0) {
    return (
      <Card className={`bg-slate-800 border-slate-700 ${className}`}>
        <CardContent className="p-8 text-center">
          <div className="text-slate-400 mb-4">
            <Eye className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>No wallets in your watchlist yet</p>
            <p className="text-sm">Add wallet addresses to start monitoring their activity</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={`bg-slate-800 border-slate-700 ${className}`}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center text-emerald-500">
            <Eye className="w-5 h-5 mr-2" />
            Wallet Watchlist ({wallets.length})
          </CardTitle>
          <div className="flex items-center space-x-2">
            <Button
              variant={sortBy === "favorite" ? "default" : "ghost"}
              size="sm"
              onClick={() => setSortBy("favorite")}
              className="text-xs"
            >
              Favorites
            </Button>
            <Button
              variant={sortBy === "activity" ? "default" : "ghost"}
              size="sm"
              onClick={() => setSortBy("activity")}
              className="text-xs"
            >
              Activity
            </Button>
            <Button
              variant={sortBy === "added" ? "default" : "ghost"}
              size="sm"
              onClick={() => setSortBy("added")}
              className="text-xs"
            >
              Recent
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {sortedWallets.map((wallet) => (
            <div
              key={wallet.address}
              className="flex items-center justify-between p-3 bg-slate-900 rounded-lg border border-slate-700 hover:border-slate-600 transition-colors"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-1">
                  {wallet.isFavorite && <Star className="w-4 h-4 text-yellow-500 fill-current" />}
                  <span className="font-mono text-sm text-white">
                    {wallet.address.slice(0, 8)}...{wallet.address.slice(-6)}
                  </span>
                  {wallet.label && (
                    <Badge variant="outline" className="text-xs border-slate-600 text-slate-300">
                      {wallet.label}
                    </Badge>
                  )}
                </div>

                <div className="flex items-center space-x-4 text-xs text-slate-400">
                  <span>Added {formatTimeAgo(wallet.addedAt)}</span>
                  {wallet.txCount && (
                    <div className="flex items-center">
                      <Activity className="w-3 h-3 mr-1" />
                      {wallet.txCount} tx
                    </div>
                  )}
                  {wallet.volume && (
                    <div className="flex items-center">
                      <TrendingUp className="w-3 h-3 mr-1" />
                      {wallet.volume}
                    </div>
                  )}
                  {wallet.riskScore && (
                    <Badge
                      variant="outline"
                      className={`text-xs ${
                        wallet.riskScore >= 80
                          ? "border-red-500 text-red-500"
                          : wallet.riskScore >= 60
                            ? "border-yellow-500 text-yellow-500"
                            : "border-green-500 text-green-500"
                      }`}
                    >
                      Risk: {wallet.riskScore}
                    </Badge>
                  )}
                </div>
              </div>

              <div className="flex items-center space-x-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onToggleFavorite(wallet.address)}
                  className="h-8 w-8 p-0 text-slate-400 hover:text-yellow-500"
                >
                  {wallet.isFavorite ? <StarOff className="w-4 h-4" /> : <Star className="w-4 h-4" />}
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => window.open(seitraceAddr(wallet.address), "_blank")}
                  className="h-8 w-8 p-0 text-slate-400 hover:text-emerald-500"
                >
                  <ExternalLink className="w-4 h-4" />
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onAnalyzeWallet(wallet.address)}
                  className="h-8 w-8 p-0 text-slate-400 hover:text-blue-500"
                >
                  <Activity className="w-4 h-4" />
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onRemoveWallet(wallet.address)}
                  className="h-8 w-8 p-0 text-slate-400 hover:text-red-500"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

export type { WatchlistWallet }
