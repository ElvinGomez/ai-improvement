import { logtoEdgeClient } from "@/lib/logto-edge"
import { NextRequest } from "next/server"

export async function GET(request: NextRequest) {
  const handler = logtoEdgeClient.handleSignOut()
  return handler(request)
}

