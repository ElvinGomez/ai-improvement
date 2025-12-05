"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { buildImprovementPrompt } from "@/lib/prompt-generator"
import type { Report, Message } from "@/lib/api"
import { Copy, Sparkles } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface PromptGeneratorProps {
  report: Report
  messages: Message[]
  category: string
  severity: string
  expectedResponse: string
}

export function PromptGenerator({ report, messages, category, severity, expectedResponse }: PromptGeneratorProps) {
  const [generatedPrompt, setGeneratedPrompt] = useState<string>("")
  const { toast } = useToast()

  const handleGenerate = () => {
    const prompt = buildImprovementPrompt(
      report,
      messages,
      category || "Not specified",
      severity || "Not specified",
      expectedResponse || "Not specified",
    )
    setGeneratedPrompt(prompt)
  }

  const handleCopy = async () => {
    await navigator.clipboard.writeText(generatedPrompt)
    toast({
      title: "Copied to clipboard",
      description: "Prompt has been copied to your clipboard.",
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
          <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 text-primary shrink-0" />
          <span className="text-sm sm:text-base">Generate AI Improvement Prompt</span>
        </CardTitle>
        <CardDescription className="text-xs sm:text-sm">Create a detailed prompt for improving the system based on this failure</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button onClick={handleGenerate} className="w-full text-sm sm:text-base">
          Generate Prompt
        </Button>

        {generatedPrompt && (
          <div className="space-y-2">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm font-medium">Generated Prompt</p>
              <Button variant="outline" size="sm" onClick={handleCopy} className="w-full sm:w-auto">
                <Copy className="mr-2 h-4 w-4" />
                Copy
              </Button>
            </div>
            <Textarea value={generatedPrompt} readOnly className="font-mono text-xs overflow-x-auto" rows={12} />
          </div>
        )}
      </CardContent>
    </Card>
  )
}
