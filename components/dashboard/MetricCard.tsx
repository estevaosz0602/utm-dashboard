interface MetricCardProps {
  title: string
  value: string
  subtitle?: string
  valueColor?: "default" | "green" | "blue" | "yellow"
  info?: string
}

const VALUE_COLORS = {
  default: "text-white",
  green: "text-green-400",
  blue: "text-blue-400",
  yellow: "text-yellow-400",
}

export default function MetricCard({ title, value, subtitle, valueColor = "default", info }: MetricCardProps) {
  return (
    <div className="rounded-xl p-4 border border-dash-border" style={{ background: "#131f35" }}>
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs text-dash-muted font-medium">{title}</p>
        {info && <span className="text-dash-muted text-xs">ⓘ</span>}
      </div>
      <p className={`text-xl font-bold ${VALUE_COLORS[valueColor]}`}>{value}</p>
      {subtitle && <p className="text-xs text-dash-muted mt-1">{subtitle}</p>}
    </div>
  )
}
