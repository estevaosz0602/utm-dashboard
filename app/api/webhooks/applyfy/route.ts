import { NextRequest, NextResponse } from "next/server"
import { createServiceClient } from "@/lib/supabase/service"
import { normalizeApplyfy } from "@/lib/webhooks/applyfy"
import { sendPushToUser } from "@/lib/push"
import { formatCurrency } from "@/lib/utils"

const USER_ID = process.env.APP_USER_ID!

export async function POST(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token")
  if (!token || token !== process.env.WEBHOOK_SECRET) {
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

  const supabase = createServiceClient()
  await supabase.from("sales").upsert(
    { user_id: USER_ID, ...normalized },
    { onConflict: "user_id,platform,platform_unique_key", ignoreDuplicates: false }
  )

  if (normalized.status === "approved") {
    sendPushToUser(USER_ID, {
      title: "Nova venda aprovada!",
      body: `${formatCurrency(normalized.sale_amount)} — ${normalized.customer_name ?? normalized.customer_email ?? "Cliente"}${normalized.utm_source ? ` • ${normalized.utm_source}` : ""}`,
    }).catch(console.error)
  }

  return NextResponse.json({ received: true })
}
