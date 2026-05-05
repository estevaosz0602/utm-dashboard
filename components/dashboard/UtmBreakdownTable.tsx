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

interface UtmBreakdownTableProps {
  data: Partial<Record<UtmCol, UtmBreakdownRow[]>>
}

export default function UtmBreakdownTable({ data }: UtmBreakdownTableProps) {
  const [activeTab, setActiveTab] = useState<UtmCol>("utm_source")
  const rows = data[activeTab] ?? []

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <p className="text-sm font-semibold text-gray-700 mb-4">Atribuição UTM</p>

      <div className="flex gap-1 mb-4 overflow-x-auto">
        {TABS.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
              activeTab === key
                ? "bg-blue-50 text-blue-700"
                : "text-gray-500 hover:bg-gray-100"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {rows.length === 0 ? (
        <p className="text-sm text-gray-400 text-center py-8">Nenhum dado</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left py-2 px-1 text-xs font-medium text-gray-500">Valor</th>
                <th className="text-right py-2 px-1 text-xs font-medium text-gray-500">Vendas</th>
                <th className="text-right py-2 px-1 text-xs font-medium text-gray-500">Receita</th>
                <th className="text-right py-2 px-1 text-xs font-medium text-gray-500">%</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {rows.map((row, i) => (
                <tr key={i} className="hover:bg-gray-50">
                  <td className="py-2 px-1 text-gray-800 font-medium max-w-[180px] truncate">
                    {row.utm_value ?? "(none)"}
                  </td>
                  <td className="py-2 px-1 text-right text-gray-600">{row.sales_count}</td>
                  <td className="py-2 px-1 text-right text-gray-800 font-medium">
                    {formatCurrency(row.revenue)}
                  </td>
                  <td className="py-2 px-1 text-right">
                    <span className="text-xs text-gray-500">{row.pct}%</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
