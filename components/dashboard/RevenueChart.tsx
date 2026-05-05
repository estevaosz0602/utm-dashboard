"use client"

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts"
import { RevenueByDay } from "@/types/database"
import { formatCurrency } from "@/lib/utils"
import { format, parseISO } from "date-fns"
import { ptBR } from "date-fns/locale"

interface RevenueChartProps {
  data: RevenueByDay[]
}

function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: { value: number; name: string }[]; label?: string }) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-3 text-sm">
      <p className="font-medium text-gray-700 mb-1">{label}</p>
      {payload.map((p) => (
        <p key={p.name} className="text-gray-600">
          {p.name}: {formatCurrency(p.value)}
        </p>
      ))}
    </div>
  )
}

export default function RevenueChart({ data }: RevenueChartProps) {
  const formatted = data.map((d) => ({
    ...d,
    dayLabel: format(parseISO(d.day), "dd/MM", { locale: ptBR }),
  }))

  if (formatted.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <p className="text-sm font-semibold text-gray-700 mb-4">Receita por dia</p>
        <div className="h-48 flex items-center justify-center text-gray-400 text-sm">
          Nenhuma venda no período
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <p className="text-sm font-semibold text-gray-700 mb-4">Receita por dia</p>
      <ResponsiveContainer width="100%" height={220}>
        <AreaChart data={formatted}>
          <defs>
            <linearGradient id="approvedGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#22c55e" stopOpacity={0.15} />
              <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="pendingGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.15} />
              <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="dayLabel" tick={{ fontSize: 11, fill: "#9ca3af" }} />
          <YAxis
            tickFormatter={(v) => `R$${(v / 1000).toFixed(0)}k`}
            tick={{ fontSize: 11, fill: "#9ca3af" }}
            width={55}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            formatter={(value) => value === "approved_revenue" ? "Aprovado" : "Pendente"}
            wrapperStyle={{ fontSize: 12 }}
          />
          <Area
            type="monotone"
            dataKey="approved_revenue"
            stroke="#22c55e"
            fill="url(#approvedGrad)"
            strokeWidth={2}
            name="approved_revenue"
          />
          <Area
            type="monotone"
            dataKey="pending_revenue"
            stroke="#f59e0b"
            fill="url(#pendingGrad)"
            strokeWidth={2}
            name="pending_revenue"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
