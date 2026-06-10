import { NextResponse, type NextRequest } from "next/server"
import prisma from "@/lib/prisma"
import { getAdminSession } from "@/lib/admin-guard"
import type { AdminStats, ApiResponse } from "@/types/admin"

export async function GET(
  request: NextRequest
): Promise<NextResponse<ApiResponse<AdminStats>>> {
  const session = await getAdminSession(request.headers)
  if (!session) {
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401 }
    )
  }

  try {
    const todayStart = new Date()
    todayStart.setHours(0, 0, 0, 0)

    const [todayAgg, pendingOrders, totalProducts, totalUsers] =
      await Promise.all([
        prisma.orders.aggregate({
          where: { date: { gte: todayStart } },
          _sum: { total_amount: true },
          _count: { id: true },
        }),
        prisma.orders.count({ where: { status: "processing" } }),
        prisma.products.count(),
        prisma.user.count(),
      ])

    return NextResponse.json({
      success: true,
      data: {
        todaySales: Number(todayAgg._sum.total_amount ?? 0),
        todayOrders: todayAgg._count.id,
        pendingOrders,
        totalProducts,
        totalUsers,
      },
    })
  } catch (error) {
    console.error("GET /api/admin/stats error:", error)
    return NextResponse.json(
      { success: false, error: "ไม่สามารถโหลดข้อมูลสถิติได้" },
      { status: 500 }
    )
  }
}
