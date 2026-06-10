import { NextResponse, type NextRequest } from "next/server"
import prisma from "@/lib/prisma"
import { getAdminSession } from "@/lib/admin-guard"
import { productSchema } from "@/lib/validations/product"
import { serializeProduct } from "@/lib/serialize-product"
import type { AdminProduct, ApiResponse } from "@/types/admin"

type Context = { params: Promise<{ id: string }> }

// PUT /api/admin/products/[id]
export async function PUT(
  request: NextRequest,
  { params }: Context
): Promise<NextResponse<ApiResponse<AdminProduct>>> {
  const session = await getAdminSession(request.headers)
  if (!session) {
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401 }
    )
  }

  const productId = Number((await params).id)
  if (!Number.isInteger(productId)) {
    return NextResponse.json(
      { success: false, error: "รหัสสินค้าไม่ถูกต้อง" },
      { status: 400 }
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

  const existing = await prisma.products.findUnique({ where: { id: productId } })
  if (!existing) {
    return NextResponse.json(
      { success: false, error: "ไม่พบสินค้านี้" },
      { status: 404 }
    )
  }

  try {
    const updated = await prisma.products.update({
      where: { id: productId },
      data: {
        name: parsed.data.name,
        description: parsed.data.description || null,
        price: parsed.data.price,
        category_id: Number(parsed.data.categoryId),
      },
      include: { categories: { select: { name: true } } },
    })

    return NextResponse.json({ success: true, data: serializeProduct(updated) })
  } catch (error) {
    console.error("PUT /api/admin/products/[id] error:", error)
    return NextResponse.json(
      { success: false, error: "ไม่สามารถแก้ไขสินค้าได้" },
      { status: 500 }
    )
  }
}

// DELETE /api/admin/products/[id]
export async function DELETE(
  request: NextRequest,
  { params }: Context
): Promise<NextResponse<ApiResponse<{ id: string }>>> {
  const session = await getAdminSession(request.headers)
  if (!session) {
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401 }
    )
  }

  const productId = Number((await params).id)
  if (!Number.isInteger(productId)) {
    return NextResponse.json(
      { success: false, error: "รหัสสินค้าไม่ถูกต้อง" },
      { status: 400 }
    )
  }

  const existing = await prisma.products.findUnique({ where: { id: productId } })
  if (!existing) {
    return NextResponse.json(
      { success: false, error: "ไม่พบสินค้านี้" },
      { status: 404 }
    )
  }

  // กันลบสินค้าที่ถูกอ้างอิงในคำสั่งซื้อ (order_items มี onDelete: NoAction)
  const orderCount = await prisma.order_items.count({
    where: { product_id: productId },
  })
  if (orderCount > 0) {
    return NextResponse.json(
      {
        success: false,
        error: `ไม่สามารถลบได้ มีคำสั่งซื้อ ${orderCount} รายการที่อ้างอิงสินค้านี้`,
      },
      { status: 409 }
    )
  }

  try {
    await prisma.products.delete({ where: { id: productId } })
    return NextResponse.json({ success: true, data: { id: String(productId) } })
  } catch (error) {
    console.error("DELETE /api/admin/products/[id] error:", error)
    return NextResponse.json(
      { success: false, error: "ไม่สามารถลบสินค้าได้" },
      { status: 500 }
    )
  }
}
