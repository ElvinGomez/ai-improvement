import { logtoEdgeClient } from "@/lib/logto-edge"
import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const context = await logtoEdgeClient.getLogtoContext(request)
    
    if (!context.isAuthenticated) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    // Extract user info and roles from context
    const userInfo = {
      sub: context.claims?.sub,
      name: context.claims?.name,
      email: context.claims?.email,
      picture: context.claims?.picture,
      roles: context.claims?.roles || [],
    }

    return NextResponse.json(userInfo)
  } catch (error) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
  }
}