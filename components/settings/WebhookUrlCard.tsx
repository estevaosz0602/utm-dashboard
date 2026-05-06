"use client"

import { useState } from "react"
import { Copy, Check } from "lucide-react"

interface WebhookUrlCardProps {
  platform: string
  webhookUrl: string
  instructions: string
}

export default function WebhookUrlCard({
  platform,
  webhookUrl,
  instructions,
}: WebhookUrlCardProps) {
  const [copied, setCopied] = useState(false)

  async function handleCopy() {
    await navigator.clipboard.writeText(webhookUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="rounded-xl border border-dash-border p-5 space-y-4" style={{ background: "#131f35" }}>
      <div>
        <p className="font-semibold text-dash-text">{platform}</p>
        <p className="text-xs text-dash-muted mt-0.5">{instructions}</p>
      </div>

      <div className="flex gap-2">
        <input
          readOnly
          value={webhookUrl}
          className="flex-1 text-xs font-mono border border-dash-border rounded-lg px-3 py-2 text-dash-muted focus:outline-none"
          style={{ background: "#0f1729" }}
        />
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 transition-colors text-xs font-medium whitespace-nowrap"
        >
          {copied ? <Check size={13} /> : <Copy size={13} />}
          {copied ? "Copiado!" : "Copiar"}
        </button>
      </div>

      <div className="text-xs text-dash-muted rounded-lg px-3 py-2 border border-dash-border" style={{ background: "#0f1729" }}>
        <span className="font-medium text-dash-text">Método:</span> POST &nbsp;|&nbsp;
        <span className="font-medium text-dash-text">Content-Type:</span> application/json
      </div>
    </div>
  )
}
