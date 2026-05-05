import { NextRequest, NextResponse } from "next/server"
import { createServiceClient } from "@/lib/supabase/service"
import { normalizeApplyfy } from "@/lib/webhooks/applyfy"
import { sendPushToUser } from "@/lib/push"
import { formatCurrency } from "@/lib/utils"

export async function POST(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token")
  if (!token) {
    return NextResponse.json({ error: "Token required" }, { status: 401 })
  }

  const supabase = createServiceClient()

  const { data: profile } = await supabase
    .from("profiles")
    .select("id")
    .eq("webhook_token", token)
    .single()

  if (!profile) {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 })
  }

  let payload: unknown
  try {
    payload = await req.json()
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 })
  }

  const normalized = normalizeApplyfy(payload as Record<string, unknown>)
  if (!normalized) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 })
  }

  const { error } = await supabase.from("sales").upsert(
    {
      user_id: profile.id,
      ...normalized,
    },
    {
      onConflict: "user_id,platform,platform_unique_key",
      ignoreDuplicates: false,
    }
  )

  if (error) {
    console.error("[Applyfy webhook] DB error:", error)
  }

  if (normalized.status === "approved") {
    sendPushToUser(profile.id, {
      title: "Nova venda aprovada!",
      body: `${formatCurrency(normalized.sale_amount)} — ${normalized.customer_name ?? normalized.customer_email ?? "Cliente"}${normalized.utm_source ? ` • ${normalized.utm_source}` : ""}`,
      url: "/dashboard",
    }).catch(console.error)
  }

  return NextResponse.json({ received: true })
}
