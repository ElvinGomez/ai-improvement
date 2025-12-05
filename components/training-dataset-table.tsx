"use client"

import { useRouter } from "next/navigation"
import { format } from "date-fns"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { StatusDropdown } from "@/components/status-dropdown"
import type { Report } from "@/lib/api"
import { cn } from "@/lib/utils"

interface TrainingDatasetTableProps {
  reports: Report[]
  onStatusChange?: (report: Report) => void
}

export function TrainingDatasetTable({ reports, onStatusChange }: TrainingDatasetTableProps) {
  const router = useRouter()
  const trainingReports = reports.filter((r) => r.useForTraining)

  if (trainingReports.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center rounded-lg border border-border bg-card">
        <p className="text-muted-foreground">No reports marked for training yet.</p>
      </div>
    )
  }

  return (
    <div className="rounded-lg border border-border bg-card">
      <div className="overflow-x-auto lg:overflow-x-visible">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="min-w-[120px] lg:w-[10%]">Date</TableHead>
              <TableHead className="min-w-[120px] lg:w-[12%]">Category</TableHead>
              <TableHead className="min-w-[100px] lg:w-[10%]">Severity</TableHead>
              <TableHead className="min-w-[150px] lg:w-[25%]">User Message</TableHead>
              <TableHead className="min-w-[150px] lg:w-[25%]">AI Response</TableHead>
              <TableHead className="min-w-[120px] lg:w-[15%]">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {trainingReports.map((report) => (
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
                <TableCell className="lg:max-w-[120px]">
                  {report.errorCategory && (
                    <Badge variant="secondary" className="text-xs truncate block">
                      {report.errorCategory.replace(/_/g, " ")}
                    </Badge>
                  )}
                </TableCell>
                <TableCell className="lg:max-w-[100px]">
                  {report.severity && (
                    <Badge
                      variant="secondary"
                      className={cn(
                        "text-xs truncate block",
                        report.severity === "CRITICAL" && "bg-destructive/20 text-destructive",
                        report.severity === "HIGH" && "bg-chart-4/20 text-chart-4",
                        report.severity === "MEDIUM" && "bg-chart-2/20 text-chart-2",
                        report.severity === "LOW" && "bg-muted text-muted-foreground",
                      )}
                    >
                      {report.severity}
                    </Badge>
                  )}
                </TableCell>
                <TableCell className="lg:max-w-[200px]">
                  <p className="truncate text-sm">{report.userMessage}</p>
                </TableCell>
                <TableCell className="lg:max-w-[200px]">
                  {/* <p className="truncate text-sm text-muted-foreground">{report.assistantResponse}</p> */}
                </TableCell>
                <TableCell onClick={(e) => e.stopPropagation()}>
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
