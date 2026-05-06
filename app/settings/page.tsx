export const dynamic = "force-dynamic"

import WebhookUrlCard from "@/components/settings/WebhookUrlCard"

export default function SettingsPage() {
  const token = process.env.WEBHOOK_SECRET ?? ""
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? ""

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-xl font-bold text-dash-text">Integrações</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <WebhookUrlCard
          platform="PerfectPay"
          webhookUrl={`${appUrl}/api/webhooks/perfectpay?token=${token}`}
          instructions="Cole em: PerfectPay → Ferramentas → PostBack – Webhook → selecione o produto"
        />
        <WebhookUrlCard
          platform="Applyfy"
          webhookUrl={`${appUrl}/api/webhooks/applyfy?token=${token}`}
          instructions="Cole nas configurações de webhook do seu produto no Applyfy"
        />
      </div>

      <div className="rounded-xl border border-blue-500/30 p-4 text-sm" style={{ background: "#0f1e35" }}>
        <p className="font-semibold text-blue-400 mb-1">Notificações no iPhone</p>
        <ol className="list-decimal list-inside space-y-1 text-xs text-dash-muted mt-2">
          <li>Abra este site no Safari do iPhone</li>
          <li>Toque no botão Compartilhar (caixa com seta para cima)</li>
          <li>Escolha <strong className="text-dash-text">Adicionar à Tela de Início</strong></li>
          <li>Abra o app instalado na home screen</li>
          <li>Clique em <strong className="text-dash-text">Ativar notificações</strong> no topo do dashboard</li>
          <li>iOS 16.4+ necessário</li>
        </ol>
      </div>
    </div>
  )
}
