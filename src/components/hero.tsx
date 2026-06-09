import { ArrowUpRight, Sword } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Hero() {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-6">

      {/* Dark dungeon radial glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_40%,rgba(202,138,4,0.08),transparent)]"
      />
      {/* Corner vignette */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_120%_120%_at_50%_50%,transparent_50%,rgba(26,15,10,0.6)_100%)]"
      />

      <div className="relative z-10 max-w-3xl text-center">
        {/* Ornate badge */}
        <div className="inline-flex items-center gap-2 rounded border border-primary/40 bg-card px-4 py-1.5 text-xs uppercase tracking-[0.15em] text-primary">
          <span className="size-1 rounded-full bg-primary" />
          Quest v1.0.0 — New Chapter Released
          <span className="size-1 rounded-full bg-primary" />
        </div>

        <h1 className="mx-auto mt-8 max-w-2xl font-heading font-bold text-4xl tracking-wide text-[#F5E6D3] sm:text-5xl md:text-6xl/[1.15]">
          Forge Your{" "}
          <span className="text-primary">Legend</span>
        </h1>

        <p className="mx-auto mt-6 max-w-xl text-[#BFA98A] text-lg/relaxed">
          สินค้าและหลักสูตรคัดสรรมาเพื่อนักผจญภัยแท้จริง
          เริ่มต้นการเดินทางของคุณได้เลย
        </p>

        {/* Gold ornamental divider */}
        <div className="mt-8 flex items-center justify-center gap-3 text-primary/40">
          <div className="h-px w-16 bg-gradient-to-r from-transparent to-primary/40" />
          <Sword className="size-4 rotate-90 text-primary/60" />
          <div className="h-px w-16 bg-gradient-to-l from-transparent to-primary/40" />
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <Button asChild size="lg">
            <Link href="/product">
              เริ่มต้นการผจญภัย <ArrowUpRight className="size-5!" />
            </Link>
          </Button>
          <Button asChild variant="secondary" size="lg">
            <Link href="/course">
              ดูหลักสูตร
            </Link>
          </Button>
        </div>

        {/* Stat chips */}
        <div className="mt-14 flex flex-wrap items-center justify-center gap-3">
          {[
            { label: "สินค้า", value: "100+", icon: "⚔️" },
            { label: "หลักสูตร", value: "50+",  icon: "📜" },
            { label: "ผู้ใช้งาน", value: "1,000+", icon: "🛡️" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="flex items-center gap-2 rounded border border-[#5C3D2E] bg-card px-4 py-2 text-sm text-[#BFA98A] shadow-[0_1px_3px_rgba(202,138,4,0.10)]"
            >
              <span>{stat.icon}</span>
              <span className="font-heading font-bold text-primary">{stat.value}</span>
              <span>{stat.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
