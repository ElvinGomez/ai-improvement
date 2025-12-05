"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useLogtoUser } from "@/hooks/use-logto"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ShieldX } from "lucide-react"

interface AdminGuardProps {
  children: React.ReactNode
}

export function AdminGuard({ children }: AdminGuardProps) {
  const { isAuthenticated, isLoading, isAdmin } = useLogtoUser()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/api/auth/sign-in")
    } else if (!isLoading && isAuthenticated && !isAdmin) {
      router.push("/unauthorized")
    }
  }, [isAuthenticated, isLoading, isAdmin, router])

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  if (!isAdmin) {
    return (
      <div className="flex h-screen items-center justify-center p-4">
        <Card className="w-full max-w-sm">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center space-y-2 text-center">
              <ShieldX className="h-6 w-6 text-destructive" />
              <p className="text-sm font-medium">Access Denied</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return <>{children}</>
}

