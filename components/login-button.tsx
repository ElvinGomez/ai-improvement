"use client"

import { Button } from "@/components/ui/button"
import { useLogtoUser } from "@/hooks/use-logto"
import { LogIn, LogOut, User } from "lucide-react"

export function LoginButton() {
  const { isAuthenticated, isLoading, signIn, signOut, user } = useLogtoUser()

  if (isLoading) {
    return (
      <Button variant="ghost" size="sm" disabled>
        Loading...
      </Button>
    )
  }

  if (!isAuthenticated) {
    return (
      <Button variant="default" size="sm" onClick={() => signIn()}>
        <LogIn className="mr-2 h-4 w-4" />
        Sign In
      </Button>
    )
  }

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-2 text-sm">
        <User className="h-4 w-4" />
        <span className="hidden sm:inline">
          {(user as any)?.name || (user as any)?.email || "User"}
        </span>
      </div>
      <Button variant="ghost" size="sm" onClick={() => signOut()}>
        <LogOut className="mr-2 h-4 w-4" />
        <span className="hidden sm:inline">Sign Out</span>
      </Button>
    </div>
  )
}

