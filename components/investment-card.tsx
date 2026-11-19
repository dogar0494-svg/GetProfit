import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { formatCurrency, formatDate } from "@/lib/format"
import type { Investment } from "@/lib/types"

export function InvestmentCard({ investment }: { investment: Investment }) {
  const start = new Date(investment.start_date).getTime()
  const end = new Date(investment.end_date).getTime()
  const now = Date.now()
  const pct = Math.min(100, Math.max(0, ((now - start) / (end - start)) * 100))
  const daysLeft = Math.max(0, Math.ceil((end - now) / (1000 * 60 * 60 * 24)))
  const dailyAmount = (Number(investment.amount) * Number(investment.plan_daily_profit)) / 100
  const completed = investment.status === "completed"

  return (
    <div className="glass-card rounded-2xl p-5">
      <div className="mb-3 flex items-center justify-between gap-3">
        <div className="min-w-0">
          <h3 className="truncate font-semibold">{investment.plan_name}</h3>
          <p className="text-sm text-muted-foreground">{formatCurrency(investment.amount)} invested</p>
        </div>
        <Badge className={`shrink-0 ${completed ? "bg-muted text-muted-foreground" : "bg-success/15 text-success"}`}>
          {completed ? "Completed" : "Active"}
        </Badge>
      </div>

      <div className="mb-4 grid grid-cols-3 gap-3 text-center">
        <div className="min-w-0 rounded-lg bg-muted/40 p-2">
          <p className="text-xs text-muted-foreground">Daily</p>
          <p className="break-words text-xs font-semibold text-success min-[400px]:text-sm">{formatCurrency(dailyAmount)}</p>
        </div>
        <div className="min-w-0 rounded-lg bg-muted/40 p-2">
          <p className="text-xs text-muted-foreground">Earned</p>
          <p className="break-words text-xs font-semibold min-[400px]:text-sm">{formatCurrency(investment.profit_earned)}</p>
        </div>
        <div className="rounded-lg bg-muted/40 p-2">
          <p className="text-xs text-muted-foreground">Days left</p>
          <p className="text-sm font-semibold">{completed ? 0 : daysLeft}</p>
        </div>
      </div>

      <Progress value={completed ? 100 : pct} className="h-2" />
      <div className="mt-2 flex justify-between text-xs text-muted-foreground">
        <span>{formatDate(investment.start_date)}</span>
        <span>{formatDate(investment.end_date)}</span>
      </div>
    </div>
  )
}
