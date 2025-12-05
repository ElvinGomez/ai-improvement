"use client"

import { useEffect, useState } from "react"
import { AppHeader } from "@/components/app-header"
import { SummaryCard } from "@/components/summary-card"
import { ReportsTable } from "@/components/reports-table"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { fetchReports, type Report } from "@/lib/api"
import { AlertCircle, CheckCircle2, FileText, XCircle } from "lucide-react"

export default function ReportsPage() {
  const [reports, setReports] = useState<Report[]>([])
  const [filteredReports, setFilteredReports] = useState<Report[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState<"date" | "status" | null>(null)
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")

  useEffect(() => {
    async function loadReports() {
      try {
        const data = await fetchReports()
        setReports(data.reports)
        setFilteredReports(data.reports)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load reports")
      } finally {
        setLoading(false)
      }
    }

    loadReports()
  }, [])

  useEffect(() => {
    let filtered = reports

    // Apply status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((report) => report.status === statusFilter)
    }

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (report) =>
          report.userMessage.toLowerCase().includes(query) ||
          report.assistantResponse.toLowerCase().includes(query) ||
          report.reason.toLowerCase().includes(query),
      )
    }

    // Apply sorting
    if (sortBy) {
      filtered = [...filtered].sort((a, b) => {
        if (sortBy === "date") {
          const dateA = new Date(a.createdAt).getTime()
          const dateB = new Date(b.createdAt).getTime()
          return sortOrder === "asc" ? dateA - dateB : dateB - dateA
        } else if (sortBy === "status") {
          const statusOrder = { PENDING: 0, RESOLVED: 1, DISMISSED: 2 }
          const statusA = statusOrder[a.status]
          const statusB = statusOrder[b.status]
          return sortOrder === "asc" ? statusA - statusB : statusB - statusA
        }
        return 0
      })
    }

    setFilteredReports(filtered)
  }, [statusFilter, searchQuery, reports, sortBy, sortOrder])

  const totalReports = reports.length
  const pendingReports = reports.filter((r) => r.status === "PENDING").length
  const resolvedReports = reports.filter((r) => r.status === "RESOLVED").length
  const dismissedReports = reports.filter((r) => r.status === "DISMISSED").length

  if (loading) {
    return (
      <div className="flex h-full flex-col">
        <AppHeader title="Reports" />
        <div className="flex flex-1 items-center justify-center">
          <p className="text-muted-foreground">Loading reports...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex h-full flex-col">
        <AppHeader title="Reports" />
        <div className="flex flex-1 items-center justify-center">
          <p className="text-destructive">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-full flex-col">
      <AppHeader
        title="Reports"
        searchPlaceholder="Search messages, responses, or reasons..."
        onSearch={setSearchQuery}
      />

      <div className="flex-1 space-y-4 p-4 sm:space-y-6 sm:p-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <SummaryCard title="Total Reports" value={totalReports} icon={FileText} />
          <SummaryCard title="Pending" value={pendingReports} icon={AlertCircle} />
          <SummaryCard title="Resolved" value={resolvedReports} icon={CheckCircle2} />
          <SummaryCard title="Dismissed" value={dismissedReports} icon={XCircle} />
        </div>

        {/* Status Filter Tabs */}
        <Tabs value={statusFilter} onValueChange={setStatusFilter}>
          <div className="overflow-x-auto">
            <TabsList className="w-full sm:w-fit">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="PENDING">Pending</TabsTrigger>
              <TabsTrigger value="RESOLVED">Resolved</TabsTrigger>
              <TabsTrigger value="DISMISSED">Dismissed</TabsTrigger>
            </TabsList>
          </div>
        </Tabs>

        {/* Reports Table */}
        <ReportsTable
          reports={filteredReports}
          sortBy={sortBy}
          sortOrder={sortOrder}
          onSort={(field) => {
            if (sortBy === field) {
              setSortOrder(sortOrder === "asc" ? "desc" : "asc")
            } else {
              setSortBy(field)
              setSortOrder("desc")
            }
          }}
          onStatusChange={(updatedReport) => {
            // Update the report in the reports array
            setReports((prev) =>
              prev.map((r) => (r._id === updatedReport._id ? updatedReport : r))
            )
          }}
        />
      </div>
    </div>
  )
}
