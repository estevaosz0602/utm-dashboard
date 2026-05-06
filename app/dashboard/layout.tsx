import Sidebar from "@/components/dashboard/Sidebar"
import BottomNav from "@/components/dashboard/BottomNav"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-dvh overflow-hidden" style={{ background: "#0f1729" }}>
      {/* Sidebar — visible only on md+ */}
      <div className="hidden md:flex md:flex-col md:shrink-0">
        <Sidebar />
      </div>

      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        {/* Top bar */}
        <header
          className="border-b border-dash-border px-4 py-3 flex items-center justify-between shrink-0"
          style={{ background: "#0d1424", paddingTop: "max(12px, env(safe-area-inset-top))" }}
        >
          <h1 className="text-sm font-semibold text-dash-text">Dashboard — Principal</h1>
          <div className="flex items-center gap-3 text-xs text-dash-muted">
            <span className="text-blue-400 font-medium hidden sm:inline">Prêmios</span>
            <span className="text-dash-text font-semibold">R$ 0 / R$ 1M</span>
          </div>
        </header>

        {/* Scrollable content */}
        <main
          className="flex-1 overflow-auto"
          style={{ paddingBottom: "calc(64px + env(safe-area-inset-bottom))" }}
        >
          {children}
        </main>
      </div>

      {/* Bottom nav — visible only on mobile */}
      <BottomNav />
    </div>
  )
}
