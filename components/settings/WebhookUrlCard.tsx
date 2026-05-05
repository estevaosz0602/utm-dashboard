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
    <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
      <div>
        <p className="font-semibold text-gray-900">{platform}</p>
        <p className="text-xs text-gray-500 mt-0.5">{instructions}</p>
      </div>

      <div className="flex gap-2">
        <input
          readOnly
          value={webhookUrl}
          className="flex-1 text-xs font-mono bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-gray-700 focus:outline-none"
        />
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors text-xs font-medium whitespace-nowrap"
        >
          {copied ? <Check size={13} /> : <Copy size={13} />}
          {copied ? "Copiado!" : "Copiar"}
        </button>
      </div>

      <div className="text-xs text-gray-500 bg-gray-50 rounded-lg px-3 py-2">
        <span className="font-medium text-gray-700">Método:</span> POST &nbsp;|&nbsp;
        <span className="font-medium text-gray-700">Content-Type:</span> application/json
      </div>
    </div>
  )
}
