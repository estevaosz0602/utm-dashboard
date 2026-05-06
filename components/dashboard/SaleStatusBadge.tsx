const STATUS_CONFIG: Record<string, { label: string; className: string }> = {
  approved:   { label: "Aprovado",    className: "bg-green-500/20 text-green-400" },
  pending:    { label: "Pendente",    className: "bg-yellow-500/20 text-yellow-400" },
  refunded:   { label: "Reembolsado", className: "bg-blue-500/20 text-blue-400" },
  cancelled:  { label: "Cancelado",   className: "bg-gray-500/20 text-gray-400" },
  chargeback: { label: "Chargeback",  className: "bg-red-500/20 text-red-400" },
  processing: { label: "Processando", className: "bg-purple-500/20 text-purple-400" },
  mediation:  { label: "Mediação",    className: "bg-orange-500/20 text-orange-400" },
}

export default function SaleStatusBadge({ status }: { status: string }) {
  const cfg = STATUS_CONFIG[status] ?? { label: status, className: "bg-gray-500/20 text-gray-400" }
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${cfg.className}`}>
      {cfg.label}
    </span>
  )
}
