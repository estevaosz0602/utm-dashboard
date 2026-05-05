import { PerfectPayPayload, NormalizedSale } from "@/types/webhook"

const STATUS_MAP: Record<number, string> = {
  1: "approved",
  2: "pending",
  3: "refunded",
  4: "cancelled",
  5: "chargeback",
  6: "processing",
  7: "mediation",
  8: "authorized",
}

const PAYMENT_METHOD_MAP: Record<number, string> = {
  1: "credit_card",
  2: "billet",
  3: "pix",
  4: "debit_card",
}

function extractUtms(payload: PerfectPayPayload) {
  // Strategy 1: tracker_url_utm_* at root
  if (payload.tracker_url_utm_source) {
    return {
      utm_source: payload.tracker_url_utm_source || null,
      utm_medium: payload.tracker_url_utm_medium || null,
      utm_campaign: payload.tracker_url_utm_campaign || null,
      utm_content: payload.tracker_url_utm_content || null,
      utm_term: payload.tracker_url_utm_term || null,
    }
  }

  // Strategy 2: tracking or tracker nested object
  const trackingObj = payload.tracking || payload.tracker
  if (trackingObj && typeof trackingObj === "object") {
    const src =
      trackingObj.utm_source ||
      trackingObj.utmSource ||
      trackingObj.source ||
      null
    if (src) {
      return {
        utm_source: src,
        utm_medium: trackingObj.utm_medium || trackingObj.utmMedium || null,
        utm_campaign:
          trackingObj.utm_campaign || trackingObj.utmCampaign || null,
        utm_content: trackingObj.utm_content || trackingObj.utmContent || null,
        utm_term: trackingObj.utm_term || trackingObj.utmTerm || null,
      }
    }
  }

  // Strategy 3: custom_fields array with utm_ prefixed keys
  if (Array.isArray(payload.custom_fields)) {
    const utms: Record<string, string> = {}
    for (const field of payload.custom_fields) {
      if (field.key && field.key.startsWith("utm_")) {
        utms[field.key] = field.value
      }
    }
    if (utms.utm_source) {
      return {
        utm_source: utms.utm_source || null,
        utm_medium: utms.utm_medium || null,
        utm_campaign: utms.utm_campaign || null,
        utm_content: utms.utm_content || null,
        utm_term: utms.utm_term || null,
      }
    }
  }

  // Strategy 4: scan all root keys for utm_ prefix
  const utms: Record<string, string> = {}
  for (const [key, val] of Object.entries(payload)) {
    if (key.startsWith("utm_") && typeof val === "string") {
      utms[key] = val
    }
  }
  if (utms.utm_source) {
    return {
      utm_source: utms.utm_source || null,
      utm_medium: utms.utm_medium || null,
      utm_campaign: utms.utm_campaign || null,
      utm_content: utms.utm_content || null,
      utm_term: utms.utm_term || null,
    }
  }

  return {
    utm_source: null,
    utm_medium: null,
    utm_campaign: null,
    utm_content: null,
    utm_term: null,
  }
}

export function normalizePerfectPay(
  payload: PerfectPayPayload
): NormalizedSale | null {
  const code = payload.code
  if (!code) return null

  const statusEnum = payload.sale_status_enum ?? 0
  const status = STATUS_MAP[statusEnum] || "unknown"
  const platform_unique_key = `${code}_${statusEnum}`

  const saleAmount = payload.sale_amount ?? 0
  const utms = extractUtms(payload)

  const phone =
    payload.customer?.phone_area_code && payload.customer?.phone_number
      ? `(${payload.customer.phone_area_code}) ${payload.customer.phone_number}`
      : null

  return {
    platform: "perfectpay",
    external_code: code,
    platform_unique_key,
    sale_amount: saleAmount,
    installment_amount: payload.installment_amount ?? null,
    installments: payload.installments ?? null,
    currency: "BRL",
    status,
    status_detail: payload.sale_status_detail ?? null,
    payment_method:
      PAYMENT_METHOD_MAP[payload.payment_method_enum ?? 0] || null,
    product_name: payload.product?.name ?? null,
    customer_name: payload.customer?.full_name ?? null,
    customer_email: payload.customer?.email ?? null,
    customer_phone: phone,
    ...utms,
    sale_date: payload.date_created ?? null,
    approved_at: payload.date_approved ?? null,
    raw_payload: payload,
  }
}
