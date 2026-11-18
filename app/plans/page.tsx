import Link from "next/link"
import { getCurrentUser, getPlans } from "@/lib/data"
import { AppNav } from "@/components/app-nav"
import { InvestDialog } from "@/components/invest-dialog"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Toaster } from "@/components/ui/sonner"
import { formatCurrency } from "@/lib/format"

export default async function PlansPage() {
  const { profile } = await getCurrentUser()
  const plans = await getPlans()

  return (
    <div className="app-bg app-shell flex min-h-dvh flex-col pb-24 lg:pb-0">
      <AppNav isAdmin={profile.role === "admin"} userName={profile.name || profile.username} userEmail={profile.email} />
      <Toaster position="top-center" richColors />

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6">
        <div className="mb-2 flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="eyebrow">VIP plans</p>
            <h1 className="mt-1 font-heading text-3xl font-bold">Investment Plans</h1>
            <p className="mt-1 text-sm text-muted-foreground sm:text-base">Choose a plan and start earning daily returns.</p>
          </div>
          <Badge className="border border-[#cfe6d4] bg-[#eaf3ec] px-3.5 py-1.5 text-sm text-primary hover:bg-[#eaf3ec]">
            <i className="fa-solid fa-wallet mr-2" aria-hidden="true" />
            Balance: {formatCurrency(profile.wallet_balance)}
          </Badge>
        </div>

        {plans.length === 0 ? (
          <Card className="surface-card mt-8 rounded-3xl">
            <CardContent className="flex flex-col items-center gap-4 px-6 py-16 text-center">
              <span className="action-icon action-icon--green h-16 w-16 rounded-3xl text-3xl">
                <i className="fa-solid fa-layer-group" aria-hidden="true" />
              </span>
              <div>
                <h2 className="font-heading text-2xl font-bold">No plans available yet</h2>
                <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-muted-foreground sm:text-base">
                  New investment plans are being prepared and will appear here soon. In the meantime, you can top up
                  your wallet so you are ready to invest the moment a plan goes live.
                </p>
              </div>
              <div className="flex flex-wrap justify-center gap-3">
                <Button nativeButton={false} render={<Link href="/dashboard">Go to dashboard</Link>} />
                <Button variant="outline" nativeButton={false} render={<Link href="/team">Invite &amp; earn meanwhile</Link>} />
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {plans.map((plan) => (
              <Card key={plan.id} className={`plan-card flex flex-col rounded-3xl ${plan.featured ? "plan-card--featured" : ""}`}>
                {plan.featured && (
                  <Badge className="plan-featured-badge absolute -top-3 left-1/2 z-10 -translate-x-1/2">
                    <i className="fa-solid fa-crown mr-1.5" aria-hidden="true" /> Most popular
                  </Badge>
                )}
                <CardContent className="flex flex-1 flex-col gap-4 p-6">
                  <span className="plan-icon-chip h-12 w-12 rounded-xl">
                    <i className={`fa-solid ${plan.icon} text-xl`} aria-hidden="true" />
                  </span>
                  <div>
                    <h3 className="font-heading text-lg font-bold">{plan.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {formatCurrency(plan.min_deposit)} – {formatCurrency(plan.max_deposit)}
                    </p>
                  </div>
                  <div className="flex items-end gap-1">
                    <span className="font-heading text-4xl font-extrabold text-primary">{plan.daily_profit}%</span>
                    <span className="mb-1.5 text-sm text-muted-foreground">/ day</span>
                  </div>
                  <ul className="flex flex-1 flex-col gap-2.5 border-t border-border pt-4 text-sm text-muted-foreground">
                    <li className="flex items-center gap-2.5">
                      <i className="fa-solid fa-clock w-4 text-primary" aria-hidden="true" /> {plan.duration_days} days duration
                    </li>
                    <li className="flex items-center gap-2.5">
                      <i className="fa-solid fa-chart-line w-4 text-primary" aria-hidden="true" /> {plan.total_return}% total return
                    </li>
                    <li className="flex items-center gap-2.5">
                      <i className="fa-solid fa-bolt w-4 text-primary" aria-hidden="true" /> Daily auto payouts
                    </li>
                  </ul>
                  <InvestDialog plan={plan} balance={Number(profile.wallet_balance)} featured={plan.featured} />
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
