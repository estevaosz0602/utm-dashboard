import { subDays } from "date-fns"

export function getDateRange(daysParam: string | null) {
  const days = parseInt(daysParam ?? "7", 10)
  const to = new Date()
  const from = days === 0
    ? new Date(to.getFullYear(), to.getMonth(), to.getDate())
    : subDays(to, days)
  return { from, to }
}
