import { NextResponse } from "next/server"
import { seiClient } from "@/lib/sei"

export async function GET() {
  try {
    const startTime = Date.now()

    const [blockNumber, gasPrice] = await Promise.all([seiClient.getBlockNumber(), seiClient.getGasPrice()])

    const latency = (Date.now() - startTime) / 1000

    // Get latest block to check timestamp
    const latestBlock = await seiClient.getBlock({ blockNumber })

    const status = {
      chain_id: 1329,
      block_height: Number(blockNumber),
      network_latency: latency,
      rpc_status: "healthy",
      last_block_time: new Date(Number(latestBlock.timestamp) * 1000).toISOString(),
      gas_price: gasPrice.toString(),
      finality_time: 0.4, // Sei's sub-second finality
    }

    return NextResponse.json(status)
  } catch (error) {
    console.error("Error fetching network status:", error)

    // Fallback to mock data if blockchain call fails
    const status = {
      chain_id: 1329,
      block_height: 85432109,
      network_latency: 999,
      rpc_status: "error",
      last_block_time: new Date().toISOString(),
      error: "Failed to connect to Sei network",
    }

    return NextResponse.json(status, { status: 503 })
  }
}
