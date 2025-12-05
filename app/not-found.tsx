import { Card, CardContent } from "@/components/ui/card"
import { FileQuestion } from "lucide-react"

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-sm">
        <CardContent className="pt-6">
          <div className="flex flex-col items-center space-y-4 text-center">
            <FileQuestion className="h-8 w-8 text-muted-foreground" />
            <div className="space-y-2">
              <h2 className="text-lg font-semibold">Page Not Found</h2>
              <p className="text-sm text-muted-foreground">The page you're looking for doesn't exist.</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

