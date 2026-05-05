import { createServiceClient as createClient } from "@/lib/supabase/service"
import type {
  SummaryMetrics,
  RevenueByDay,
  StatusBreakdown,
  UtmBreakdownRow,
  Sale,
} from "@/types/database"

export async function getSummaryMetrics(
  userId: string,
  from: Date,
  to: Date
): Promise<SummaryMetrics> {
  const supabase = createClient()
  const { data } = await supabase
    .from("sales")
    .select("status, sale_amount")
    .eq("user_id", userId)
    .gte("sale_date", from.toISOString())
    .lte("sale_date", to.toISOString())

  const empty: SummaryMetrics = {
    approved_count: 0, pending_count: 0, refunded_count: 0,
    cancelled_count: 0, total_revenue: 0, pending_revenue: 0, avg_ticket: 0,
  }
  if (!data || data.length === 0) return empty

  for (const row of data) {
    const amt = row.sale_amount ?? 0
    if (row.status === "approved") {
      empty.approved_count++
      empty.total_revenue += amt
    } else if (row.status === "pending") {
      empty.pending_count++
      empty.pending_revenue += amt
    } else if (row.status === "refunded") {
      empty.refunded_count++
    } else if (row.status === "cancelled" || row.status === "chargeback") {
      empty.cancelled_count++
    }
  }
  empty.avg_ticket = empty.approved_count > 0 ? empty.total_revenue / empty.approved_count : 0
  return empty
}

export async function getRevenueByDay(
  userId: string,
  from: Date,
  to: Date
): Promise<RevenueByDay[]> {
  const supabase = createClient()
  const { data } = await supabase
    .from("sales")
    .select("sale_date, sale_amount, status")
    .eq("user_id", userId)
    .gte("sale_date", from.toISOString())
    .lte("sale_date", to.toISOString())
    .in("status", ["approved", "pending"])
    .order("sale_date", { ascending: true })

  if (!data) return []

  const byDay = new Map<
    string,
    { approved_revenue: number; pending_revenue: number; approved_count: number }
  >()

  for (const row of data) {
    const day = row.sale_date?.split("T")[0] ?? "unknown"
    const existing = byDay.get(day) ?? {
      approved_revenue: 0,
      pending_revenue: 0,
      approved_count: 0,
    }
    if (row.status === "approved") {
      existing.approved_revenue += row.sale_amount ?? 0
      existing.approved_count += 1
    } else {
      existing.pending_revenue += row.sale_amount ?? 0
    }
    byDay.set(day, existing)
  }

  return Array.from(byDay.entries()).map(([day, vals]) => ({
    day,
    ...vals,
  }))
}

export async function getSalesByStatus(
  userId: string,
  from: Date,
  to: Date
): Promise<StatusBreakdown[]> {
  const supabase = createClient()
  const { data } = await supabase
    .from("sales")
    .select("status, sale_amount")
    .eq("user_id", userId)
    .gte("sale_date", from.toISOString())
    .lte("sale_date", to.toISOString())

  if (!data) return []

  const byStatus = new Map<string, { count: number; revenue: number }>()
  for (const row of data) {
    const existing = byStatus.get(row.status) ?? { count: 0, revenue: 0 }
    existing.count += 1
    existing.revenue += row.sale_amount ?? 0
    byStatus.set(row.status, existing)
  }

  return Array.from(byStatus.entries()).map(([status, vals]) => ({
    status,
    ...vals,
  }))
}

export async function getUtmBreakdown(
  userId: string,
  from: Date,
  to: Date,
  col: "utm_source" | "utm_medium" | "utm_campaign" | "utm_content" | "utm_term"
): Promise<UtmBreakdownRow[]> {
  const supabase = createClient()
  const { data } = await supabase
    .from("sales")
    .select(`${col}, sale_amount`)
    .eq("user_id", userId)
    .eq("status", "approved")
    .gte("sale_date", from.toISOString())
    .lte("sale_date", to.toISOString())

  if (!data) return []

  const byUtm = new Map<string, { sales_count: number; revenue: number }>()
  let totalRevenue = 0

  for (const row of data) {
    const val = (row as Record<string, unknown>)[col] as string | null
    const key = val ?? "(none)"
    const existing = byUtm.get(key) ?? { sales_count: 0, revenue: 0 }
    existing.sales_count += 1
    existing.revenue += (row.sale_amount as number) ?? 0
    totalRevenue += (row.sale_amount as number) ?? 0
    byUtm.set(key, existing)
  }

  return Array.from(byUtm.entries())
    .map(([utm_value, vals]) => ({
      utm_value,
      ...vals,
      pct: totalRevenue > 0 ? Math.round((vals.revenue / totalRevenue) * 10000) / 100 : 0,
    }))
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 50)
}

export async function getRecentSales(
  userId: string,
  from: Date,
  to: Date,
  options: {
    statusFilter?: string
    utmSourceFilter?: string
    page?: number
    search?: string
  } = {}
): Promise<{ data: Sale[]; count: number }> {
  const supabase = createClient()
  const page = options.page ?? 0
  const limit = 25

  let query = supabase
    .from("sales")
    .select("*", { count: "exact" })
    .eq("user_id", userId)
    .gte("sale_date", from.toISOString())
    .lte("sale_date", to.toISOString())
    .order("sale_date", { ascending: false })
    .range(page * limit, (page + 1) * limit - 1)

  if (options.statusFilter) {
    query = query.eq("status", options.statusFilter)
  }
  if (options.utmSourceFilter) {
    query = query.eq("utm_source", options.utmSourceFilter)
  }
  if (options.search) {
    query = query.or(
      `customer_email.ilike.%${options.search}%,customer_name.ilike.%${options.search}%,external_code.ilike.%${options.search}%`
    )
  }

  const { data, count } = await query
  return { data: (data as Sale[]) ?? [], count: count ?? 0 }
}
