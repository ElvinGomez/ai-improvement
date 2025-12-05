import { logtoEdgeClient } from "@/lib/logto-edge"
import { NextRequest } from "next/server"

export async function GET(request: NextRequest) {
  // Handle callback
  if (request.nextUrl.searchParams.has("code")) {
    const handler = logtoEdgeClient.handleSignInCallback()
    return handler(request)
  }
  
  // Default to sign in
  const handler = logtoEdgeClient.handleSignIn()
  return handler(request)
}

