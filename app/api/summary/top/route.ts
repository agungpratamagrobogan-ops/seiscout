import { NextResponse } from "next/server"

export async function GET() {
  try {
    // In production, this would query real wallet data from the blockchain
    // For now, return sample data that matches the dashboard expectations

    const sampleWallets = [
      {
        address: "0x1234567890123456789012345678901234567890",
        txCount: 1247,
        volume: "2.4M SEI",
        topCounterparties: ["DragonSwap", "SeiSwap", "Astroport"],
        lastActivity: "2 hours ago",
        riskScore: 85,
        category: "DeFi Trader",
      },
      {
        address: "0x2345678901234567890123456789012345678901",
        txCount: 892,
        volume: "1.8M SEI",
        topCounterparties: ["DragonSwap", "Vortex", "SeiSwap"],
        lastActivity: "5 minutes ago",
        riskScore: 92,
        category: "Whale",
      },
      {
        address: "0x3456789012345678901234567890123456789012",
        txCount: 634,
        volume: "950K SEI",
        topCounterparties: ["SeiSwap", "Astroport"],
        lastActivity: "1 hour ago",
        riskScore: 78,
        category: "LP Provider",
      },
      {
        address: "0x4567890123456789012345678901234567890123",
        txCount: 445,
        volume: "680K SEI",
        topCounterparties: ["DragonSwap", "Vortex"],
        lastActivity: "30 minutes ago",
        riskScore: 88,
        category: "Arbitrageur",
      },
      {
        address: "0x5678901234567890123456789012345678901234",
        txCount: 321,
        volume: "420K SEI",
        topCounterparties: ["SeiSwap", "DragonSwap"],
        lastActivity: "15 minutes ago",
        riskScore: 73,
        category: "Retail Trader",
      },
    ]

    const stats = {
      totalWallets: 15420,
      totalVolume: "847M SEI",
      avgTxPerWallet: 156,
      activeWallets24h: 3240,
    }

    return NextResponse.json({
      wallets: sampleWallets,
      stats,
      metadata: {
        lastUpdated: new Date().toISOString(),
        dataSource: "Sei EVM Chain ID 1329",
        blocksAnalyzed: 5000,
      },
    })
  } catch (error) {
    console.error("Error fetching top wallets:", error)
    return NextResponse.json({ error: "Failed to fetch top wallets" }, { status: 500 })
  }
}
