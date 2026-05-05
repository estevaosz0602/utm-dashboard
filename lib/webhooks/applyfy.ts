import { NormalizedSale } from "@/types/webhook"

const STATUS_MAP: Record<string, string> = {
  paid: "approved",
  approved: "approved",
  complete: "approved",
  completed: "approved",
  pending: "pending",
  waiting_payment: "pending",
  refunded: "refunded",
  reversed: "refunded",
  cancelled: "cancelled",
  canceled: "cancelled",
  chargeback: "chargeback",
}

// Resolve a field from a payload using dot-notation candidates
function resolve(payload: Record<string, unknown>, candidates: string[]): string | null {
  for (const candidate of candidates) {
    if (candidate.includes(".")) {
      const parts = candidate.split(".")
      let current: unknown = payload
      for (const part of parts) {
        if (current && typeof current === "object") {
          current = (current as Record<string, unknown>)[part]
        } else {
          current = undefined
          break
        }
      }
      if (current != null && current !== "") return String(current)
    } else {
      const val = payload[candidate]
      if (val != null && val !== "") return String(val)
    }
  }
  return null
}

function resolveNumber(payload: Record<string, unknown>, candidates: string[]): number | null {
  const val = resolve(payload, candidates)
  if (val == null) return null
  const num = parseFloat(val.replace(",", "."))
  return isNaN(num) ? null : num
}

export function normalizeApplyfy(
  payload: Record<string, unknown>
): NormalizedSale | null {
  const code = resolve(payload, [
    "id",
    "transaction_id",
    "order_id",
    "code",
    "external_id",
    "sale_id",
  ])
  if (!code) return null

  const rawStatus = resolve(payload, [
    "status",
    "payment_status",
    "order_status",
    "state",
  ]) ?? "pending"
  const status = STATUS_MAP[rawStatus.toLowerCase()] || "pending"
  const platform_unique_key = `${code}_${rawStatus}`

  const saleAmount = resolveNumber(payload, [
    "amount",
    "value",
    "total",
    "sale_amount",
    "price",
    "gross_amount",
  ]) ?? 0

  // Log unrecognized top-level fields for future mapping
  const knownFields = new Set([
    "id","transaction_id","order_id","code","external_id","sale_id",
    "status","payment_status","order_status","state",
    "amount","value","total","sale_amount","price","gross_amount",
    "customer","buyer","client","user",
    "product","item","plan",
    "utm_source","utm_medium","utm_campaign","utm_content","utm_term",
    "utmSource","utmMedium","utmCampaign","utmContent","utmTerm",
    "tracking","tracker","meta",
    "created_at","updated_at","date","paid_at",
    "payment_method","method","type",
    "installments","parcelas",
  ])
  const unknownFields = Object.keys(payload).filter(k => !knownFields.has(k))
  if (unknownFields.length > 0) {
    console.warn("[Applyfy] Unmapped fields:", unknownFields)
  }

  const customerObj = (payload.customer || payload.buyer || payload.client || payload.user) as Record<string, unknown> | null

  return {
    platform: "applyfy",
    external_code: code,
    platform_unique_key,
    sale_amount: saleAmount,
    installment_amount: null,
    installments: resolveNumber(payload, ["installments", "parcelas"]),
    currency: "BRL",
    status,
    status_detail: rawStatus,
    payment_method: resolve(payload, ["payment_method", "method", "type"]),
    product_name: resolve(payload, ["product.name", "item.name", "plan.name", "product_name"]),
    customer_name: resolve(
      customerObj
        ? { ...payload, _name: customerObj.name || customerObj.full_name || customerObj.fullName }
        : payload,
      ["_name", "customer.name", "customer.full_name", "buyer.name", "client.name"]
    ),
    customer_email: resolve(
      customerObj
        ? { ...payload, _email: customerObj.email }
        : payload,
      ["_email", "customer.email", "buyer.email", "client.email"]
    ),
    customer_phone: resolve(
      customerObj
        ? { ...payload, _phone: customerObj.phone || customerObj.telephone }
        : payload,
      ["_phone", "customer.phone", "buyer.phone"]
    ),
    utm_source: resolve(payload, ["utm_source", "utmSource", "tracking.utm_source", "meta.utm_source"]),
    utm_medium: resolve(payload, ["utm_medium", "utmMedium", "tracking.utm_medium", "meta.utm_medium"]),
    utm_campaign: resolve(payload, ["utm_campaign", "utmCampaign", "tracking.utm_campaign", "meta.utm_campaign"]),
    utm_content: resolve(payload, ["utm_content", "utmContent", "tracking.utm_content", "meta.utm_content"]),
    utm_term: resolve(payload, ["utm_term", "utmTerm", "tracking.utm_term", "meta.utm_term"]),
    sale_date: resolve(payload, ["created_at", "date", "created"]),
    approved_at: resolve(payload, ["paid_at", "approved_at", "updated_at"]),
    raw_payload: payload,
  }
}
