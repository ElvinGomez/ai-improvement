import type { Report } from "./api"

export function exportToCSV(reports: Report[]): string {
  const headers = [
    "conversationId",
    "generationId",
    "userMessage",
    "assistantResponse",
    "expectedResponse",
    "category",
    "severity",
    "status",
    "createdAt",
  ]

  const rows = reports.map((report) => [
    report.conversationId,
    report.generationId,
    `"${(report.userMessage || "").replace(/"/g, '""')}"`,
    `"${(report.assistantResponse || "").replace(/"/g, '""')}"`,
    `"${(report.expectedResponse || "").replace(/"/g, '""')}"`,
    report.errorCategory || "",
    report.severity || "",
    report.status,
    report.createdAt,
  ])

  const csvContent = [headers.join(","), ...rows.map((row) => row.join(","))].join("\n")

  return csvContent
}

export function exportToJSON(reports: Report[]): string {
  const exportData = reports.map((report) => ({
    conversationId: report.conversationId,
    generationId: report.generationId,
    userMessage: report.userMessage,
    assistantResponse: report.assistantResponse,
    expectedResponse: report.expectedResponse || "",
    category: report.errorCategory || "",
    severity: report.severity || "",
    status: report.status,
    createdAt: report.createdAt,
  }))

  return JSON.stringify(exportData, null, 2)
}

export function downloadFile(content: string, filename: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType })
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}
