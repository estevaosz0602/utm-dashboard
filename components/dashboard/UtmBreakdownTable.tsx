"use client"

import { useState } from "react"
import { UtmBreakdownRow } from "@/types/database"
import { formatCurrency } from "@/lib/utils"

const TABS = [
  { key: "utm_source", label: "Source" },
  { key: "utm_medium", label: "Medium" },
  { key: "utm_campaign", label: "Campaign" },
  { key: "utm_content", label: "Content" },
  { key: "utm_term", label: "Term" },
] as const

type UtmCol = (typeof TABS)[number]["key"]

export default function UtmBreakdownTable({ data }: { data: Partial<Record<UtmCol, UtmBreakdownRow[]>> }) {
  const [activeTab, setActiveTab] = useState<UtmCol>("utm_source")
  const rows = data[activeTab] ?? []

  return (
    <div className="rounded-xl border border-dash-border" style={{ background: "#131f35" }}>
      <div className="p-4 border-b border-dash-border flex items-center justify-between">
        <p className="text-sm font-semibold text-dash-text">Atribuição UTM</p>
        <div className="flex gap-1">
          {TABS.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                activeTab === key
                  ? "bg-blue-500/20 text-blue-400"
                  : "text-dash-muted hover:text-dash-text"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {rows.length === 0 ? (
        <p className="text-dash-muted text-sm text-center py-10">Nenhum dado no período</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-dash-border">
                <th className="text-left px-4 py-2.5 text-xs font-medium text-dash-muted">Valor</th>
                <th className="text-right px-4 py-2.5 text-xs font-medium text-dash-muted">Vendas</th>
                <th className="text-right px-4 py-2.5 text-xs font-medium text-dash-muted">Receita</th>
                <th className="text-right px-4 py-2.5 text-xs font-medium text-dash-muted">%</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr key={i} className="border-b border-dash-border/50 hover:bg-dash-border/20 transition-colors">
                  <td className="px-4 py-2.5 text-dash-text font-medium truncate max-w-[200px]">
                    {row.utm_value ?? "(none)"}
                  </td>
                  <td className="px-4 py-2.5 text-right text-dash-muted">{row.sales_count}</td>
                  <td className="px-4 py-2.5 text-right text-green-400 font-semibold">{formatCurrency(row.revenue)}</td>
                  <td className="px-4 py-2.5 text-right text-dash-muted text-xs">{row.pct}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
