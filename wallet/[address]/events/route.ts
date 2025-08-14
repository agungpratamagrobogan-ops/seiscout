import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest, { params }: { params: { address: string } }) {
  try {
    const { address } = params
    const { searchParams } = new URL(request.url)
    const limit = Number.parseInt(searchParams.get("limit") || "50")
    const offset = Number.parseInt(searchParams.get("offset") || "0")

    const mockEvents = [
      {
        hash: "0x1234567890abcdef1234567890abcdef12345678",
        blockNumber: "12345678",
        type: "incoming_transfer" as const,
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        contract: "0xA0b86a33E6441e8e421c7c7c4b8b8b8b8b8b8b8b",
      },
      {
        hash: "0x2345678901bcdef12345678901bcdef123456789",
        blockNumber: "12345677",
        type: "outgoing_transfer" as const,
        timestamp: new Date(Date.now() - 7200000).toISOString(),
        contract: "0xB1c97a44F7552f9f532d8d8d5c9c9c9c9c9c9c9c",
      },
      {
        hash: "0x3456789012cdef123456789012cdef1234567890",
        blockNumber: "12345676",
        type: "incoming_transfer" as const,
        timestamp: new Date(Date.now() - 10800000).toISOString(),
        contract: "0xC2d08b55G8663g0g643e9e9e6d0d0d0d0d0d0d0d",
      },
    ]

    const paginatedEvents = mockEvents.slice(offset, offset + limit)

    const mockUnusualActivities = [
      {
        type: "large_transfer",
        count: 2,
        description: "2 large transfers detected",
        severity: "medium",
      },
    ]

    const response = {
      address,
      events: paginatedEvents,
      pagination: {
        total: mockEvents.length,
        limit,
        offset,
        hasMore: offset + limit < mockEvents.length,
      },
      unusualActivities: mockUnusualActivities,
      summary: {
        totalEvents: mockEvents.length,
        incomingTransfers: 2,
        outgoingTransfers: 1,
        last24h: 3,
      },
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error("Wallet events error:", error)
    return NextResponse.json({ error: "Failed to fetch wallet events" }, { status: 500 })
  }
}
