"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import type { Report } from "@/lib/api"
import { exportToCSV, exportToJSON, downloadFile } from "@/lib/export"
import { Download, FileJson, FileSpreadsheet } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface ExportButtonProps {
  reports: Report[]
  filename?: string
}

export function ExportButton({ reports, filename = "training-dataset" }: ExportButtonProps) {
  const { toast } = useToast()
  const [exporting, setExporting] = useState(false)

  const handleExport = async (format: "csv" | "json") => {
    setExporting(true)

    try {
      // Filter only reports marked for training
      const trainingReports = reports.filter((r) => r.useForTraining)

      if (trainingReports.length === 0) {
        toast({
          title: "No training data",
          description: "No reports are marked for training export.",
          variant: "destructive",
        })
        return
      }

      if (format === "csv") {
        const csvContent = exportToCSV(trainingReports)
        downloadFile(csvContent, `${filename}.csv`, "text/csv")
      } else {
        const jsonContent = exportToJSON(trainingReports)
        downloadFile(jsonContent, `${filename}.json`, "application/json")
      }

      toast({
        title: "Export successful",
        description: `Exported ${trainingReports.length} training reports as ${format.toUpperCase()}.`,
      })
    } catch (error) {
      toast({
        title: "Export failed",
        description: "An error occurred while exporting the data.",
        variant: "destructive",
      })
    } finally {
      setExporting(false)
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button disabled={exporting}>
          <Download className="mr-2 h-4 w-4" />
          {exporting ? "Exporting..." : "Export for Training"}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => handleExport("csv")}>
          <FileSpreadsheet className="mr-2 h-4 w-4" />
          Export as CSV
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleExport("json")}>
          <FileJson className="mr-2 h-4 w-4" />
          Export as JSON
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
