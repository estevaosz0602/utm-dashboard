"use client"

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { RevenueByDay } from "@/types/database"
import { formatCurrency } from "@/lib/utils"
import { format, parseISO } from "date-fns"
import { ptBR } from "date-fns/locale"

function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: { value: number; name: string }[]; label?: string }) {
  if (!active || !payload?.length) return null
  return (
    <div className="border border-dash-border rounded-lg p-3 text-xs" style={{ background: "#131f35" }}>
      <p className="text-dash-muted mb-1">{label}</p>
      {payload.map(p => (
        <p key={p.name} className="text-white font-medium">
          {p.name === "approved_revenue" ? "Aprovado" : "Pendente"}: {formatCurrency(p.value)}
        </p>
      ))}
    </div>
  )
}

export default function RevenueChart({ data }: { data: RevenueByDay[] }) {
  const formatted = data.map(d => ({
    ...d,
    dayLabel: format(parseISO(d.day), "dd/MM", { locale: ptBR }),
  }))

  return (
    <div className="rounded-xl p-5 border border-dash-border" style={{ background: "#131f35" }}>
      <p className="text-sm font-semibold text-dash-text mb-4">Faturamento por dia</p>
      {formatted.length === 0 ? (
        <div className="h-48 flex items-center justify-center text-dash-muted text-sm">Nenhuma venda no período</div>
      ) : (
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={formatted}>
            <defs>
              <linearGradient id="gApproved" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#22c55e" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="gPending" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e2d45" />
            <XAxis dataKey="dayLabel" tick={{ fontSize: 11, fill: "#64748b" }} axisLine={false} tickLine={false} />
            <YAxis tickFormatter={v => `R$${(v/1000).toFixed(0)}k`} tick={{ fontSize: 11, fill: "#64748b" }} axisLine={false} tickLine={false} width={50} />
            <Tooltip content={<CustomTooltip />} />
            <Area type="monotone" dataKey="approved_revenue" stroke="#22c55e" fill="url(#gApproved)" strokeWidth={2} name="approved_revenue" />
            <Area type="monotone" dataKey="pending_revenue" stroke="#3b82f6" fill="url(#gPending)" strokeWidth={2} name="pending_revenue" />
          </AreaChart>
        </ResponsiveContainer>
      )}
    </div>
  )
}
