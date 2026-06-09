"use client"

import { useTheme } from "next-themes"
import { Moon, Sun } from "lucide-react"
import { useEffect, useState } from "react"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setMounted(true), [])

  if (!mounted) {
    return <div className="size-8 rounded border border-[#5C3D2E]" />
  }

  const isDark = theme === "dark"

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label="Toggle theme"
      className="relative flex h-7 w-13 items-center rounded border border-[#5C3D2E] bg-card transition-colors duration-300 hover:border-primary/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
    >
      <span
        className={`absolute inset-0 rounded transition-colors duration-300 ${
          isDark ? "bg-primary/5" : "bg-amber-50/10"
        }`}
      />
      <span
        className={`relative z-10 flex size-5 items-center justify-center rounded border transition-all duration-300 ${
          isDark
            ? "translate-x-7 border-primary/60 bg-card text-primary"
            : "translate-x-1 border-amber-600/40 bg-amber-50 text-amber-700"
        }`}
      >
        {isDark
          ? <Moon className="size-3" />
          : <Sun className="size-3" />
        }
      </span>
    </button>
  )
}
