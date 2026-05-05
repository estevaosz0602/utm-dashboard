import webpush from "web-push"
import { createServiceClient } from "@/lib/supabase/service"

let vapidInitialized = false
function ensureVapid() {
  if (vapidInitialized) return
  const subject = process.env.VAPID_SUBJECT
  const pubKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY
  const privKey = process.env.VAPID_PRIVATE_KEY
  if (!subject || !pubKey || !privKey || pubKey === "sua_vapid_public_key") return
  webpush.setVapidDetails(subject, pubKey, privKey)
  vapidInitialized = true
}

export async function sendPushToUser(
  userId: string,
  notification: { title: string; body: string; url?: string }
) {
  ensureVapid()
  if (!vapidInitialized) return

  const supabase = createServiceClient()
  const { data: subs } = await supabase
    .from("push_subscriptions")
    .select("*")
    .eq("user_id", userId)

  if (!subs || subs.length === 0) return

  const payload = JSON.stringify({
    title: notification.title,
    body: notification.body,
    url: notification.url || "/dashboard",
  })

  await Promise.allSettled(
    subs.map(async (sub) => {
      try {
        await webpush.sendNotification(
          {
            endpoint: sub.endpoint,
            keys: { p256dh: sub.p256dh, auth: sub.auth },
          },
          payload
        )
      } catch (err: unknown) {
        // 410 Gone = subscription expired, remove it
        if (
          err &&
          typeof err === "object" &&
          "statusCode" in err &&
          (err as { statusCode: number }).statusCode === 410
        ) {
          await supabase
            .from("push_subscriptions")
            .delete()
            .eq("endpoint", sub.endpoint)
        }
      }
    })
  )
}
