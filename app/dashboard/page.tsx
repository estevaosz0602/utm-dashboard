export const dynamic = "force-dynamic"

import {
  getSummaryMetrics,
  getRevenueByDay,
  getSalesByStatus,
  getUtmBreakdown,
  getRecentSales,
} from "@/lib/queries/dashboard"
import { formatCurrency } from "@/lib/utils"
import MetricCard from "@/components/dashboard/MetricCard"
import RevenueChart from "@/components/dashboard/RevenueChart"
import SalesByStatusChart from "@/components/dashboard/SalesByStatusChart"
import UtmBreakdownTable from "@/components/dashboard/UtmBreakdownTable"
import RecentSalesTable from "@/components/dashboard/RecentSalesTable"
import DateRangeFilter from "@/components/dashboard/DateRangeFilter"
import { getDateRange } from "@/lib/date-range"
import PushPermissionButton from "@/components/PushPermissionButton"
import { Suspense } from "react"

const USER_ID = process.env.APP_USER_ID!

interface PageProps {
  searchParams: { days?: string }
}

export default async function DashboardPage({ searchParams }: PageProps) {
  const { from, to } = getDateRange(searchParams.days ?? "7")

  const [metrics, revenueByDay, salesByStatus, utmSource, utmMedium, utmCampaign, recentSales] =
    await Promise.all([
      getSummaryMetrics(USER_ID, from, to),
      getRevenueByDay(USER_ID, from, to),
      getSalesByStatus(USER_ID, from, to),
      getUtmBreakdown(USER_ID, from, to, "utm_source"),
      getUtmBreakdown(USER_ID, from, to, "utm_medium"),
      getUtmBreakdown(USER_ID, from, to, "utm_campaign"),
      getRecentSales(USER_ID, from, to),
    ])

  const avgTicket = metrics.approved_count > 0
    ? metrics.total_revenue / metrics.approved_count
    : 0

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h1 className="text-xl font-bold text-gray-900">Dashboard</h1>
        <div className="flex items-center gap-3">
          <PushPermissionButton />
          <Suspense>
            <DateRangeFilter />
          </Suspense>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Receita aprovada"
          value={formatCurrency(metrics.total_revenue)}
          subtitle={`${metrics.approved_count} vendas`}
          valueClass="text-green-700"
        />
        <MetricCard
          title="Receita pendente"
          value={formatCurrency(metrics.pending_revenue)}
          subtitle={`${metrics.pending_count} aguardando`}
          valueClass="text-yellow-600"
        />
        <MetricCard
          title="Ticket médio"
          value={formatCurrency(avgTicket)}
          subtitle="vendas aprovadas"
        />
        <MetricCard
          title="Reembolsos"
          value={String(metrics.refunded_count)}
          subtitle={`${metrics.cancelled_count} cancelados`}
          valueClass="text-blue-600"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <RevenueChart data={revenueByDay} />
        </div>
        <SalesByStatusChart data={salesByStatus} />
      </div>

      <UtmBreakdownTable
        data={{
          utm_source: utmSource,
          utm_medium: utmMedium,
          utm_campaign: utmCampaign,
        }}
      />

      <RecentSalesTable
        initialData={recentSales.data}
        initialCount={recentSales.count}
      />
    </div>
  )
}
