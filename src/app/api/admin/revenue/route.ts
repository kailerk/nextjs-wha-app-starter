import { NextResponse, type NextRequest } from "next/server"
import prisma from "@/lib/prisma"
import { getAdminSession } from "@/lib/admin-guard"
import type { ApiResponse, Period, RevenuePoint } from "@/types/admin"

const PERIOD_DAYS: Record<Period, number> = { "7d": 7, "30d": 30, "90d": 90 }

export async function GET(
  request: NextRequest
): Promise<NextResponse<ApiResponse<RevenuePoint[]>>> {
  const session = await getAdminSession(request.headers)
  if (!session) {
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401 }
    )
  }

  const periodParam = request.nextUrl.searchParams.get("period") ?? "30d"
  const days = PERIOD_DAYS[periodParam as Period]
  if (!days) {
    return NextResponse.json(
      { success: false, error: "period ต้องเป็น 7d, 30d หรือ 90d" },
      { status: 400 }
    )
  }

  try {
    const start = new Date()
    start.setHours(0, 0, 0, 0)
    start.setDate(start.getDate() - (days - 1))

    const orders = await prisma.orders.findMany({
      where: { date: { gte: start } },
      select: { date: true, total_amount: true },
    })

    // เตรียม bucket ครบทุกวันในช่วง (วันไม่มียอด = 0)
    const buckets = new Map<string, RevenuePoint>()
    for (let i = 0; i < days; i++) {
      const d = new Date(start)
      d.setDate(start.getDate() + i)
      const key = toKey(d)
      buckets.set(key, { date: toLabel(d), revenue: 0, orders: 0 })
    }

    for (const order of orders) {
      if (!order.date) continue
      const point = buckets.get(toKey(order.date))
      if (!point) continue
      point.revenue += Number(order.total_amount ?? 0)
      point.orders += 1
    }

    return NextResponse.json({ success: true, data: [...buckets.values()] })
  } catch (error) {
    console.error("GET /api/admin/revenue error:", error)
    return NextResponse.json(
      { success: false, error: "ไม่สามารถโหลดข้อมูลรายได้ได้" },
      { status: 500 }
    )
  }
}

function toKey(d: Date): string {
  return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`
}

function toLabel(d: Date): string {
  const dd = String(d.getDate()).padStart(2, "0")
  const mm = String(d.getMonth() + 1).padStart(2, "0")
  return `${dd}/${mm}`
}
