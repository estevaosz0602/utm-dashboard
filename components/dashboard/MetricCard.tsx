import { cn } from "@/lib/utils"

interface MetricCardProps {
  title: string
  value: string
  subtitle?: string
  valueClass?: string
}

export default function MetricCard({ title, value, subtitle, valueClass }: MetricCardProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <p className="text-sm text-gray-500 font-medium">{title}</p>
      <p className={cn("text-2xl font-bold mt-1 text-gray-900", valueClass)}>{value}</p>
      {subtitle && <p className="text-xs text-gray-400 mt-1">{subtitle}</p>}
    </div>
  )
}
