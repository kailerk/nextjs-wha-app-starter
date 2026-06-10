import type { AdminProduct } from "@/types/admin"

export type ProductWithCategory = {
  id: number
  name: string | null
  description: string | null
  price: unknown // Prisma Decimal
  category_id: number | null
  categories: { name: string | null } | null
}

/** แปลง product จาก Prisma (มี Decimal + id เป็น number) → รูปแบบที่ client ใช้ */
export function serializeProduct(p: ProductWithCategory): AdminProduct {
  return {
    id: String(p.id),
    name: p.name ?? "",
    description: p.description,
    price: Number(p.price ?? 0), // Prisma Decimal → number
    categoryId: p.category_id != null ? String(p.category_id) : "",
    categoryName: p.categories?.name ?? "",
  }
}
