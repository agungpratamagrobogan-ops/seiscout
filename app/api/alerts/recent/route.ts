import { NextResponse } from "next/server"

export async function GET() {
  // Mock recent alerts data
  const alerts = [
    {
      id: "1",
      type: "whale_movement",
      message: "Large SEI transfer detected: 1.2M SEI",
      timestamp: new Date().toISOString(),
      severity: "high",
    },
    {
      id: "2",
      type: "price_change",
      message: "SEI price increased 15% in last hour",
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      severity: "medium",
    },
  ]

  return NextResponse.json(alerts)
}
