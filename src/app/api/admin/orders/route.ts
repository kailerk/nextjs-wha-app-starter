import { NextResponse, type NextRequest } from "next/server"
import prisma from "@/lib/prisma"
import { getAdminSession } from "@/lib/admin-guard"
import type { AdminOrderItem, ApiResponse } from "@/types/admin"

export async function GET(
  request: NextRequest
): Promise<
  NextResponse<ApiResponse<{ orders: AdminOrderItem[]; total: number }>>
> {
  const session = await getAdminSession(request.headers)
  if (!session) {
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401 }
    )
  }

  const limitParam = Number(request.nextUrl.searchParams.get("limit") ?? "5")
  const limit =
    Number.isInteger(limitParam) && limitParam > 0
      ? Math.min(limitParam, 50)
      : 5

  try {
    const [orders, total] = await Promise.all([
      prisma.orders.findMany({
        orderBy: { date: "desc" },
        take: limit,
        include: { customers: { select: { name: true } } },
      }),
      prisma.orders.count(),
    ])

    return NextResponse.json({
      success: true,
      data: {
        orders: orders.map((o) => ({
          id: o.id,
          date: o.date?.toISOString() ?? null,
          customerName: o.customers?.name ?? "-",
          status: o.status,
          totalAmount: Number(o.total_amount ?? 0),
        })),
        total,
      },
    })
  } catch (error) {
    console.error("GET /api/admin/orders error:", error)
    return NextResponse.json(
      { success: false, error: "ไม่สามารถโหลดรายการคำสั่งซื้อได้" },
      { status: 500 }
    )
  }
}
