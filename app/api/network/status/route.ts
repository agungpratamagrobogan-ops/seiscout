import { NextResponse } from "next/server"

export async function GET() {
  // Mock network status
  const status = {
    chain_id: 1329,
    block_height: 85432109,
    network_latency: 0.12,
    rpc_status: "healthy",
    last_block_time: new Date().toISOString(),
  }

  return NextResponse.json(status)
}
