"use client"

import { useCallback, useEffect, useState } from "react"
import dynamic from "next/dynamic"
import {
  Banknote,
  Clock,
  Package,
  ShoppingCart,
  Users,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { KpiCard, KpiCardSkeleton } from "@/components/admin/kpi-card"
import { PeriodSelector } from "@/components/admin/period-selector"
import {
  RecentOrdersTable,
  RecentOrdersTableSkeleton,
} from "@/components/admin/recent-orders-table"
import { RevenueChartSkeleton } from "@/components/admin/revenue-chart"
import { fetchApi } from "@/lib/fetch-api"
import type {
  AdminOrderItem,
  AdminStats,
  Period,
  RevenuePoint,
} from "@/types/admin"

// Recharts ใช้ browser API — ปิด SSR และโหลดเฉพาะฝั่ง client
const RevenueChart = dynamic(() => import("@/components/admin/revenue-chart"), {
  ssr: false,
  loading: () => <RevenueChartSkeleton />,
})

const currency = new Intl.NumberFormat("th-TH", {
  style: "currency",
  currency: "THB",
})

export default function DashboardClient() {
  const [stats, setStats] = useState<AdminStats | null>(null)
  const [statsLoading, setStatsLoading] = useState(true)
  const [statsError, setStatsError] = useState<string | null>(null)

  const [revenue, setRevenue] = useState<RevenuePoint[]>([])
  const [revenueLoading, setRevenueLoading] = useState(true)
  const [revenueError, setRevenueError] = useState<string | null>(null)
  const [period, setPeriod] = useState<Period>("30d")

  const [orders, setOrders] = useState<AdminOrderItem[]>([])
  const [ordersLoading, setOrdersLoading] = useState(true)
  const [ordersError, setOrdersError] = useState<string | null>(null)

  // setState อยู่ใน .then/.catch callback เท่านั้น — เรียกจาก useEffect ได้
  const loadStats = useCallback(() => {
    fetchApi<AdminStats>("/api/admin/stats")
      .then((data) => {
        setStats(data)
        setStatsError(null)
      })
      .catch((error: unknown) => {
        setStatsError(
          error instanceof Error ? error.message : "โหลดข้อมูลไม่สำเร็จ"
        )
      })
      .finally(() => setStatsLoading(false))
  }, [])

  const loadOrders = useCallback(() => {
    fetchApi<{ orders: AdminOrderItem[]; total: number }>(
      "/api/admin/orders?limit=5"
    )
      .then((data) => {
        setOrders(data.orders)
        setOrdersError(null)
      })
      .catch((error: unknown) => {
        setOrdersError(
          error instanceof Error ? error.message : "โหลดข้อมูลไม่สำเร็จ"
        )
      })
      .finally(() => setOrdersLoading(false))
  }, [])

  const loadRevenue = useCallback((selectedPeriod: Period) => {
    fetchApi<RevenuePoint[]>(`/api/admin/revenue?period=${selectedPeriod}`)
      .then((data) => {
        setRevenue(data)
        setRevenueError(null)
      })
      .catch((error: unknown) => {
        setRevenueError(
          error instanceof Error ? error.message : "โหลดข้อมูลไม่สำเร็จ"
        )
      })
      .finally(() => setRevenueLoading(false))
  }, [])

  // mount → โหลด stats + orders พร้อมกัน
  useEffect(() => {
    loadStats()
    loadOrders()
  }, [loadStats, loadOrders])

  // period เปลี่ยน → โหลด revenue ใหม่
  useEffect(() => {
    loadRevenue(period)
  }, [period, loadRevenue])

  // refetch stats + orders ทุก 30 วินาที (ไม่โชว์ loading)
  useEffect(() => {
    const interval = setInterval(() => {
      loadStats()
      loadOrders()
    }, 30_000)
    return () => clearInterval(interval)
  }, [loadStats, loadOrders])

  const retryStats = () => {
    setStatsLoading(true)
    setStatsError(null)
    loadStats()
  }

  const retryOrders = () => {
    setOrdersLoading(true)
    setOrdersError(null)
    loadOrders()
  }

  const retryRevenue = () => {
    setRevenueLoading(true)
    setRevenueError(null)
    loadRevenue(period)
  }

  const changePeriod = (next: Period) => {
    setRevenueLoading(true)
    setPeriod(next)
  }

  return (
    <main className="mx-auto max-w-7xl space-y-6 px-4 py-8">
      <h1 className="font-heading text-2xl font-bold text-primary">
        Dashboard
      </h1>

      {/* KPI Cards */}
      <section>
        {statsError ? (
          <ErrorBox message={statsError} onRetry={retryStats} />
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {statsLoading || !stats ? (
              Array.from({ length: 5 }).map((_, i) => (
                <KpiCardSkeleton key={i} />
              ))
            ) : (
              <>
                <KpiCard
                  title="ยอดขายวันนี้"
                  value={currency.format(stats.todaySales)}
                  icon={<Banknote className="size-5" />}
                />
                <KpiCard
                  title="คำสั่งซื้อวันนี้"
                  value={String(stats.todayOrders)}
                  icon={<ShoppingCart className="size-5" />}
                />
                <KpiCard
                  title="รอดำเนินการ"
                  value={String(stats.pendingOrders)}
                  icon={<Clock className="size-5" />}
                />
                <KpiCard
                  title="สินค้าทั้งหมด"
                  value={String(stats.totalProducts)}
                  icon={<Package className="size-5" />}
                />
                <KpiCard
                  title="ผู้ใช้ทั้งหมด"
                  value={String(stats.totalUsers)}
                  icon={<Users className="size-5" />}
                />
              </>
            )}
          </div>
        )}
      </section>

      {/* Revenue Chart */}
      <Card>
        <CardHeader>
          <CardTitle>รายได้</CardTitle>
          <CardAction>
            <PeriodSelector value={period} onChange={changePeriod} />
          </CardAction>
        </CardHeader>
        <CardContent>
          {revenueError ? (
            <ErrorBox message={revenueError} onRetry={retryRevenue} />
          ) : revenueLoading ? (
            <RevenueChartSkeleton />
          ) : (
            <RevenueChart data={revenue} />
          )}
        </CardContent>
      </Card>

      {/* Recent Orders */}
      <Card>
        <CardHeader>
          <CardTitle>คำสั่งซื้อล่าสุด</CardTitle>
        </CardHeader>
        <CardContent>
          {ordersError ? (
            <ErrorBox message={ordersError} onRetry={retryOrders} />
          ) : ordersLoading ? (
            <RecentOrdersTableSkeleton />
          ) : (
            <RecentOrdersTable orders={orders} />
          )}
        </CardContent>
      </Card>
    </main>
  )
}

function ErrorBox({
  message,
  onRetry,
}: {
  message: string
  onRetry: () => void
}) {
  return (
    <div className="flex flex-col items-center gap-3 rounded border border-destructive/40 bg-destructive/10 px-4 py-8">
      <p className="text-sm text-destructive">{message}</p>
      <Button size="sm" variant="secondary" onClick={onRetry}>
        ลองใหม่
      </Button>
    </div>
  )
}
