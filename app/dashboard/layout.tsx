import Sidebar from "@/components/dashboard/Sidebar"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden" style={{ background: "#0f1729" }}>
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="border-b border-dash-border px-6 py-3 flex items-center justify-between shrink-0" style={{ background: "#0d1424" }}>
          <h1 className="text-sm font-semibold text-dash-text">Dashboard — Principal</h1>
          <div className="flex items-center gap-4 text-xs text-dash-muted">
            <span className="text-dash-blue font-medium">Prêmios</span>
            <span className="text-dash-text font-semibold">R$ 0 / R$ 1M</span>
          </div>
        </header>
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  )
}
