"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts"
import type { Report } from "@/lib/api"

interface CategoryDistributionChartProps {
  reports: Report[]
}

const CATEGORIES = [
  "OFF_TOPIC",
  "VERY_GENERIC",
  "HALLUCINATION",
  "POLICY_VIOLATION",
  "LANGUAGE_ISSUE",
  "TOOL_MISUSE",
  "OTHER",
]

export function CategoryDistributionChart({ reports }: CategoryDistributionChartProps) {
  const data = CATEGORIES.map((category) => ({
    category: category.replace(/_/g, " "),
    count: reports.filter((r) => r.errorCategory === category).length,
  })).filter((item) => item.count > 0)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Error Category Distribution</CardTitle>
        <CardDescription>Reports grouped by error type</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
            <XAxis type="number" className="text-xs text-muted-foreground" />
            <YAxis dataKey="category" type="category" width={120} className="text-xs text-muted-foreground" />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "0.5rem",
              }}
            />
            <Bar dataKey="count" fill="hsl(var(--chart-2))" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
