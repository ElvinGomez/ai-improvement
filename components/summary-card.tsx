import { Card, CardContent } from "@/components/ui/card"
import type { LucideIcon } from "lucide-react"

interface SummaryCardProps {
  title: string
  value: number | string
  icon: LucideIcon
  description?: string
}

export function SummaryCard({ title, value, icon: Icon, description }: SummaryCardProps) {
  return (
    <Card className="transition-all hover:shadow-md hover:border-primary/20">
      <CardContent className="p-4 sm:p-6">
        <div className="flex items-center justify-between gap-2">
          <div className="space-y-1 min-w-0 flex-1">
            <p className="text-xs sm:text-sm font-medium text-muted-foreground truncate">{title}</p>
            <p className="text-2xl sm:text-3xl font-semibold text-foreground">{value}</p>
            {description && <p className="text-xs text-muted-foreground line-clamp-1">{description}</p>}
          </div>
          <div className="rounded-lg bg-primary/10 p-2 sm:p-3 shrink-0 transition-colors hover:bg-primary/20">
            <Icon className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
