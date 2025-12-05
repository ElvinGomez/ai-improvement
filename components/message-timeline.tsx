"use client"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import type { Message, ContentDataItem } from "@/lib/api"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { Bot, Code2, Settings2, User, ChevronDown, ChevronUp, Copy, Check } from "lucide-react"
import ReactMarkdown from "react-markdown"
import { useState, useMemo } from "react"

export function renderContentData(contentData: string | ContentDataItem[] | undefined) {
  if (!contentData) return null

  // If it's a string, render it as markdown
  if (typeof contentData === "string") {
    return (
      <div className="prose prose-sm dark:prose-invert max-w-none break-words">
        <ReactMarkdown>{contentData}</ReactMarkdown>
      </div>
    )
  }

  // If it's an array, render each item
  if (Array.isArray(contentData)) {
    return (
      <div className="space-y-2">
        {contentData.map((item, index) => {
          if (typeof item === "string") {
            return (
              <div key={index} className="prose prose-sm dark:prose-invert max-w-none break-words overflow-wrap-anywhere">
                <ReactMarkdown>{item}</ReactMarkdown>
              </div>
            )
          }

          switch (item.type) {
            case "text":
              return (
                <div key={index} className="prose prose-sm dark:prose-invert max-w-none break-words overflow-wrap-anywhere">
                  <ReactMarkdown>{item.text}</ReactMarkdown>
                </div>
              )
            case "tool-call":
              return (
                <div key={index} className="rounded bg-muted p-2 break-words">
                  <div className="mb-2 font-semibold break-words">Tool Call: {item.toolName}</div>
                  <div className="prose prose-sm dark:prose-invert max-w-none break-words overflow-x-auto">
                    <ReactMarkdown>
                      {`\`\`\`json\n${JSON.stringify(item.input, null, 2)}\n\`\`\``}
                    </ReactMarkdown>
                  </div>
                </div>
              )
            case "tool-result":
              return (
                <div key={index} className="rounded bg-muted p-2 break-words">
                  <div className="mb-2 font-semibold break-words">Tool Result: {item.toolName}</div>
                  <div className="prose prose-sm dark:prose-invert max-w-none break-words overflow-x-auto">
                    <ReactMarkdown>
                      {`\`\`\`json\n${JSON.stringify(item.output.value, null, 2)}\n\`\`\``}
                    </ReactMarkdown>
                  </div>
                </div>
              )
            default:
              return (
                <div key={index} className="prose prose-sm dark:prose-invert max-w-none break-words overflow-x-auto">
                  <ReactMarkdown>
                    {`\`\`\`json\n${JSON.stringify(item, null, 2)}\n\`\`\``}
                  </ReactMarkdown>
                </div>
              )
          }
        })}
      </div>
    )
  }

  return (
    <div className="prose prose-sm dark:prose-invert max-w-none break-words overflow-wrap-anywhere">
      <ReactMarkdown>{String(contentData)}</ReactMarkdown>
    </div>
  )
}

interface MessageTimelineProps {
  messages: Message[]
  reportedGenerationId?: string
}

export function MessageTimeline({ messages, reportedGenerationId }: MessageTimelineProps) {
  // Initialize all system messages as collapsed by default
  const initialCollapsedSystemMessages = useMemo(() => {
    const collapsed = new Set<string>()
    messages.forEach((message, index) => {
      if (message.role === "system") {
        const messageId = message.messageId || message.generationId || message.id || `message-${index}`
        collapsed.add(messageId)
      }
    })
    return collapsed
  }, [messages])

  const [collapsedSystemMessages, setCollapsedSystemMessages] = useState<Set<string>>(initialCollapsedSystemMessages)
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null)

  const toggleSystemMessage = (messageId: string) => {
    setCollapsedSystemMessages((prev) => {
      const next = new Set(prev)
      if (next.has(messageId)) {
        next.delete(messageId)
      } else {
        next.add(messageId)
      }
      return next
    })
  }

  const getMessageId = (message: Message, index: number) => {
    return message.messageId || message.generationId || message.id || `message-${index}`
  }

  const getMessageText = (message: Message): string => {
    // If contentData is a string, use it
    if (typeof message.contentData === "string") {
      return message.contentData
    }
    
    // If contentData is an array, extract text from it
    if (Array.isArray(message.contentData)) {
      return message.contentData
        .map((item) => {
          if (typeof item === "string") return item
          if (item.type === "text") return item.text
          if (item.type === "tool-call") {
            return `Tool Call: ${item.toolName}\n${JSON.stringify(item.input, null, 2)}`
          }
          if (item.type === "tool-result") {
            return `Tool Result: ${item.toolName}\n${JSON.stringify(item.output.value, null, 2)}`
          }
          return JSON.stringify(item, null, 2)
        })
        .join("\n\n")
    }
    
    // Fallback to content
    return message.content || ""
  }

  const handleCopy = async (message: Message, messageId: string) => {
    const text = getMessageText(message)
    try {
      await navigator.clipboard.writeText(text)
      setCopiedMessageId(messageId)
      setTimeout(() => setCopiedMessageId(null), 2000)
    } catch (err) {
      console.error("Failed to copy:", err)
    }
  }

  return (
    <div className="space-y-4">
      {messages.map((message, index) => {
        // Check if this message has a nested report object (indicating it was reported)
        // or if the message's generationId matches the reported generationId
        const isReported = reportedGenerationId && (
          message.report !== undefined ||
          message.generationId === reportedGenerationId || 
          message.id === reportedGenerationId ||
          message.messageId === reportedGenerationId
        )

        const messageId = getMessageId(message, index)
        const isSystem = message.role === "system"
        const isCollapsed = isSystem && collapsedSystemMessages.has(messageId)
        
        // Get preview text for collapsed system messages
        const content = typeof message.contentData === "string" 
          ? message.contentData 
          : message.content || ""
        const preview = content.substring(0, 150) + (content.length > 150 ? "..." : "")

        return (
          <div
            key={messageId}
            className={cn(
              "relative min-w-0",
              message.role === "user" && "mr-0 sm:mr-8",
              (message.role === "assistant" || message.role === "tool") && "ml-0 sm:ml-8",
              message.role === "system" && "mx-0 sm:mx-8",
            )}
          >
            <Card className={cn(
              isReported && "border-destructive border-2 ring-2 ring-destructive/30 bg-destructive/5",
              "overflow-hidden min-w-0"
            )}>
              <CardContent className="p-4 overflow-hidden min-w-0">
                <div className="mb-2 flex items-center justify-between gap-2 min-w-0">
                  <div className="flex items-center gap-2 min-w-0 flex-1">
                    {message.role === "user" && (
                      <>
                        <User className="h-4 w-4 text-primary" />
                        <span className="text-sm font-medium">User</span>
                      </>
                    )}
                    {message.role === "assistant" && (
                      <>
                        <Bot className="h-4 w-4 text-chart-1" />
                        <span className="text-sm font-medium">Assistant</span>
                      </>
                    )}
                    {message.role === "system" && (
                      <>
                        <Settings2 className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium text-muted-foreground">System</span>
                      </>
                    )}
                    {message.role === "tool" && (
                      <>
                        <Code2 className="h-4 w-4 text-chart-3" />
                        <span className="text-sm font-medium">Tool</span>
                      </>
                    )}
                  </div>
                  <div className="flex items-center gap-1 sm:gap-2 shrink-0">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0 shrink-0"
                      onClick={() => handleCopy(message, messageId)}
                      title="Copy message"
                    >
                      {copiedMessageId === messageId ? (
                        <Check className="h-3 w-3 text-green-600" />
                      ) : (
                        <Copy className="h-3 w-3" />
                      )}
                    </Button>
                    {isSystem && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 px-1 sm:px-2 text-xs shrink-0"
                        onClick={() => toggleSystemMessage(messageId)}
                      >
                        {isCollapsed ? (
                          <>
                            <ChevronDown className="h-3 w-3 sm:mr-1" />
                            <span className="hidden sm:inline">Expand</span>
                          </>
                        ) : (
                          <>
                            <ChevronUp className="h-3 w-3 sm:mr-1" />
                            <span className="hidden sm:inline">Collapse</span>
                          </>
                        )}
                      </Button>
                    )}
                    {(message.timestamp || message.createdAt) && (
                      <span className="text-xs text-muted-foreground whitespace-nowrap hidden sm:inline">
                        {format(new Date(message.timestamp || message.createdAt!), "MMM d, h:mm a")}
                      </span>
                    )}
                  </div>
                </div>

                {isReported && (
                  <Badge variant="destructive" className="mb-2">
                    Reported Message
                  </Badge>
                )}

                {isSystem && isCollapsed ? (
                  <div className="text-muted-foreground text-sm break-words">
                    <div className="prose prose-sm dark:prose-invert max-w-none break-words">
                      <ReactMarkdown>{preview}</ReactMarkdown>
                    </div>
                  </div>
                ) : (
                  <div
                    className={cn(
                      "break-words",
                      message.role === "system" && "text-muted-foreground",
                      message.role === "tool" && "font-mono text-xs",
                    )}
                  >
                    {renderContentData(message.contentData || message.content)}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )
      })}
    </div>
  )
}
