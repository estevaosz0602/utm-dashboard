export interface PerfectPayPayload {
  token?: string
  code?: string
  sale_amount?: number
  currency_enum?: string
  sale_status_enum?: number
  sale_status_detail?: string
  payment_method_enum?: number
  date_created?: string
  date_approved?: string
  installments?: number
  installment_amount?: number
  coupon_code?: string
  product?: {
    code?: string
    name?: string
    external_reference?: string
    guarantee?: string
  }
  plan?: {
    code?: string
    name?: string
  }
  customer?: {
    full_name?: string
    email?: string
    phone_area_code?: string
    phone_number?: string
  }
  // UTM fields (various possible formats)
  tracker_url_utm_source?: string
  tracker_url_utm_medium?: string
  tracker_url_utm_campaign?: string
  tracker_url_utm_content?: string
  tracker_url_utm_term?: string
  tracking?: Record<string, string>
  tracker?: Record<string, string>
  custom_fields?: Array<{ key: string; value: string }>
  [key: string]: unknown
}

export interface NormalizedSale {
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
  sale_date: string | null
  approved_at: string | null
  raw_payload: unknown
}
