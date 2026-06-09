import type { Metadata } from "next"
import { Clock, Mail, Phone } from "lucide-react"

import { Separator } from "@/components/ui/separator"
import ContactForm from "./contact-form"

export const metadata: Metadata = {
  title: "ติดต่อเรา",
  description: "ติดต่อทีมงานของเรา",
}

const contactInfo = [
  { icon: Mail, label: "อีเมล", value: "support@example.com" },
  { icon: Phone, label: "เบอร์โทร", value: "02-123-4567" },
  { icon: Clock, label: "เวลาทำการ", value: "จันทร์ - ศุกร์ 9:00 - 18:00" },
]

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-14 sm:py-20">
      <div className="text-center">
        <h1 className="font-heading text-4xl font-bold tracking-wide text-foreground sm:text-5xl">
          ติดต่อเรา
        </h1>
        <p className="mt-3 text-muted-foreground">
          มีคำถามหรือข้อเสนอแนะ? ส่งข้อความถึงเราได้เลย
        </p>
        <div className="mx-auto mt-4 w-24 border-b border-dashed border-primary/40" />
      </div>

      <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-[1fr_1.6fr] md:gap-12">
        {/* Contact info */}
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-5">
            {contactInfo.map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex items-center gap-4">
                <span className="flex size-10 shrink-0 items-center justify-center rounded border border-border bg-card text-primary">
                  <Icon className="size-5" />
                </span>
                <div>
                  <p className="text-sm font-medium text-foreground">{label}</p>
                  <p className="text-sm text-muted-foreground">{value}</p>
                </div>
              </div>
            ))}
          </div>

          <Separator />

          <p className="text-sm leading-relaxed text-muted-foreground">
            ทีมงานของเรายินดีให้บริการและตอบทุกข้อสงสัย
            กรอกแบบฟอร์มทางด้านขวา แล้วเราจะติดต่อกลับโดยเร็วที่สุด
          </p>
        </div>

        {/* Form */}
        <div className="rounded border border-border border-t-2 border-t-primary/50 bg-card p-6 shadow-[0_2px_8px_rgba(202,138,4,0.18)] sm:p-8">
          <ContactForm />
        </div>
      </div>
    </div>
  )
}
