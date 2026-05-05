export interface Sale {
  id: string
  user_id: string
  platform: "perfectpay" | "applyfy"
  external_code: string
  platform_unique_key: string
  sale_amount: number
  installment_amount: number | null
  installments: number | null
  currency: string
  status: string
  status_detail: string | null
  payment_method: string | null
  product_name: string | null
  customer_name: string | null
  customer_email: string | null
  customer_phone: string | null
  utm_source: string | null
  utm_medium: string | null
  utm_campaign: string | null
  utm_content: string | null
  utm_term: string | null
  raw_payload: unknown
  sale_date: string | null
  approved_at: string | null
  created_at: string
}

export interface Profile {
  id: string
  email: string
  webhook_token: string
  created_at: string
}

export interface PushSubscription {
  id: string
  user_id: string
  endpoint: string
  p256dh: string
  auth: string
  created_at: string
}

export interface SummaryMetrics {
  approved_count: number
  pending_count: number
  refunded_count: number
  cancelled_count: number
  total_revenue: number
  pending_revenue: number
  avg_ticket: number
}

export interface RevenueByDay {
  day: string
  approved_revenue: number
  pending_revenue: number
  approved_count: number
}

export interface StatusBreakdown {
  status: string
  count: number
  revenue: number
}

export interface UtmBreakdownRow {
  utm_value: string | null
  sales_count: number
  revenue: number
  pct: number
}
