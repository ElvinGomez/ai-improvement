"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts"
import type { Report } from "@/lib/api"
import { subDays, format, startOfDay } from "date-fns"

interface ReportsByDayChartProps {
  reports: Report[]
}

export function ReportsByDayChart({ reports }: ReportsByDayChartProps) {
  // Generate data for last 7 days
  const data = Array.from({ length: 7 }, (_, i) => {
    const date = startOfDay(subDays(new Date(), 6 - i))
    const dateStr = format(date, "yyyy-MM-dd")

    const count = reports.filter((report) => {
      const reportDate = format(startOfDay(new Date(report.createdAt)), "yyyy-MM-dd")
      return reportDate === dateStr
    }).length

    return {
      date: format(date, "MMM d"),
      count,
    }
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle>Reports Last 7 Days</CardTitle>
        <CardDescription>Daily report submission volume</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
            <XAxis dataKey="date" className="text-xs text-muted-foreground" />
            <YAxis className="text-xs text-muted-foreground" />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "0.5rem",
              }}
            />
            <Bar dataKey="count" fill="hsl(var(--chart-1))" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
