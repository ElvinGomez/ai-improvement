"use client"

import { useRouter } from "next/navigation"
import { format } from "date-fns"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { StatusBadge } from "@/components/status-badge"
import { StatusDropdown } from "@/components/status-dropdown"
import type { Report } from "@/lib/api"
import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react"
import { cn } from "@/lib/utils"

interface ReportsTableProps {
  reports: Report[]
  sortBy?: "date" | "status" | null
  sortOrder?: "asc" | "desc"
  onSort?: (field: "date" | "status") => void
  onStatusChange?: (report: Report) => void
}

export function ReportsTable({ reports, sortBy, sortOrder, onSort, onStatusChange }: ReportsTableProps) {
  const router = useRouter()

  const SortIcon = ({ field }: { field: "date" | "status" }) => {
    if (sortBy !== field) {
      return <ArrowUpDown className="ml-1 h-3 w-3 opacity-50" />
    }
    return sortOrder === "asc" ? (
      <ArrowUp className="ml-1 h-3 w-3" />
    ) : (
      <ArrowDown className="ml-1 h-3 w-3" />
    )
  }

  if (reports.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center rounded-lg border border-border bg-card">
        <p className="text-muted-foreground">No reports available yet.</p>
      </div>
    )
  }

  return (
    <div className="rounded-lg border border-border bg-card">
      <div className="overflow-x-auto lg:overflow-x-visible">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead
                className={cn(
                  "min-w-[120px] lg:w-[10%]",
                  onSort && "cursor-pointer hover:bg-muted/50 select-none"
                )}
                onClick={() => onSort?.("date")}
              >
                <div className="flex items-center">
                  Date
                  {onSort && <SortIcon field="date" />}
                </div>
              </TableHead>
              <TableHead className="min-w-[100px] lg:w-[10%]">User ID</TableHead>
              <TableHead className="min-w-[150px] lg:w-[20%]">User Message</TableHead>
              <TableHead className="min-w-[150px] lg:w-[20%]">AI Response</TableHead>
              <TableHead className="min-w-[120px] lg:w-[15%]">Reason</TableHead>
              <TableHead
                className={cn(
                  "min-w-[100px] lg:w-[10%]",
                  onSort && "cursor-pointer hover:bg-muted/50 select-none"
                )}
                onClick={(e) => {
                  e.stopPropagation()
                  onSort?.("status")
                }}
              >
                <div className="flex items-center">
                  Status
                  {onSort && <SortIcon field="status" />}
                </div>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {reports.map((report) => (
              <TableRow
                key={report._id}
                onClick={() => {
                  router.push(`/reports/${report._id}`)
                }}
              >
                <TableCell className="text-sm text-muted-foreground lg:max-w-[120px]">
                  <span className="whitespace-nowrap lg:whitespace-normal">
                    {format(new Date(report.createdAt), "MMM d, yyyy")}
                  </span>
                </TableCell>
                <TableCell className="text-sm font-mono lg:max-w-[100px]">
                  <span className="whitespace-nowrap lg:whitespace-normal truncate block">
                    {report.userId.length > 10 ? `${report.userId.slice(0, 10)}...` : report.userId}
                  </span>
                </TableCell>
                <TableCell className="lg:max-w-[200px]">
                  <p className="truncate text-sm">{report.userMessage}</p>
                </TableCell>
                <TableCell className="lg:max-w-[200px]">
                  <p className="truncate text-sm text-muted-foreground">{report.assistantResponse}</p>
                </TableCell>
                <TableCell className="text-sm lg:max-w-[150px]">
                  <p className="truncate">{report.reason}</p>
                </TableCell>
                <TableCell className="lg:max-w-[120px]" onClick={(e) => e.stopPropagation()}>
                  <StatusDropdown report={report} onStatusChange={onStatusChange} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
