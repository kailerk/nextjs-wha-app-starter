import { auth } from "@/lib/auth"

/**
 * คืน session เมื่อผู้ใช้ login และมี role = 'admin' เท่านั้น ไม่ผ่านคืน null
 */
export async function getAdminSession(headers: Headers) {
  const session = await auth.api.getSession({ headers })

  if (!session || session.user.role !== "admin") {
    return null
  }

  return session
}
