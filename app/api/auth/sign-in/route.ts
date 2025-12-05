import { logtoEdgeClient } from "@/lib/logto-edge"
import { NextRequest } from "next/server"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const redirectTo = searchParams.get("redirectTo") || "/reports"
  
  const baseUrl = process.env.LOGTO_BASE_URL || process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3001"
  console.log("🚀 ~ route.ts:9 ~ GET ~ baseUrl:", baseUrl)
  
  // Explicitly set the redirectUri to match what's registered in Logto dashboard
  const signInOptions = {
    redirectUri: `${baseUrl}/api/auth/callback`,
    postRedirectUri: redirectTo,
  }
  
  const handler = logtoEdgeClient.handleSignIn(signInOptions)
  return handler(request)
}

