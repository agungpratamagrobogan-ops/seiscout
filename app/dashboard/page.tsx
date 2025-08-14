"use client"

import Navigation from "@/components/navigation"
import WalletSelector from "@/components/wallet-selector"

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      <Navigation />

      <div className="pt-20 pb-8">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-emerald-400 mb-2">Wallet Intelligence Dashboard</h1>
            <p className="text-slate-300">
              Monitor specific wallets with 24h activity summaries and Seitrace verification
            </p>
          </div>

          <WalletSelector />
        </div>
      </div>
    </div>
  )
}
