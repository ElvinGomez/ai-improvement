import { logtoEdgeClient } from "@/lib/logto-edge"
import { NextRequest } from "next/server"

export async function GET(request: NextRequest) {
  // After successful authentication, redirect to reports page
  const redirectTo = "/reports"
  const handler = logtoEdgeClient.handleSignInCallback(redirectTo)
  return handler(request)
}

