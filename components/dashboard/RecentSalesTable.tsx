"use client"

import { useState } from "react"
import { Sale } from "@/types/database"
import { formatCurrency, formatDate } from "@/lib/utils"
import SaleStatusBadge from "./SaleStatusBadge"
import { Search, ChevronLeft, ChevronRight } from "lucide-react"

const PAYMENT_LABELS: Record<string, string> = {
  credit_card: "Cartão", pix: "Pix", billet: "Boleto", debit_card: "Débito",
}
const PLATFORM_LABELS: Record<string, string> = {
  perfectpay: "PerfectPay", applyfy: "Applyfy",
}

export default function RecentSalesTable({ initialData, initialCount }: { initialData: Sale[]; initialCount: number }) {
  const [search, setSearch] = useState("")
  const [page] = useState(0)

  const filtered = search
    ? initialData.filter(s =>
        s.customer_email?.toLowerCase().includes(search.toLowerCase()) ||
        s.customer_name?.toLowerCase().includes(search.toLowerCase()) ||
        s.external_code?.toLowerCase().includes(search.toLowerCase())
      )
    : initialData

  return (
    <div className="rounded-xl border border-dash-border" style={{ background: "#131f35" }}>
      <div className="p-4 border-b border-dash-border flex items-center justify-between gap-3">
        <p className="text-sm font-semibold text-dash-text">Vendas recentes</p>
        <div className="relative">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-dash-muted" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Buscar..."
            className="pl-8 pr-3 py-1.5 text-xs border border-dash-border rounded-lg focus:outline-none focus:border-blue-500 w-44 text-dash-text"
            style={{ background: "#0f1729" }}
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-dash-border">
              {["Data", "Cliente", "Produto", "Plataforma", "Valor", "Pagamento", "Status", "UTM Source", "Campaign"].map(h => (
                <th key={h} className="text-left px-4 py-2.5 font-medium text-dash-muted whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={9} className="text-center py-12 text-dash-muted">Nenhuma venda encontrada</td></tr>
            ) : (
              filtered.map(sale => (
                <tr key={sale.id} className="border-b border-dash-border/40 hover:bg-dash-border/20 transition-colors">
                  <td className="px-4 py-3 text-dash-muted whitespace-nowrap">{formatDate(sale.sale_date)}</td>
                  <td className="px-4 py-3 max-w-[140px]">
                    <p className="text-dash-text font-medium truncate">{sale.customer_name ?? "-"}</p>
                    <p className="text-dash-muted truncate">{sale.customer_email}</p>
                  </td>
                  <td className="px-4 py-3 text-dash-muted max-w-[120px] truncate">{sale.product_name ?? "-"}</td>
                  <td className="px-4 py-3 text-dash-muted whitespace-nowrap">{PLATFORM_LABELS[sale.platform] ?? sale.platform}</td>
                  <td className="px-4 py-3 text-green-400 font-bold whitespace-nowrap">{formatCurrency(sale.sale_amount)}</td>
                  <td className="px-4 py-3 text-dash-muted">{PAYMENT_LABELS[sale.payment_method ?? ""] ?? sale.payment_method ?? "-"}</td>
                  <td className="px-4 py-3"><SaleStatusBadge status={sale.status} /></td>
                  <td className="px-4 py-3 text-dash-muted max-w-[100px] truncate">{sale.utm_source ?? "-"}</td>
                  <td className="px-4 py-3 text-dash-muted max-w-[120px] truncate">{sale.utm_campaign ?? "-"}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="p-4 border-t border-dash-border flex items-center justify-between text-xs text-dash-muted">
        <span>{initialCount} vendas no período</span>
        <div className="flex items-center gap-2">
          <button disabled={page === 0} className="p-1 rounded hover:bg-dash-border disabled:opacity-30">
            <ChevronLeft size={14} />
          </button>
          <span>Pág. {page + 1}</span>
          <button disabled={(page + 1) * 25 >= initialCount} className="p-1 rounded hover:bg-dash-border disabled:opacity-30">
            <ChevronRight size={14} />
          </button>
        </div>
      </div>
    </div>
  )
}
