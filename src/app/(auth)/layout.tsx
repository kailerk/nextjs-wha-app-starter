import type { Metadata } from "next";
import { Cinzel, Spectral, Prompt } from "next/font/google";
import { cn } from "@/lib/utils";
import "../globals.css";
import { ThemeProvider } from "@/components/theme-provider";

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
  title: "ระบบ ล็อกอิน",
  description: "เรียนรู้การเขียน Nex.tjs",
};

export default function AuthLayout({
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
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
