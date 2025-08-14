"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  ArrowRight,
  Zap,
  Shield,
  BarChart3,
  Clock,
  ExternalLink,
  CheckCircle,
  Activity,
  Database,
  TrendingUp,
  Users,
  Globe,
} from "lucide-react"
import Link from "next/link"
import Navigation from "@/components/navigation"

export default function LandingPage() {
  const [stats, setStats] = useState({
    totalWallets: 12847,
    alertsDelivered: 89234,
    avgLatency: 247,
    uptime: 99.8,
  })

  useEffect(() => {
    // Simulate real-time stats updates
    const interval = setInterval(() => {
      setStats((prev) => ({
        totalWallets: prev.totalWallets + Math.floor(Math.random() * 3),
        alertsDelivered: prev.alertsDelivered + Math.floor(Math.random() * 5),
        avgLatency: 200 + Math.floor(Math.random() * 100),
        uptime: 99.7 + Math.random() * 0.3,
      }))
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      <Navigation />

      {/* Hero Section */}
      <div className="pt-24 pb-16">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full mb-6">
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse mr-2"></div>
              <span className="text-emerald-400 text-sm font-medium">Live on Sei Network</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-emerald-200 to-emerald-400 bg-clip-text text-transparent">
              SeiScout
            </h1>

            <p className="text-xl md:text-2xl text-slate-300 mb-8 max-w-3xl mx-auto leading-relaxed">
              Real-time blockchain analytics and sub-second alerts for the Sei ecosystem. Monitor wallets, track
              opportunities, and never miss a trade.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/dashboard">
                <Button
                  size="lg"
                  className="bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-3 text-lg font-semibold"
                >
                  Start Monitoring
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>

              <Link href="/verify">
                <Button
                  variant="outline"
                  size="lg"
                  className="border-slate-600 text-slate-300 hover:bg-slate-800 px-8 py-3 text-lg bg-transparent"
                >
                  View Verification
                  <ExternalLink className="ml-2 w-4 h-4" />
                </Button>
              </Link>
            </div>
          </div>

          {/* Live Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
            <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
              <CardContent className="p-6 text-center">
                <div className="text-2xl md:text-3xl font-bold text-emerald-400 mb-2">
                  {stats.totalWallets.toLocaleString()}
                </div>
                <div className="text-sm text-slate-400">Wallets Monitored</div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
              <CardContent className="p-6 text-center">
                <div className="text-2xl md:text-3xl font-bold text-blue-400 mb-2">
                  {stats.alertsDelivered.toLocaleString()}
                </div>
                <div className="text-sm text-slate-400">Alerts Delivered</div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
              <CardContent className="p-6 text-center">
                <div className="text-2xl md:text-3xl font-bold text-yellow-400 mb-2">{stats.avgLatency}ms</div>
                <div className="text-sm text-slate-400">Avg Latency</div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
              <CardContent className="p-6 text-center">
                <div className="text-2xl md:text-3xl font-bold text-green-400 mb-2">{stats.uptime.toFixed(1)}%</div>
                <div className="text-sm text-slate-400">Uptime</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 bg-slate-800/30">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">Why Choose SeiScout?</h2>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto">
              Built specifically for Sei's high-performance blockchain with sub-second finality
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm hover:bg-slate-800/70 transition-all">
              <CardHeader>
                <div className="w-12 h-12 bg-emerald-500/10 rounded-lg flex items-center justify-center mb-4">
                  <Zap className="w-6 h-6 text-emerald-400" />
                </div>
                <CardTitle className="text-white">Sub-Second Alerts</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-300 mb-4">
                  Get notified within 247ms average latency. Never miss a trading opportunity with our lightning-fast
                  alert system.
                </p>
                <div className="flex items-center text-emerald-400 text-sm">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Verified on Seitrace
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm hover:bg-slate-800/70 transition-all">
              <CardHeader>
                <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center mb-4">
                  <BarChart3 className="w-6 h-6 text-blue-400" />
                </div>
                <CardTitle className="text-white">Advanced Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-300 mb-4">
                  Deep wallet analysis with behavioral patterns, PNL tracking, and Sharpe ratio calculations from real
                  DEX data.
                </p>
                <div className="flex items-center text-blue-400 text-sm">
                  <TrendingUp className="w-4 h-4 mr-2" />
                  DragonSwap Integration
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm hover:bg-slate-800/70 transition-all">
              <CardHeader>
                <div className="w-12 h-12 bg-purple-500/10 rounded-lg flex items-center justify-center mb-4">
                  <Shield className="w-6 h-6 text-purple-400" />
                </div>
                <CardTitle className="text-white">Blockchain Verified</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-300 mb-4">
                  Every alert is cryptographically verifiable on-chain. Full transparency with Seitrace integration for
                  audit trails.
                </p>
                <div className="flex items-center text-purple-400 text-sm">
                  <Database className="w-4 h-4 mr-2" />
                  100% Verifiable
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="py-16">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">How SeiScout Works</h2>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto">
              Three simple steps to start monitoring the Sei ecosystem
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="w-8 h-8 text-emerald-400" />
              </div>
              <h3 className="text-xl font-semibold mb-4 text-white">1. Connect Wallet</h3>
              <p className="text-slate-300">
                Connect your MetaMask to Sei network and start monitoring wallets of interest
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Activity className="w-8 h-8 text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold mb-4 text-white">2. Set Alerts</h3>
              <p className="text-slate-300">
                Configure custom alerts for large transactions, new positions, or unusual activity patterns
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Globe className="w-8 h-8 text-purple-400" />
              </div>
              <h3 className="text-xl font-semibold mb-4 text-white">3. Monitor & Trade</h3>
              <p className="text-slate-300">
                Receive sub-second alerts and execute mirror trades directly through DragonSwap integration
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-16 bg-gradient-to-r from-emerald-600/10 to-blue-600/10">
        <div className="container mx-auto max-w-4xl px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">Ready to Scout the Sei Network?</h2>
          <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
            Join thousands of traders using SeiScout to stay ahead of the market with real-time blockchain intelligence.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/dashboard">
              <Button
                size="lg"
                className="bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-3 text-lg font-semibold"
              >
                Start Free Trial
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>

            <Link href="/analysis">
              <Button
                variant="outline"
                size="lg"
                className="border-slate-600 text-slate-300 hover:bg-slate-800 px-8 py-3 text-lg bg-transparent"
              >
                View Sample Analysis
                <BarChart3 className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </div>

          <div className="mt-8 flex items-center justify-center space-x-6 text-sm text-slate-400">
            <div className="flex items-center">
              <CheckCircle className="w-4 h-4 mr-2 text-emerald-400" />
              No credit card required
            </div>
            <div className="flex items-center">
              <Clock className="w-4 h-4 mr-2 text-blue-400" />
              Setup in 2 minutes
            </div>
            <div className="flex items-center">
              <Shield className="w-4 h-4 mr-2 text-purple-400" />
              Blockchain verified
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-8 border-t border-slate-800">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-slate-400 mb-4 md:mb-0">© 2024 SeiScout. Built for the Sei ecosystem.</div>
            <div className="flex items-center space-x-6">
              <Link href="/verify" className="text-slate-400 hover:text-white transition-colors">
                Verification
              </Link>
              <a
                href="https://seitrace.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-400 hover:text-white transition-colors"
              >
                Seitrace
              </a>
              <a
                href="https://dragonswap.app"
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-400 hover:text-white transition-colors"
              >
                DragonSwap
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
