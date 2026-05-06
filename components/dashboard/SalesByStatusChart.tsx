"use client"

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts"
import { StatusBreakdown } from "@/types/database"
import { formatCurrency } from "@/lib/utils"

// Group by payment method (we reuse status data here but label as payment breakdown)
const PAYMENT_COLORS: Record<string, string> = {
  approved: "#3b82f6",
  pending:  "#06b6d4",
  refunded: "#f59e0b",
  cancelled:"#ef4444",
  chargeback:"#8b5cf6",
}

const LABELS: Record<string, string> = {
  approved:  "Aprovado",
  pending:   "Pendente",
  refunded:  "Reembolsado",
  cancelled: "Cancelado",
  chargeback:"Chargeback",
}

function CustomTooltip({ active, payload }: { active?: boolean; payload?: { name: string; value: number; payload: StatusBreakdown }[] }) {
  if (!active || !payload?.length) return null
  const d = payload[0]
  return (
    <div className="border border-dash-border rounded-lg shadow p-3 text-xs" style={{ background: "#131f35" }}>
      <p className="font-semibold text-white mb-1">{LABELS[d.name] ?? d.name}</p>
      <p className="text-dash-muted">{d.value} vendas</p>
      <p className="text-dash-muted">{formatCurrency(d.payload.revenue)}</p>
    </div>
  )
}

export default function SalesByStatusChart({ data }: { data: StatusBreakdown[] }) {
  const total = data.reduce((s, d) => s + d.count, 0)
  const chartData = data.map(d => ({ ...d, name: d.status, value: d.count }))

  return (
    <div className="rounded-xl p-5 border border-dash-border" style={{ background: "#131f35" }}>
      <p className="text-sm font-semibold text-dash-text mb-4">Vendas por Status</p>
      {total === 0 ? (
        <div className="h-48 flex items-center justify-center text-dash-muted text-sm">Nenhum dado</div>
      ) : (
        <ResponsiveContainer width="100%" height={220}>
          <PieChart>
            <Pie data={chartData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={55} outerRadius={85} strokeWidth={2} stroke="#0f1729">
              {chartData.map(entry => (
                <Cell key={entry.status} fill={PAYMENT_COLORS[entry.status] ?? "#64748b"} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend
              formatter={v => <span style={{ color: "#94a3b8", fontSize: 11 }}>{LABELS[v] ?? v}</span>}
              wrapperStyle={{ fontSize: 11 }}
            />
          </PieChart>
        </ResponsiveContainer>
      )}
    </div>
  )
}
