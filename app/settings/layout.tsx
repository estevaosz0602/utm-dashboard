import Sidebar from "@/components/dashboard/Sidebar"
import BottomNav from "@/components/dashboard/BottomNav"

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-dvh overflow-hidden" style={{ background: "#0f1729" }}>
      <div className="hidden md:flex md:flex-col md:shrink-0">
        <Sidebar />
      </div>
      <main
        className="flex-1 overflow-auto"
        style={{ paddingBottom: "calc(64px + env(safe-area-inset-bottom))" }}
      >
        {children}
      </main>
      <BottomNav />
    </div>
  )
}
