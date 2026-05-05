export const dynamic = "force-dynamic"

import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import WebhookUrlCard from "@/components/settings/WebhookUrlCard"

export default async function SettingsPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const { data: profile } = await supabase
    .from("profiles")
    .select("webhook_token")
    .eq("id", user.id)
    .single()

  const token = profile?.webhook_token ?? ""
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? ""

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-xl font-bold text-gray-900">Configurações</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <WebhookUrlCard
          platform="PerfectPay"
          webhookUrl={`${appUrl}/api/webhooks/perfectpay?token=${token}`}
          instructions="Cole esta URL em: PerfectPay → Ferramentas → PostBack – Webhook → selecione o produto → adicione a URL"
        />
        <WebhookUrlCard
          platform="Applyfy"
          webhookUrl={`${appUrl}/api/webhooks/applyfy?token=${token}`}
          instructions="Cole esta URL nas configurações de webhook do Applyfy para o seu produto"
        />
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800">
        <p className="font-semibold mb-1">Token secreto</p>
        <p>
          O token embutido na URL é o seu segredo de autenticação. Não compartilhe estas URLs publicamente.
          Se o token for comprometido, você pode gerar um novo abaixo (os webhooks existentes passarão a falhar até você atualizar a URL nas plataformas).
        </p>
        <div className="mt-3 flex items-center gap-2">
          <code className="font-mono text-xs bg-amber-100 px-2 py-1 rounded break-all">
            {token}
          </code>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm text-blue-800">
        <p className="font-semibold mb-1">Notificações no iPhone</p>
        <ol className="list-decimal list-inside space-y-1 text-xs text-blue-700 mt-2">
          <li>Abra este site no Safari do iPhone</li>
          <li>Toque no botão Compartilhar (caixa com seta para cima)</li>
          <li>Escolha <strong>Adicionar à Tela de Início</strong></li>
          <li>Abra o app instalado na home screen</li>
          <li>Clique em <strong>Ativar notificações</strong> no topo do dashboard</li>
          <li>iOS 16.4+ necessário</li>
        </ol>
      </div>
    </div>
  )
}
