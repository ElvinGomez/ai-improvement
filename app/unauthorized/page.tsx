"use client"

import { useLogtoUser } from "@/hooks/use-logto"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ShieldX } from "lucide-react"

export default function UnauthorizedPage() {
  const { signOut } = useLogtoUser()

  return (
    <div className="flex h-screen items-center justify-center p-4">
      <Card className="w-full max-w-sm">
        <CardContent className="pt-6">
          <div className="flex flex-col items-center space-y-4 text-center">
            <ShieldX className="h-8 w-8 text-destructive" />
            <h2 className="text-lg font-semibold">Access Denied</h2>
            <Button onClick={signOut} variant="outline" className="w-full">
              Sign Out
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

