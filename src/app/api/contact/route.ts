import { NextResponse } from "next/server"
import { Resend } from "resend"

import { contactSchema } from "@/lib/validations/contact"

type ApiResponse<T> =
  | { success: true; data: T }
  | { success: false; error: string }

type ContactResult = { message: string }

export async function POST(
  request: Request
): Promise<NextResponse<ApiResponse<ContactResult>>> {
  let body: unknown

  try {
    body = await request.json()
  } catch {
    return NextResponse.json(
      { success: false, error: "รูปแบบข้อมูลไม่ถูกต้อง" },
      { status: 400 }
    )
  }

  const parsed = contactSchema.safeParse(body)

  if (!parsed.success) {
    const firstIssue = parsed.error.issues[0]?.message ?? "ข้อมูลไม่ถูกต้อง"
    return NextResponse.json(
      { success: false, error: firstIssue },
      { status: 400 }
    )
  }

  const { name, email, message } = parsed.data

  const apiKey = process.env.RESEND_API_KEY
  const fromEmail = process.env.CONTACT_FROM_EMAIL
  const receiverEmail = process.env.CONTACT_RECEIVER_EMAIL

  if (!apiKey || !fromEmail || !receiverEmail) {
    console.error("Contact form: missing Resend environment variables")
    return NextResponse.json(
      { success: false, error: "ระบบส่งอีเมลยังไม่พร้อมใช้งาน" },
      { status: 500 }
    )
  }

  const resend = new Resend(apiKey)

  const { error } = await resend.emails.send({
    from: fromEmail,
    to: receiverEmail,
    replyTo: email,
    subject: `ข้อความติดต่อใหม่จาก ${name}`,
    text: `ชื่อ: ${name}\nอีเมล: ${email}\n\nข้อความ:\n${message}`,
  })

  if (error) {
    console.error("Contact form: Resend error", error)
    return NextResponse.json(
      { success: false, error: "ส่งข้อความไม่สำเร็จ กรุณาลองใหม่อีกครั้ง" },
      { status: 502 }
    )
  }

  return NextResponse.json({
    success: true,
    data: { message: "ส่งข้อความเรียบร้อยแล้ว" },
  })
}
