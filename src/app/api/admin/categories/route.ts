import { NextResponse, type NextRequest } from "next/server"
import prisma from "@/lib/prisma"
import { getAdminSession } from "@/lib/admin-guard"
import type { ApiResponse, CategoryOption } from "@/types/admin"

// GET /api/admin/categories — สำหรับ dropdown
export async function GET(
  request: NextRequest
): Promise<NextResponse<ApiResponse<CategoryOption[]>>> {
  const session = await getAdminSession(request.headers)
  if (!session) {
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401 }
    )
  }

  try {
    const categories = await prisma.categories.findMany({
      orderBy: { name: "asc" },
    })

    return NextResponse.json({
      success: true,
      data: categories.map((c) => ({ id: String(c.id), name: c.name ?? "" })),
    })
  } catch (error) {
    console.error("GET /api/admin/categories error:", error)
    return NextResponse.json(
      { success: false, error: "ไม่สามารถโหลดหมวดหมู่ได้" },
      { status: 500 }
    )
  }
}
