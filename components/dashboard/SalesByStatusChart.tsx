"use client"

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts"
import { StatusBreakdown } from "@/types/database"
import { formatCurrency } from "@/lib/utils"

const STATUS_COLORS: Record<string, string> = {
  approved: "#22c55e",
  pending: "#f59e0b",
  refunded: "#3b82f6",
  cancelled: "#9ca3af",
  chargeback: "#ef4444",
  processing: "#a855f7",
  mediation: "#f97316",
  authorized: "#14b8a6",
}

const STATUS_LABELS: Record<string, string> = {
  approved: "Aprovado",
  pending: "Pendente",
  refunded: "Reembolsado",
  cancelled: "Cancelado",
  chargeback: "Chargeback",
  processing: "Processando",
  mediation: "Mediação",
  authorized: "Autorizado",
}

function CustomTooltip({ active, payload }: { active?: boolean; payload?: { name: string; value: number; payload: StatusBreakdown }[] }) {
  if (!active || !payload?.length) return null
  const d = payload[0]
  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-3 text-sm">
      <p className="font-medium">{STATUS_LABELS[d.name] ?? d.name}</p>
      <p className="text-gray-600">{d.value} vendas</p>
      <p className="text-gray-600">{formatCurrency(d.payload.revenue)}</p>
    </div>
  )
}

export default function SalesByStatusChart({ data }: { data: StatusBreakdown[] }) {
  if (data.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <p className="text-sm font-semibold text-gray-700 mb-4">Vendas por status</p>
        <div className="h-48 flex items-center justify-center text-gray-400 text-sm">
          Nenhum dado
        </div>
      </div>
    )
  }

  const chartData = data.map((d) => ({
    ...d,
    name: d.status,
    value: d.count,
  }))

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <p className="text-sm font-semibold text-gray-700 mb-4">Vendas por status</p>
      <ResponsiveContainer width="100%" height={220}>
        <PieChart>
          <Pie
            data={chartData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            innerRadius={55}
            outerRadius={85}
            strokeWidth={2}
          >
            {chartData.map((entry) => (
              <Cell
                key={entry.status}
                fill={STATUS_COLORS[entry.status] ?? "#6b7280"}
              />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend
            formatter={(value) => STATUS_LABELS[value] ?? value}
            wrapperStyle={{ fontSize: 12 }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
