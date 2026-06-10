import { NextResponse, type NextRequest } from "next/server"
import prisma from "@/lib/prisma"
import { getAdminSession } from "@/lib/admin-guard"
import { productSchema } from "@/lib/validations/product"
import { serializeProduct } from "@/lib/serialize-product"
import type { AdminProduct, ApiResponse } from "@/types/admin"

const PAGE_SIZE = 10

// GET /api/admin/products?search=&page=
export async function GET(
  request: NextRequest
): Promise<NextResponse<ApiResponse<{ products: AdminProduct[]; total: number }>>> {
  const session = await getAdminSession(request.headers)
  if (!session) {
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401 }
    )
  }

  const search = request.nextUrl.searchParams.get("search")?.trim() ?? ""
  const pageParam = Number(request.nextUrl.searchParams.get("page") ?? "1")
  const page = Number.isInteger(pageParam) && pageParam > 0 ? pageParam : 1

  const where = search ? { name: { contains: search } } : {}

  try {
    const [rows, total] = await Promise.all([
      prisma.products.findMany({
        where,
        include: { categories: { select: { name: true } } },
        orderBy: { id: "desc" },
        skip: (page - 1) * PAGE_SIZE,
        take: PAGE_SIZE,
      }),
      prisma.products.count({ where }),
    ])

    return NextResponse.json({
      success: true,
      data: { products: rows.map(serializeProduct), total },
    })
  } catch (error) {
    console.error("GET /api/admin/products error:", error)
    return NextResponse.json(
      { success: false, error: "ไม่สามารถโหลดรายการสินค้าได้" },
      { status: 500 }
    )
  }
}

// POST /api/admin/products
export async function POST(
  request: NextRequest
): Promise<NextResponse<ApiResponse<AdminProduct>>> {
  const session = await getAdminSession(request.headers)
  if (!session) {
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401 }
    )
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json(
      { success: false, error: "รูปแบบข้อมูลไม่ถูกต้อง" },
      { status: 400 }
    )
  }

  const parsed = productSchema.safeParse(body)
  if (!parsed.success) {
    const firstIssue = parsed.error.issues[0]?.message ?? "ข้อมูลไม่ถูกต้อง"
    return NextResponse.json(
      { success: false, error: firstIssue },
      { status: 400 }
    )
  }

  try {
    const created = await prisma.products.create({
      data: {
        name: parsed.data.name,
        description: parsed.data.description || null,
        price: parsed.data.price,
        category_id: Number(parsed.data.categoryId),
      },
      include: { categories: { select: { name: true } } },
    })

    return NextResponse.json(
      { success: true, data: serializeProduct(created) },
      { status: 201 }
    )
  } catch (error) {
    console.error("POST /api/admin/products error:", error)
    return NextResponse.json(
      { success: false, error: "ไม่สามารถสร้างสินค้าได้" },
      { status: 500 }
    )
  }
}
