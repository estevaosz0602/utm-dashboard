"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { BarChart3, Link2, Shuffle, Settings } from "lucide-react"

const NAV = [
  { href: "/dashboard", label: "Dashboard", icon: BarChart3 },
  { href: "/dashboard?utm=1", label: "UTMs", icon: Link2 },
  { href: "/settings", label: "Integrações", icon: Shuffle },
  { href: "/settings", label: "Config", icon: Settings },
]

export default function BottomNav() {
  const pathname = usePathname()

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 border-t border-dash-border flex items-center"
      style={{
        background: "#0d1424",
        paddingBottom: "env(safe-area-inset-bottom)",
        zIndex: 50,
      }}
    >
      {NAV.map(({ href, label, icon: Icon }) => {
        const active = pathname === href.split("?")[0] && (
          href === "/dashboard" ? !href.includes("?") || pathname === "/dashboard" : true
        )
        return (
          <Link
            key={label}
            href={href}
            className="flex-1 flex flex-col items-center gap-1 py-3 text-xs transition-colors"
            style={{ color: active ? "#3b82f6" : "#64748b" }}
          >
            <Icon size={20} />
            <span>{label}</span>
          </Link>
        )
      })}
    </nav>
  )
}
