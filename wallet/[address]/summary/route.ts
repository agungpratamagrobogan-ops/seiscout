import type { NextRequest } from "next/server"
import { seiClient, seitraceAddr } from "@/lib/sei"
import { parseAbiItem } from "viem"

const transferEvent = parseAbiItem("event Transfer(address indexed from, address indexed to, uint256 value)")

export async function GET(request: NextRequest, { params }: { params: { address: string } }) {
  try {
    const address = params.address as `0x${string}`

    // Get latest block and recent transaction data
    const latestBlock = await seiClient.getBlockNumber()
    const fromBlock = latestBlock - 5000n // Last ~5k blocks

    // Get balance
    const balance = await seiClient.getBalance({ address })

    // Get recent transfer events
    const logs = await seiClient.getLogs({
      fromBlock,
      toBlock: latestBlock,
      events: [transferEvent],
      args: {
        from: address,
      },
    })

    const incomingLogs = await seiClient.getLogs({
      fromBlock,
      toBlock: latestBlock,
      events: [transferEvent],
      args: {
        to: address,
      },
    })

    // Calculate metrics
    const totalTxs = logs.length + incomingLogs.length
    const recentTxs = logs.slice(0, 10).map((log) => ({
      hash: log.transactionHash,
      blockNumber: log.blockNumber,
      from: log.args.from,
      to: log.args.to,
      value: log.args.value?.toString(),
      seitraceUrl: `https://seitrace.com/tx/${log.transactionHash}?chain=pacific-1`,
    }))

    // Calculate behavior score based on transaction patterns
    const avgTxSize =
      logs.length > 0 ? logs.reduce((sum, log) => sum + Number(log.args.value || 0), 0) / logs.length : 0
    const behaviorScore = Math.min(10, Math.max(1, totalTxs * 0.1 + (avgTxSize > 1000000000000000000 ? 2 : 1) + 5))

    return Response.json({
      address,
      balance: balance.toString(),
      balanceFormatted: `${(Number(balance) / 1e18).toFixed(1)}K SEI`,
      totalTransactions: totalTxs,
      activity24h: Math.min(totalTxs, 50), // Cap at 50 for display
      behaviorScore: behaviorScore.toFixed(1),
      riskLevel: behaviorScore > 7 ? "Low" : behaviorScore > 4 ? "Medium" : "High",
      recentTransactions: recentTxs,
      seitraceUrl: seitraceAddr(address),
      lastUpdated: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Error fetching wallet summary:", error)

    // Return mock data on error
    return Response.json({
      address: params.address,
      balance: "847200000000000000000000",
      balanceFormatted: "847.2K SEI",
      totalTransactions: 156,
      activity24h: 23,
      behaviorScore: "8.7",
      riskLevel: "Low",
      recentTransactions: [],
      seitraceUrl: seitraceAddr(params.address),
      lastUpdated: new Date().toISOString(),
      error: "Using mock data - blockchain connection failed",
    })
  }
}
