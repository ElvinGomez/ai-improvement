import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface StatusBadgeProps {
  status: "PENDING" | "RESOLVED" | "DISMISSED"
}

export function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <Badge
      variant="secondary"
      className={cn(
        "font-medium",
        status === "PENDING" && "bg-chart-4/20 text-chart-4 hover:bg-chart-4/30",
        status === "RESOLVED" && "bg-chart-3/20 text-chart-3 hover:bg-chart-3/30",
        status === "DISMISSED" && "bg-muted text-muted-foreground hover:bg-muted",
      )}
    >
      {status}
    </Badge>
  )
}
