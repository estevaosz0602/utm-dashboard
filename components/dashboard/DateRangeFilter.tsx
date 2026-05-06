"use client"

import { useRouter, usePathname, useSearchParams } from "next/navigation"
import { cn } from "@/lib/utils"

const PRESETS = [
  { label: "Hoje", days: 0 },
  { label: "7 dias", days: 7 },
  { label: "30 dias", days: 30 },
  { label: "90 dias", days: 90 },
]

export default function DateRangeFilter() {
  const router = useRouter()
  const pathname = usePathname()
  const params = useSearchParams()
  const currentDays = params.get("days") ?? "7"

  function setDays(days: number) {
    const sp = new URLSearchParams(params.toString())
    sp.set("days", String(days))
    router.push(`${pathname}?${sp.toString()}`)
  }

  return (
    <div className="flex items-center gap-1 rounded-lg p-1 border border-dash-border" style={{ background: "#0f1729" }}>
      {PRESETS.map(({ label, days }) => (
        <button
          key={days}
          onClick={() => setDays(days)}
          className={cn(
            "px-3 py-1.5 rounded-md text-xs font-medium transition-colors",
            String(days) === currentDays
              ? "bg-blue-500/20 text-blue-400"
              : "text-dash-muted hover:text-dash-text"
          )}
        >
          {label}
        </button>
      ))}
    </div>
  )
}
