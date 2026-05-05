"use client"

import { useRouter, usePathname, useSearchParams } from "next/navigation"
import { cn } from "@/lib/utils"
import { subDays } from "date-fns"

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
    <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
      {PRESETS.map(({ label, days }) => (
        <button
          key={days}
          onClick={() => setDays(days)}
          className={cn(
            "px-3 py-1.5 rounded-md text-xs font-medium transition-colors",
            String(days) === currentDays
              ? "bg-white shadow-sm text-gray-900"
              : "text-gray-500 hover:text-gray-700"
          )}
        >
          {label}
        </button>
      ))}
    </div>
  )
}

export function getDateRange(daysParam: string | null) {
  const days = parseInt(daysParam ?? "7", 10)
  const to = new Date()
  const from = days === 0 ? new Date(to.getFullYear(), to.getMonth(), to.getDate()) : subDays(to, days)
  return { from, to }
}
