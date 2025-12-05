import { logtoEdgeClient } from "@/lib/logto-edge"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Public routes that don't require authentication
  const publicRoutes = ["/api/logto", "/api/auth", "/unauthorized"]
  
  // Allow root path (landing page) to be public
  if (pathname === "/" || publicRoutes.some((route) => pathname.startsWith(route))) {
    return NextResponse.next()
  }

  // Check authentication and admin role for protected routes
  try {
    const context = await logtoEdgeClient.getLogtoContext(request)
    
    // If not authenticated, redirect to sign in
    if (!context.isAuthenticated) {
      const signInUrl = new URL("/api/auth/sign-in", request.url)
      signInUrl.searchParams.set("redirectTo", pathname)
      return NextResponse.redirect(signInUrl)
    }

    // Check for admin role
    // Roles can be in different locations: claims.roles, accessTokenClaims.roles, or organizationRoles
    const roles = 
      context.claims?.roles || 
      (context as any).accessTokenClaims?.roles ||
      (context as any).organizationRoles ||
      []
    
    const userRoles = Array.isArray(roles) ? roles : []
    const hasAdminRole = userRoles.includes("admin")
    
    // If user doesn't have admin role, redirect to unauthorized page
    if (!hasAdminRole) {
      return NextResponse.redirect(new URL("/unauthorized", request.url))
    }
  } catch (error) {
    // If there's an error checking auth, redirect to sign in
    console.error("Middleware auth check error:", error)
    const signInUrl = new URL("/api/auth/sign-in", request.url)
    signInUrl.searchParams.set("redirectTo", pathname)
    return NextResponse.redirect(signInUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
}

