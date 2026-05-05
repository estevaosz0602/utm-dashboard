import { cn } from "@/lib/utils"

const STATUS_CONFIG: Record<string, { label: string; className: string }> = {
  approved: { label: "Aprovado", className: "bg-green-100 text-green-800" },
  pending: { label: "Pendente", className: "bg-yellow-100 text-yellow-800" },
  refunded: { label: "Reembolsado", className: "bg-blue-100 text-blue-800" },
  cancelled: { label: "Cancelado", className: "bg-gray-100 text-gray-700" },
  chargeback: { label: "Chargeback", className: "bg-red-100 text-red-800" },
  processing: { label: "Processando", className: "bg-purple-100 text-purple-800" },
  mediation: { label: "Mediação", className: "bg-orange-100 text-orange-800" },
  authorized: { label: "Autorizado", className: "bg-teal-100 text-teal-800" },
}

export default function SaleStatusBadge({ status }: { status: string }) {
  const config = STATUS_CONFIG[status] ?? { label: status, className: "bg-gray-100 text-gray-700" }
  return (
    <span className={cn("inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium", config.className)}>
      {config.label}
    </span>
  )
}
