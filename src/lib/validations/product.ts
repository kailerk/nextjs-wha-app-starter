import { z } from "zod/v4"

export const productSchema = z.object({
  name: z.string().min(1, "กรุณากรอกชื่อสินค้า").max(255),
  description: z.string().max(2000).optional().or(z.literal("")),
  price: z.coerce.number().positive("ราคาต้องมากกว่า 0"), // coerce เพราะ input ส่งค่ามาเป็น string
  categoryId: z.string().min(1, "กรุณาเลือกหมวดหมู่"),
})

// input = ค่าก่อน coerce (price ยังเป็น string จาก form), output = หลัง coerce (price เป็น number)
export type ProductFormInput = z.input<typeof productSchema>
export type ProductFormValues = z.output<typeof productSchema>
