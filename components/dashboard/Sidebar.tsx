"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  BarChart3, Settings, TrendingUp, Globe, Video,
  Link2, Shuffle, Percent, DollarSign, FileText, Bell, Mic
} from "lucide-react"

const NAV_MAIN = [
  { href: "/dashboard", label: "Resumo", icon: BarChart3 },
  { href: "/dashboard?src=meta", label: "Meta", icon: TrendingUp },
  { href: "/dashboard?src=google", label: "Google", icon: Globe },
  { href: "/dashboard?src=tiktok", label: "TikTok", icon: Video },
  { href: "/dashboard?utm=1", label: "UTMs", icon: Link2 },
]

const NAV_CONFIG = [
  { href: "/settings", label: "Integrações", icon: Shuffle },
  { href: "/settings", label: "Regras", icon: Percent },
  { href: "/settings", label: "Taxas", icon: Percent },
  { href: "/settings", label: "Despesas", icon: DollarSign },
  { href: "/settings", label: "Relatórios", icon: FileText },
  { href: "/settings", label: "Notificações", icon: Bell },
]

function NavItem({ href, label, icon: Icon, active }: { href: string; label: string; icon: React.ElementType; active: boolean }) {
  return (
    <Link
      href={href}
      className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors ${
        active
          ? "bg-dash-blue/20 text-dash-blue border-l-2 border-dash-blue"
          : "text-dash-muted hover:text-dash-text hover:bg-dash-border/30"
      }`}
    >
      <Icon size={15} />
      {label}
    </Link>
  )
}

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-52 bg-dash-sidebar border-r border-dash-border flex flex-col shrink-0 overflow-y-auto">
      {/* Logo */}
      <div className="px-4 py-4 border-b border-dash-border flex items-center gap-2">
        <div className="bg-dash-blue p-1.5 rounded-lg">
          <BarChart3 size={16} className="text-white" />
        </div>
        <span className="font-bold text-dash-text text-sm">UTM Dashboard</span>
      </div>

      <nav className="flex-1 p-2 space-y-0.5">
        {/* Dashboards header */}
        <div className="px-3 py-2 text-xs font-semibold text-dash-muted uppercase tracking-wider mt-1">
          Dashboards
        </div>
        <div className="pl-2 space-y-0.5">
          {NAV_MAIN.map((item) => (
            <NavItem
              key={item.label}
              {...item}
              active={pathname === "/dashboard" && item.href === "/dashboard"}
            />
          ))}
        </div>

        {/* Config section */}
        <div className="px-3 py-2 text-xs font-semibold text-dash-muted uppercase tracking-wider mt-3">
          Configurações
        </div>
        <div className="pl-2 space-y-0.5">
          {NAV_CONFIG.map((item) => (
            <NavItem key={item.label} {...item} active={pathname === item.href && item.href === "/settings"} />
          ))}
        </div>

        <div className="px-3 py-2 mt-2">
          <Link
            href="/settings"
            className="flex items-center gap-2.5 text-sm text-dash-muted hover:text-dash-text transition-colors"
          >
            <Mic size={15} />
            Ouvir a voz...
          </Link>
        </div>
      </nav>

      <div className="p-3 border-t border-dash-border">
        <Link href="/settings" className="flex items-center gap-2 text-xs text-dash-muted hover:text-dash-text transition-colors px-3 py-2">
          <Settings size={14} />
          Configurações
        </Link>
      </div>
    </aside>
  )
}
