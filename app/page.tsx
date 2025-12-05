"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useLogtoUser } from "@/hooks/use-logto"
import { LogIn, Shield } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function HomePage() {
  const { isAuthenticated, isLoading, isAdmin, signIn } = useLogtoUser()
  const router = useRouter()

  useEffect(() => {
    // If user is authenticated and has admin role, redirect to reports
    if (!isLoading && isAuthenticated && isAdmin) {
      router.push("/reports")
    }
  }, [isAuthenticated, isLoading, isAdmin, router])

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    )
  }

  // If authenticated and admin, show loading while redirecting
  if (isAuthenticated && isAdmin) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-muted-foreground">Redirecting...</p>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardContent className="pt-6">
          <div className="flex flex-col items-center space-y-6 text-center">
            <div className="flex items-center gap-2">
              <Shield className="h-6 w-6 text-primary" />
              <h1 className="text-2xl font-semibold">AI Reports</h1>
            </div>

            {!isAuthenticated ? (
              <>
                <p className="text-sm text-muted-foreground">
                  Sign in to access the dashboard
                </p>
                <Button onClick={() => signIn("/reports")} className="w-full" size="lg">
                  <LogIn className="mr-2 h-4 w-4" />
                  Sign In
                </Button>
              </>
            ) : (
              <div className="space-y-2">
                <Shield className="h-8 w-8 text-destructive mx-auto" />
                <p className="text-sm font-medium text-destructive">Access Denied</p>
                <p className="text-xs text-muted-foreground">
                  Admin role required
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

