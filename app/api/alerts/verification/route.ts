import { NextResponse } from "next/server"

export async function GET() {
  // Mock verification data
  const verification = {
    total_alerts: 1247,
    verified_alerts: 1198,
    accuracy_rate: 96.1,
    last_updated: new Date().toISOString(),
  }

  return NextResponse.json(verification)
}
