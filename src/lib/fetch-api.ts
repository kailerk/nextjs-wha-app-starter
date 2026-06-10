import type { ApiResponse } from "@/types/admin"

/** เรียก API ที่คืน ApiResponse<T> แล้ว unwrap — โยน Error พร้อมข้อความถ้า success=false */
export async function fetchApi<T>(
  url: string,
  init?: RequestInit
): Promise<T> {
  const res = await fetch(url, init)
  const json = (await res.json()) as ApiResponse<T>
  if (!json.success) throw new Error(json.error)
  return json.data
}

/** สร้าง RequestInit สำหรับส่ง JSON (POST/PUT) */
export function jsonBody(method: "POST" | "PUT", data: unknown): RequestInit {
  return {
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  }
}
