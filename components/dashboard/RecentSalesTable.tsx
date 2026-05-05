"use client"

import { useState } from "react"
import { Sale } from "@/types/database"
import { formatCurrency, formatDate } from "@/lib/utils"
import SaleStatusBadge from "./SaleStatusBadge"
import { Search, ChevronLeft, ChevronRight } from "lucide-react"

interface RecentSalesTableProps {
  initialData: Sale[]
  initialCount: number
}

const PAYMENT_LABELS: Record<string, string> = {
  credit_card: "Cartão",
  pix: "Pix",
  billet: "Boleto",
  debit_card: "Débito",
}

const PLATFORM_LABELS: Record<string, string> = {
  perfectpay: "PerfectPay",
  applyfy: "Applyfy",
}

export default function RecentSalesTable({
  initialData,
  initialCount,
}: RecentSalesTableProps) {
  const [search, setSearch] = useState("")
  const [data] = useState(initialData)
  const [page] = useState(0)
  const count = initialCount

  const filtered = search
    ? data.filter(
        (s) =>
          s.customer_email?.toLowerCase().includes(search.toLowerCase()) ||
          s.customer_name?.toLowerCase().includes(search.toLowerCase()) ||
          s.external_code?.toLowerCase().includes(search.toLowerCase())
      )
    : data

  return (
    <div className="bg-white rounded-xl border border-gray-200">
      <div className="p-5 border-b border-gray-100 flex items-center justify-between gap-3">
        <p className="text-sm font-semibold text-gray-700">Vendas recentes</p>
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar..."
            className="pl-8 pr-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-48"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50">
              <th className="text-left py-2.5 px-4 text-xs font-medium text-gray-500">Data</th>
              <th className="text-left py-2.5 px-4 text-xs font-medium text-gray-500">Cliente</th>
              <th className="text-left py-2.5 px-4 text-xs font-medium text-gray-500">Produto</th>
              <th className="text-left py-2.5 px-4 text-xs font-medium text-gray-500">Plataforma</th>
              <th className="text-right py-2.5 px-4 text-xs font-medium text-gray-500">Valor</th>
              <th className="text-left py-2.5 px-4 text-xs font-medium text-gray-500">Pagamento</th>
              <th className="text-left py-2.5 px-4 text-xs font-medium text-gray-500">Status</th>
              <th className="text-left py-2.5 px-4 text-xs font-medium text-gray-500">UTM Source</th>
              <th className="text-left py-2.5 px-4 text-xs font-medium text-gray-500">Campaign</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={9} className="py-12 text-center text-gray-400 text-sm">
                  Nenhuma venda encontrada
                </td>
              </tr>
            ) : (
              filtered.map((sale) => (
                <tr key={sale.id} className="hover:bg-gray-50 transition-colors">
                  <td className="py-3 px-4 text-gray-500 whitespace-nowrap text-xs">
                    {formatDate(sale.sale_date)}
                  </td>
                  <td className="py-3 px-4 max-w-[160px]">
                    <p className="font-medium text-gray-800 truncate text-xs">
                      {sale.customer_name ?? "-"}
                    </p>
                    <p className="text-gray-400 truncate text-xs">{sale.customer_email}</p>
                  </td>
                  <td className="py-3 px-4 text-gray-600 text-xs max-w-[140px] truncate">
                    {sale.product_name ?? "-"}
                  </td>
                  <td className="py-3 px-4 text-gray-500 text-xs whitespace-nowrap">
                    {PLATFORM_LABELS[sale.platform] ?? sale.platform}
                  </td>
                  <td className="py-3 px-4 text-right font-semibold text-gray-800 text-xs whitespace-nowrap">
                    {formatCurrency(sale.sale_amount)}
                  </td>
                  <td className="py-3 px-4 text-gray-500 text-xs">
                    {PAYMENT_LABELS[sale.payment_method ?? ""] ?? sale.payment_method ?? "-"}
                  </td>
                  <td className="py-3 px-4">
                    <SaleStatusBadge status={sale.status} />
                  </td>
                  <td className="py-3 px-4 text-gray-500 text-xs truncate max-w-[100px]">
                    {sale.utm_source ?? "-"}
                  </td>
                  <td className="py-3 px-4 text-gray-500 text-xs truncate max-w-[120px]">
                    {sale.utm_campaign ?? "-"}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="p-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
        <span>{count} vendas no período</span>
        <div className="flex items-center gap-2">
          <button
            disabled={page === 0}
            className="p-1 rounded hover:bg-gray-100 disabled:opacity-30"
          >
            <ChevronLeft size={14} />
          </button>
          <span>Página {page + 1}</span>
          <button
            disabled={(page + 1) * 25 >= count}
            className="p-1 rounded hover:bg-gray-100 disabled:opacity-30"
          >
            <ChevronRight size={14} />
          </button>
        </div>
      </div>
    </div>
  )
}
