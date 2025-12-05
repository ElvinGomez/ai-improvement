"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts"
import type { Report } from "@/lib/api"

interface StatusDistributionChartProps {
  reports: Report[]
}

const COLORS = {
  PENDING: "hsl(var(--chart-4))",
  RESOLVED: "hsl(var(--chart-3))",
  DISMISSED: "hsl(var(--muted-foreground))",
}

export function StatusDistributionChart({ reports }: StatusDistributionChartProps) {
  const data = [
    {
      name: "Pending",
      value: reports.filter((r) => r.status === "PENDING").length,
      status: "PENDING",
    },
    {
      name: "Resolved",
      value: reports.filter((r) => r.status === "RESOLVED").length,
      status: "RESOLVED",
    },
    {
      name: "Dismissed",
      value: reports.filter((r) => r.status === "DISMISSED").length,
      status: "DISMISSED",
    },
  ].filter((item) => item.value > 0)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Status Distribution</CardTitle>
        <CardDescription>Reports by current status</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
            >
              {data.map((entry) => (
                <Cell key={entry.status} fill={COLORS[entry.status as keyof typeof COLORS]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "0.5rem",
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
