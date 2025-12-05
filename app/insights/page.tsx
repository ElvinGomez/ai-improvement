"use client"

import { useEffect, useState } from "react"
import { AppHeader } from "@/components/app-header"
import { SummaryCard } from "@/components/summary-card"
import { ReportsByDayChart } from "@/components/charts/reports-by-day-chart"
import { StatusDistributionChart } from "@/components/charts/status-distribution-chart"
import { CategoryDistributionChart } from "@/components/charts/category-distribution-chart"
import { TrainingDatasetTable } from "@/components/training-dataset-table"
import { ExportButton } from "@/components/export-button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { fetchReports, type Report } from "@/lib/api"
import { subDays } from "date-fns"
import { Activity, AlertTriangle, Database, TrendingUp } from "lucide-react"

export default function InsightsPage() {
  const [reports, setReports] = useState<Report[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadReports() {
      try {
        const data = await fetchReports()
        setReports(data.reports)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load reports")
      } finally {
        setLoading(false)
      }
    }

    loadReports()
  }, [])

  if (loading) {
    return (
      <div className="flex h-full flex-col">
        <AppHeader title="Insights" />
        <div className="flex flex-1 items-center justify-center">
          <p className="text-muted-foreground">Loading insights...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex h-full flex-col">
        <AppHeader title="Insights" />
        <div className="flex flex-1 items-center justify-center">
          <p className="text-destructive">{error}</p>
        </div>
      </div>
    )
  }

  // Calculate metrics
  const last7DaysReports = reports.filter((r) => new Date(r.createdAt) >= subDays(new Date(), 7)).length

  const pendingCount = reports.filter((r) => r.status === "PENDING").length
  const totalCount = reports.length
  const pendingPercentage = totalCount > 0 ? Math.round((pendingCount / totalCount) * 100) : 0

  const categoryCounts = reports.reduce(
    (acc, r) => {
      if (r.errorCategory) {
        acc[r.errorCategory] = (acc[r.errorCategory] || 0) + 1
      }
      return acc
    },
    {} as Record<string, number>,
  )

  const topCategory = Object.entries(categoryCounts).sort((a, b) => b[1] - a[1])[0]
  const topCategoryName = topCategory ? topCategory[0].replace(/_/g, " ") : "None"

  const trainingMarkedCount = reports.filter((r) => r.useForTraining).length

  return (
    <div className="flex h-full flex-col">
      <AppHeader title="Insights & Model Improvement" />

      <div className="flex-1 space-y-4 overflow-auto p-4 sm:space-y-6 sm:p-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <SummaryCard
            title="Reports Last 7 Days"
            value={last7DaysReports}
            icon={Activity}
            description="Recent activity"
          />
          <SummaryCard
            title="Pending Rate"
            value={`${pendingPercentage}%`}
            icon={TrendingUp}
            description={`${pendingCount} of ${totalCount} reports`}
          />
          <SummaryCard
            title="Top Error Category"
            value={topCategoryName}
            icon={AlertTriangle}
            description="Most common issue"
          />
          <SummaryCard
            title="Training Dataset"
            value={trainingMarkedCount}
            icon={Database}
            description="Reports marked for training"
          />
        </div>

        {/* Charts */}
        <div className="grid gap-6 lg:grid-cols-2">
          <ReportsByDayChart reports={reports} />
          <StatusDistributionChart reports={reports} />
        </div>

        <CategoryDistributionChart reports={reports} />

        {/* Training Dataset */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Training Dataset</CardTitle>
                <CardDescription>Reports marked for AI fine-tuning and model improvement</CardDescription>
              </div>
              <ExportButton reports={reports} />
            </div>
          </CardHeader>
          <CardContent>
            <TrainingDatasetTable
              reports={reports}
              onStatusChange={(updatedReport) => {
                // Update the report in the reports array
                setReports((prev) =>
                  prev.map((r) => (r._id === updatedReport._id ? updatedReport : r))
                )
              }}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
