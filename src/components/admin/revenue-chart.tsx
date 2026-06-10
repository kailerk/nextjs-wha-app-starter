"use client"

import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import type { RevenuePoint } from "@/types/admin"

const currency = new Intl.NumberFormat("th-TH", {
  style: "currency",
  currency: "THB",
})

type RevenueChartProps = {
  data: RevenuePoint[]
}

export default function RevenueChart({ data }: RevenueChartProps) {
  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 8, right: 16, bottom: 0, left: 8 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(202,138,4,0.15)" />
          <XAxis
            dataKey="date"
            tick={{ fill: "#BFA98A", fontSize: 12 }}
            tickLine={false}
            axisLine={{ stroke: "rgba(202,138,4,0.3)" }}
            interval="preserveStartEnd"
            minTickGap={24}
          />
          <YAxis
            tick={{ fill: "#BFA98A", fontSize: 12 }}
            tickLine={false}
            axisLine={false}
            width={80}
            tickFormatter={(v: number) => currency.format(v)}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#2C1A10",
              border: "1px solid rgba(202,138,4,0.4)",
              borderRadius: 6,
              color: "#F5E6D3",
            }}
            labelStyle={{ color: "#CA8A04" }}
            formatter={(value, name) =>
              name === "revenue"
                ? [currency.format(Number(value)), "รายได้"]
                : [String(value), "คำสั่งซื้อ"]
            }
          />
          <Line
            type="monotone"
            dataKey="revenue"
            stroke="#CA8A04"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4, fill: "#CA8A04" }}
          />
          <Line
            type="monotone"
            dataKey="orders"
            stroke="#581C87"
            strokeWidth={1.5}
            dot={false}
            hide
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

export function RevenueChartSkeleton() {
  return <div className="h-72 w-full animate-pulse rounded bg-muted" />
}
