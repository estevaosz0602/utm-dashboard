import { NextRequest, NextResponse } from "next/server"
import { createServiceClient } from "@/lib/supabase/service"

const USER_ID = process.env.APP_USER_ID!

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { endpoint, keys } = body
  if (!endpoint || !keys?.p256dh || !keys?.auth) {
    return NextResponse.json({ error: "Invalid subscription" }, { status: 400 })
  }

  const supabase = createServiceClient()
  await supabase.from("push_subscriptions").upsert(
    { user_id: USER_ID, endpoint, p256dh: keys.p256dh, auth: keys.auth },
    { onConflict: "endpoint" }
  )

  return NextResponse.json({ ok: true })
}

export async function DELETE(req: NextRequest) {
  const { endpoint } = await req.json()
  const supabase = createServiceClient()
  await supabase.from("push_subscriptions").delete().eq("endpoint", endpoint)
  return NextResponse.json({ ok: true })
}
