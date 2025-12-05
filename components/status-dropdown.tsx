"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { StatusBadge } from "@/components/status-badge"
import { updateReportStatus } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"
import { ChevronDown } from "lucide-react"
import type { Report } from "@/lib/api"

interface StatusDropdownProps {
  report: Report
  onStatusChange?: (report: Report) => void
}

export function StatusDropdown({ report, onStatusChange }: StatusDropdownProps) {
  const [isUpdating, setIsUpdating] = useState(false)
  const { toast } = useToast()

  const handleStatusChange = async (newStatus: Report["status"]) => {
    if (newStatus === report.status || isUpdating) return

    setIsUpdating(true)
    try {
      const updatedReport = await updateReportStatus(report._id, newStatus)
      onStatusChange?.(updatedReport)
      toast({
        title: "Status updated",
        description: `Report status changed to ${newStatus}`,
      })
    } catch (error) {
      toast({
        title: "Failed to update status",
        description: "An error occurred while updating the report status.",
        variant: "destructive",
      })
    } finally {
      setIsUpdating(false)
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" disabled={isUpdating} className="h-auto p-1">
          <StatusBadge status={report.status} />
          <ChevronDown className="ml-1 h-3 w-3 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          onClick={() => handleStatusChange("PENDING")}
          disabled={report.status === "PENDING" || isUpdating}
          className="cursor-pointer"
        >
          <StatusBadge status="PENDING" />
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => handleStatusChange("RESOLVED")}
          disabled={report.status === "RESOLVED" || isUpdating}
          className="cursor-pointer"
        >
          <StatusBadge status="RESOLVED" />
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => handleStatusChange("DISMISSED")}
          disabled={report.status === "DISMISSED" || isUpdating}
          className="cursor-pointer"
        >
          <StatusBadge status="DISMISSED" />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

