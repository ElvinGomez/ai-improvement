import type { Report, Message } from "./api"

export function buildImprovementPrompt(
  report: Report,
  messages: Message[],
  category: string,
  severity: string,
  expectedResponse: string,
): string {
  // Find system prompt from messages
  const systemMessage = messages.find((msg) => msg.role === "system")
  const systemPrompt = systemMessage?.content || "[No system prompt found]"

  return `Act as a senior Prompt Engineering and AI Evaluation expert.

You are given a real production failure where an AI assistant did not meet expectations.

--- CURRENT SYSTEM PROMPT ---
${systemPrompt}

--- USER MESSAGE ---
${report.userMessage}

--- AI RESPONSE ---
${report.assistantResponse}

--- USER REPORT REASON ---
${report.reason}

--- INTERNAL CLASSIFICATION ---
Category: ${category}
Severity: ${severity}

--- EXPECTED IDEAL RESPONSE ---
${expectedResponse}

Your tasks:

1. Analyze what went wrong in the AI response.
2. Identify which part of the system prompt allowed this failure.
3. Produce a fully improved VERSION OF THE SYSTEM PROMPT that:
   - Reduces the chance of this failure happening again
   - Keeps strict restrictions intact
   - Improves clarity and enforcement of rules
4. Optionally provide:
   - Additional safety rules
   - Example corrections

Return your output in this exact format:

### Error Analysis
(text)

### Revised System Prompt
(text)

### Additional Fine-Tuning Notes
(text)`
}
