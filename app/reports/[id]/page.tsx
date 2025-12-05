"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { AppHeader } from "@/components/app-header"
import { StatusBadge } from "@/components/status-badge"
import { MessageTimeline } from "@/components/message-timeline"
import { PromptGenerator } from "@/components/prompt-generator"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { fetchReportDetail, updateReportDetails, type Report, type Conversation, type Message } from "@/lib/api"
import { format } from "date-fns"
import { ArrowLeft, Calendar, Hash, MessageSquare, Save, ChevronDown, ChevronUp } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { renderContentData } from "@/components/message-timeline"

export default function ReportDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const reportId = params.id as string

  const [report, setReport] = useState<Report | null>(null)
  console.log("🚀 ~ page.tsx:28 ~ ReportDetailPage ~ report:", report)
  const [conversation, setConversation] = useState<Conversation | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  // Form state
  const [status, setStatus] = useState<Report["status"]>("PENDING")
  const [category, setCategory] = useState("")
  const [severity, setSeverity] = useState("")
  const [expectedResponse, setExpectedResponse] = useState("")
  const [reviewerNotes, setReviewerNotes] = useState("")
  const [useForTraining, setUseForTraining] = useState(false)
  const [isReportAnalysisCollapsed, setIsReportAnalysisCollapsed] = useState(true)

  useEffect(() => {
    async function loadReportDetail() {
      try {
        const data = await fetchReportDetail(reportId)
        console.log("🚀 ~ page.tsx:47 ~ loadReportDetail ~ data:", data)
        setReport(data.report)
        setConversation(data.conversation)
        setMessages(data.messages)

        // Initialize form with existing data
        setStatus(data.report.status)
        setCategory(data.report.errorCategory || "")
        setSeverity(data.report.severity || "")
        setExpectedResponse(data.report.expectedResponse || "")
        setReviewerNotes(data.report.reviewerNotes || "")
        setUseForTraining(data.report.useForTraining || false)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load report")
      } finally {
        setLoading(false)
      }
    }

    loadReportDetail()
  }, [reportId])

  const handleSave = async () => {
    if (!report) return

    setSaving(true)
    try {
      await updateReportDetails(reportId, {
        status,
        errorCategory: category,
        severity,
        expectedResponse,
        reviewerNotes,
        useForTraining,
      })

      toast({
        title: "Changes saved",
        description: "Report has been updated successfully.",
      })
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to save changes.",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex h-full flex-col">
        <AppHeader title="Report Detail" />
        <div className="flex flex-1 items-center justify-center">
          <p className="text-muted-foreground">Loading report...</p>
        </div>
      </div>
    )
  }

  if (error || !report) {
    return (
      <div className="flex h-full flex-col">
        <AppHeader title="Report Detail" />
        <div className="flex flex-1 items-center justify-center">
          <p className="text-destructive">{error || "Report not found"}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-full flex-col overflow-x-hidden">
      <AppHeader title="Report Detail" />

      <div className="flex-1 overflow-y-auto overflow-x-hidden p-4 sm:p-6">
        {/* Back Button */}
        <Button variant="ghost" size="sm" onClick={() => router.push("/reports")} className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Reports
        </Button>

        <div className="grid gap-4 sm:gap-6 lg:grid-cols-2 min-w-0">
          {/* LEFT COLUMN - Report Analysis */}
          <div className="space-y-4 sm:space-y-6 min-w-0">
            {/* Conversation Context */}
            {conversation && (
              <Card className="min-w-0">
                <CardHeader>
                  <CardTitle className="text-base sm:text-lg">Conversation Context</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-xs sm:text-sm min-w-0">
                  {conversation.title && (
                    <div>
                      <span className="text-muted-foreground">Title:</span>
                      <p className="mt-1 font-medium break-words">{conversation.title}</p>
                    </div>
                  )}
                  {conversation.status && (
                    <div>
                      <span className="text-muted-foreground">Status:</span>
                      <p className="mt-1">
                        <StatusBadge status={conversation.status as any} />
                      </p>
                    </div>
                  )}
                  <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                    <span className="text-muted-foreground">Message Count:</span>
                    <span className="font-medium">{conversation.messageCount || messages.length}</span>
                  </div>
                  {conversation.lastMessageDate && (
                    <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                      <span className="text-muted-foreground">Last Message:</span>
                      <span>{format(new Date(conversation.lastMessageDate), "MMM d, yyyy")}</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Status and Metadata */}
            <Card className="min-w-0">
              <CardHeader>
                <div className="flex items-start justify-between gap-2 sm:items-center min-w-0">
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-base sm:text-lg">Report Analysis</CardTitle>
                    <CardDescription className="text-xs sm:text-sm">Review and classify this AI failure</CardDescription>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 px-2 shrink-0"
                    onClick={() => setIsReportAnalysisCollapsed(!isReportAnalysisCollapsed)}
                  >
                    {isReportAnalysisCollapsed ? (
                      <>
                        <ChevronDown className="h-4 w-4 sm:mr-1" />
                        <span className="hidden sm:inline">Expand</span>
                      </>
                    ) : (
                      <>
                        <ChevronUp className="h-4 w-4 sm:mr-1" />
                        <span className="hidden sm:inline">Collapse</span>
                      </>
                    )}
                  </Button>
                </div>
              </CardHeader>
              {!isReportAnalysisCollapsed && (
                <CardContent className="space-y-4 min-w-0">
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select value={status} onValueChange={(value) => setStatus(value as Report["status"])}>
                    <SelectTrigger id="status">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PENDING">Pending</SelectItem>
                      <SelectItem value="RESOLVED">Resolved</SelectItem>
                      <SelectItem value="DISMISSED">Dismissed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Report Reason</Label>
                  <p className="text-sm text-muted-foreground">{report.reason}</p>
                </div>

                <div className="space-y-2">
                  <Label>User Message</Label>
                  <div className="rounded-lg bg-muted p-3 text-sm overflow-x-auto break-words">
                    {(() => {
                      // Find the reported message
                      const reportedMessage = messages.find(
                        (msg) =>
                          msg.report !== undefined ||
                          msg.generationId === report.generationId ||
                          msg.messageId === report.generationId
                      )
                      
                      // Find the user message that came before the reported message
                      if (reportedMessage) {
                        const reportedIndex = messages.indexOf(reportedMessage)
                        const userMessage = messages
                          .slice(0, reportedIndex)
                          .reverse()
                          .find((msg) => msg.role === "user")
                        
                        if (userMessage) {
                          return renderContentData(userMessage.contentData || userMessage.content)
                        }
                      }
                      
                      // Fallback to report.userMessage
                      return report.userMessage
                    })()}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>AI Response</Label>
                  <div className="rounded-lg bg-muted p-3 text-sm overflow-x-auto break-words">
                    {(() => {
                      // Find the reported message (assistant message) by generationId
                      const reportedIndex = messages.findIndex(
                        (msg) =>
                          msg.generationId === report.generationId &&
                          msg.role === "assistant"
                      )
                      
                      if (reportedIndex !== -1) {
                        const reportedMessage = messages[reportedIndex]
                        // Always use contentData if available, fallback to content
                        const result = renderContentData(reportedMessage.contentData || reportedMessage.content)
                        
                        // Also include tool result if it follows immediately after
                        if (reportedIndex + 1 < messages.length) {
                          const nextMessage = messages[reportedIndex + 1]
                          if (nextMessage.role === "tool" && nextMessage.generationId === report.generationId) {
                            return (
                              <div className="space-y-2">
                                {result}
                                {renderContentData(nextMessage.contentData || nextMessage.content)}
                              </div>
                            )
                          }
                        }
                        
                        return result
                      }
                      
                      // Fallback: try to find by report object or messageId
                      const fallbackIndex = messages.findIndex(
                        (msg) =>
                          (msg.report !== undefined || msg.messageId === report.generationId) &&
                          msg.role === "assistant"
                      )
                      
                      if (fallbackIndex !== -1) {
                        const reportedMessage = messages[fallbackIndex]
                        return renderContentData(reportedMessage.contentData || reportedMessage.content)
                      }
                      
                      // Last resort: use report.assistantResponse
                      return renderContentData(report.assistantResponse)
                    })()}
                  </div>
                </div>
                </CardContent>
              )}
            </Card>

            {/* Metadata Card */}
            <Card className="min-w-0">
              <CardHeader>
                <CardTitle className="text-base sm:text-lg">Metadata</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm min-w-0">
                <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <Hash className="h-4 w-4 text-muted-foreground shrink-0" />
                    <span className="text-muted-foreground shrink-0">Report ID:</span>
                  </div>
                  <span className="font-mono text-xs break-all sm:text-sm">{report._id}</span>
                </div>
                <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <MessageSquare className="h-4 w-4 text-muted-foreground shrink-0" />
                    <span className="text-muted-foreground shrink-0">Conversation ID:</span>
                  </div>
                  <span className="font-mono text-xs break-all sm:text-sm">{report.conversationId}</span>
                </div>
                <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <Hash className="h-4 w-4 text-muted-foreground shrink-0" />
                    <span className="text-muted-foreground shrink-0">Generation ID:</span>
                  </div>
                  <span className="font-mono text-xs break-all sm:text-sm">{report.generationId}</span>
                </div>
                <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <Calendar className="h-4 w-4 text-muted-foreground shrink-0" />
                    <span className="text-muted-foreground shrink-0">Created:</span>
                  </div>
                  <span className="text-xs sm:text-sm">{format(new Date(report.createdAt), "MMM d, yyyy 'at' h:mm a")}</span>
                </div>
                <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <Calendar className="h-4 w-4 text-muted-foreground shrink-0" />
                    <span className="text-muted-foreground shrink-0">Updated:</span>
                  </div>
                  <span className="text-xs sm:text-sm">{format(new Date(report.updatedAt), "MMM d, yyyy 'at' h:mm a")}</span>
                </div>
              </CardContent>
            </Card>

            {/* Refinement Fields */}
            <Card className="min-w-0">
              <CardHeader>
                <CardTitle className="text-base sm:text-lg">Classification</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 min-w-0">
                <div className="space-y-2">
                  <Label htmlFor="category">Error Category</Label>
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger id="category">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="OFF_TOPIC">Off Topic</SelectItem>
                      <SelectItem value="VERY_GENERIC">Very Generic</SelectItem>
                      <SelectItem value="HALLUCINATION">Hallucination</SelectItem>
                      <SelectItem value="POLICY_VIOLATION">Policy Violation</SelectItem>
                      <SelectItem value="LANGUAGE_ISSUE">Language Issue</SelectItem>
                      <SelectItem value="TOOL_MISUSE">Tool Misuse</SelectItem>
                      <SelectItem value="OTHER">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="severity">Severity</Label>
                  <Select value={severity} onValueChange={setSeverity}>
                    <SelectTrigger id="severity">
                      <SelectValue placeholder="Select severity" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="LOW">Low</SelectItem>
                      <SelectItem value="MEDIUM">Medium</SelectItem>
                      <SelectItem value="HIGH">High</SelectItem>
                      <SelectItem value="CRITICAL">Critical</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="expected">Expected Response</Label>
                  <Textarea
                    id="expected"
                    placeholder="Describe what the ideal response should have been..."
                    value={expectedResponse}
                    onChange={(e) => setExpectedResponse(e.target.value)}
                    rows={5}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">Internal Reviewer Notes</Label>
                  <Textarea
                    id="notes"
                    placeholder="Add internal notes about this case..."
                    value={reviewerNotes}
                    onChange={(e) => setReviewerNotes(e.target.value)}
                    rows={4}
                  />
                </div>

                <div className="flex flex-col gap-3 rounded-lg border border-border p-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="space-y-0.5 flex-1 min-w-0">
                    <Label htmlFor="training">Use for Training</Label>
                    <p className="text-xs sm:text-sm text-muted-foreground">Include this case in the training dataset</p>
                  </div>
                  <Switch id="training" checked={useForTraining} onCheckedChange={setUseForTraining} className="shrink-0" />
                </div>
              </CardContent>
            </Card>

            {/* Save Button */}
            <Button onClick={handleSave} disabled={saving} className="w-full" size="lg">
              <Save className="mr-2 h-4 w-4" />
              <span className="text-sm sm:text-base">{saving ? "Saving..." : "Save Changes"}</span>
            </Button>
          </div>

          {/* RIGHT COLUMN - Conversation Timeline */}
          <div className="space-y-4 sm:space-y-6 min-w-0">
            {/* Message Timeline */}
            <Card className="min-w-0">
              <CardHeader>
                <CardTitle className="text-base sm:text-lg">Message Timeline</CardTitle>
                <CardDescription className="text-xs sm:text-sm">Full conversation history with reported message highlighted</CardDescription>
              </CardHeader>
              <CardContent className="max-h-[400px] sm:max-h-[600px] overflow-y-auto overflow-x-hidden min-w-0">
                <MessageTimeline messages={messages} reportedGenerationId={report.generationId} />
              </CardContent>
            </Card>

            {/* AI Prompt Generator */}
            <PromptGenerator
              report={report}
              messages={messages}
              category={category}
              severity={severity}
              expectedResponse={expectedResponse}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
