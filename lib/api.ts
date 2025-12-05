const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || ""

export interface Report {
  _id: string
  conversationId: string
  generationId: string
  userId: string
  userMessage: string
  assistantResponse: string
  reason: string
  status: "PENDING" | "RESOLVED" | "DISMISSED"
  createdAt: string
  updatedAt: string
  errorCategory?: string
  severity?: string
  expectedResponse?: string
  reviewerNotes?: string
  useForTraining?: boolean
}

export interface ReportsResponse {
  reports: Report[]
  count: number
}

export type ContentDataItem =
  | { type: "text"; text: string }
  | {
      type: "tool-call"
      toolCallId: string
      toolName: string
      input: Record<string, unknown>
    }
  | {
      type: "tool-result"
      toolCallId: string
      toolName: string
      output: { type: string; value: unknown }
    }

export interface Message {
  role: "system" | "user" | "assistant" | "tool"
  content: string
  contentData?: string | ContentDataItem[]
  timestamp?: string
  messageId?: string
  generationId?: string
  id?: string
  report?: {
    _id: string
    comment?: string
    status?: string
    userId?: string
    createdAt?: string
    updatedAt?: string
  }
  createdAt?: string
  updatedAt?: string
}

export interface Conversation {
  _id: string
  title?: string
  status?: string
  messageCount?: number
  lastMessageDate?: string
}

export interface ReportDetailResponse {
  report: Report
  conversation: Conversation
  messages: Message[]
}

export async function fetchReports(): Promise<ReportsResponse> {
  const response = await fetch(`${API_BASE_URL}/v1/response-reports`, {
    cache: "no-store",
  })

  if (!response.ok) {
    throw new Error("Failed to fetch reports")
  }

  return response.json()
}

export async function fetchReportDetail(id: string): Promise<ReportDetailResponse> {
  const response = await fetch(`${API_BASE_URL}/v1/response-reports/${id}`, {
    cache: "no-store",
  })

  if (!response.ok) {
    throw new Error("Failed to fetch report detail")
  }

  return response.json()
}

export async function updateReportStatus(id: string, status: Report["status"]): Promise<Report> {
  const response = await fetch(`${API_BASE_URL}/v1/response-reports/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ status }),
  })

  if (!response.ok) {
    throw new Error("Failed to update report status")
  }

  return response.json()
}

export async function updateReportDetails(id: string, data: Partial<Report>): Promise<Report> {
  const response = await fetch(`${API_BASE_URL}/v1/response-reports/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    throw new Error("Failed to update report")
  }

  return response.json()
}
