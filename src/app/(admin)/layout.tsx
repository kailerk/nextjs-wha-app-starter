import type { Metadata } from "next";
import Link from "next/link";
import { Cinzel, Spectral, Prompt } from "next/font/google";
import { cn } from "@/lib/utils";
import "../globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";

const cinzel = Cinzel({
  subsets: ["latin"],
  variable: "--font-heading",
  weight: ["400", "600", "700", "800", "900"],
  display: "swap",
});

const spectral = Spectral({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const prompt = Prompt({
  weight: ["400", "500", "700"],
  subsets: ["thai", "latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Admin | ระบบ E-Commerce",
  description: "ระบบจัดการหลังบ้าน",
};

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="th"
      className={cn(cinzel.variable, spectral.variable, prompt.className, "font-sans")}
      suppressHydrationWarning
    >
      <body>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
          <header className="border-b border-border bg-card">
            <div className="mx-auto flex h-14 max-w-7xl items-center gap-6 px-4">
              <span className="font-heading text-lg font-bold text-primary">
                Admin Panel
              </span>
              <nav className="flex items-center gap-4 text-sm">
                <Link
                  href="/dashboard"
                  className="text-[#BFA98A] hover:text-primary"
                >
                  Dashboard
                </Link>
                <Link
                  href="/dashboard/products"
                  className="text-[#BFA98A] hover:text-primary"
                >
                  สินค้า
                </Link>
              </nav>
              <Link
                href="/"
                className="ml-auto text-sm text-[#BFA98A] hover:text-primary"
              >
                ← กลับหน้าร้าน
              </Link>
            </div>
          </header>
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
