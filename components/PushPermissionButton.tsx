"use client"

import { useState, useEffect } from "react"
import { Bell, BellOff } from "lucide-react"

export default function PushPermissionButton() {
  const [status, setStatus] = useState<"default" | "granted" | "denied" | "unsupported">("default")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!("Notification" in window) || !("serviceWorker" in navigator)) {
      setStatus("unsupported")
      return
    }
    setStatus(Notification.permission as "default" | "granted" | "denied")
  }, [])

  async function subscribe() {
    setLoading(true)
    try {
      const permission = await Notification.requestPermission()
      setStatus(permission)
      if (permission !== "granted") return

      const reg = await navigator.serviceWorker.ready
      const existing = await reg.pushManager.getSubscription()
      const sub = existing ?? await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
      })

      await fetch("/api/push/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(sub.toJSON()),
      })
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  async function unsubscribe() {
    setLoading(true)
    try {
      const reg = await navigator.serviceWorker.ready
      const sub = await reg.pushManager.getSubscription()
      if (sub) {
        await fetch("/api/push/subscribe", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ endpoint: sub.endpoint }),
        })
        await sub.unsubscribe()
        setStatus("default")
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  if (status === "unsupported") return null

  if (status === "granted") {
    return (
      <button
        onClick={unsubscribe}
        disabled={loading}
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium bg-green-50 text-green-700 hover:bg-green-100 transition-colors disabled:opacity-50"
        title="Notificações ativas — clique para desativar"
      >
        <Bell size={13} />
        Notificações ativas
      </button>
    )
  }

  return (
    <button
      onClick={subscribe}
      disabled={loading || status === "denied"}
      className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors disabled:opacity-50"
      title={status === "denied" ? "Permissão negada no browser" : "Ativar notificações push"}
    >
      <BellOff size={13} />
      {status === "denied" ? "Notificações bloqueadas" : "Ativar notificações"}
    </button>
  )
}
