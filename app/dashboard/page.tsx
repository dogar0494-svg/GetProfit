import Link from "next/link"
import { getCurrentUser, getSettings, getTransactions, getInvestments, getTeam } from "@/lib/data"
import { AppNav } from "@/components/app-nav"
import { DepositDialog } from "@/components/deposit-dialog"
import { WithdrawDialog } from "@/components/withdraw-dialog"
import { ImpersonationBanner } from "@/components/impersonation-banner"
import { getImpersonationContext } from "@/lib/impersonation"
import { TransactionList } from "@/components/transaction-list"
import { InvestmentCard } from "@/components/investment-card"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Toaster } from "@/components/ui/sonner"
import { formatCurrency, formatUsdFromPkr } from "@/lib/format"

export default async function DashboardPage() {
  const { profile } = await getCurrentUser()
  const impersonation = await getImpersonationContext()
  const viewedProfile = impersonation
    ? ((await (async () => {
        const { createAdminClient } = await import("@/lib/supabase/admin")
        const admin = createAdminClient()
        const { data } = await admin.from("profiles").select("*").eq("id", impersonation.targetId).single()
        return data
      })()) ?? profile)
    : profile

  const defaultTeam = { level1: [], level2: [], level3: [] }
  const teamPromise = viewedProfile.referral_code
    ? getTeam(viewedProfile.id, viewedProfile.referral_code)
    : Promise.resolve(defaultTeam)
  const [settingsResult, transactionsResult, investmentsResult, teamResult] = await Promise.allSettled([
    getSettings(),
    getTransactions(viewedProfile.id),
    getInvestments(viewedProfile.id),
    teamPromise,
  ])
  const settings = settingsResult.status === "fulfilled" ? settingsResult.value : null
  const transactions = transactionsResult.status === "fulfilled" ? transactionsResult.value : []
  const investments = investmentsResult.status === "fulfilled" ? investmentsResult.value : []
  const team = teamResult.status === "fulfilled" ? teamResult.value : defaultTeam
  ;[settingsResult, transactionsResult, investmentsResult, teamResult].forEach((result, index) => {
    if (result.status === "rejected") console.error(`[v0] Dashboard data load failed (${index})`, result.reason)
  })

  const activeInvestments = investments.filter((investment) => investment.status === "active")
  const isSettled = (status: string) => status === "approved" || status === "completed"
  const sumAmounts = (type: string, statuses: string[]) =>
    transactions
      .filter((transaction) => transaction.type === type && statuses.includes(transaction.status))
      .reduce((total, transaction) => total + Number(transaction.amount || 0), 0)
  const totalDeposits = sumAmounts("deposit", ["approved", "completed"])
  const totalWithdrawals = sumAmounts("withdrawal", ["approved", "completed"])
  const pendingDeposits = sumAmounts("deposit", ["pending"])
  const pendingWithdrawals = sumAmounts("withdrawal", ["pending"])
  const teamSize = (team.level1?.length ?? 0) + team.level2.length + team.level3.length
  const teamInvest = [...(team.level1 ?? []), ...team.level2, ...team.level3].reduce(
    (total, member) => total + Number((member as { total_invested?: number | null }).total_invested || 0),
    0,
  )

  const stats = [
    { label: "Pending deposit", value: pendingDeposits, kind: "money", icon: "fa-clock-rotate-left", status: "PENDING", chip: "bg-amber-100 text-amber-800", iconClass: "action-icon--gold" },
    { label: "Pending withdrawal", value: pendingWithdrawals, kind: "money", icon: "fa-hourglass-half", status: "PENDING", chip: "bg-sky-100 text-sky-800", iconClass: "action-icon--teal" },
    { label: "Total invest", value: Number(viewedProfile.total_invested), kind: "money", icon: "fa-chart-pie", status: "ACTIVE", chip: "bg-emerald-100 text-emerald-800", iconClass: "action-icon--green" },
    { label: "Referral bonus", value: Number(viewedProfile.referral_earnings ?? 0), kind: "money", icon: "fa-gift", status: "REWARD", chip: "bg-violet-100 text-violet-800", iconClass: "action-icon--violet" },
    { label: "Team size", value: teamSize, kind: "count", icon: "fa-users", status: "DIRECT", chip: "bg-teal-100 text-teal-800", iconClass: "action-icon--teal" },
    { label: "Team invest", value: teamInvest, kind: "money", icon: "fa-fire", status: "VOLUME", chip: "bg-rose-100 text-rose-800", iconClass: "action-icon--gold" },
  ] as const

  return (
    <div className="app-bg app-shell flex min-h-dvh flex-col pb-24 lg:pb-0">
      {impersonation && <ImpersonationBanner userName={impersonation.targetName} />}
      <AppNav isAdmin={profile.role === "admin"} userName={profile.name || profile.username} userEmail={profile.email} />
      <Toaster position="top-center" richColors />

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 pb-12 pt-6 sm:px-6 sm:pt-9">
        {/* Greeting */}
        <div className="mb-6 flex flex-col gap-1 sm:mb-8">
          <p className="eyebrow">Your account</p>
          <h1 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl">
            Welcome back, {viewedProfile.name?.split(" ")[0] || viewedProfile.username || "investor"}
          </h1>
          <p className="text-sm text-muted-foreground sm:text-base">Your money, plans, and activity in one place.</p>
        </div>

        {/* Wallet hero */}
        <section className="wallet-hero mb-6 p-6 sm:mb-8 sm:p-8" aria-label="Wallet balance and totals">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-white/70">Wallet balance</p>
              <p className="mt-2 font-heading text-4xl font-extrabold leading-none sm:text-5xl">
                {formatCurrency(Number(viewedProfile.wallet_balance))}
              </p>
              <p className="mt-2.5 text-sm text-white/75">
                ≈ {formatUsdFromPkr(Number(viewedProfile.wallet_balance))} USDT · 1 USD ≈ 280 PKR · USDT values are
                estimates
              </p>
            </div>
            <span className="wallet-hero-chip">
              <i className="fa-solid fa-scale-balanced" aria-hidden="true" /> Rate 1 : 280
            </span>
          </div>

          <div className="mt-7 grid gap-3 sm:grid-cols-2">
            <div className="wallet-hero-stat flex items-center gap-3.5">
              <span className="wallet-hero-stat-icon">
                <i className="fa-solid fa-building-columns" aria-hidden="true" />
              </span>
              <div className="min-w-0">
                <p className="text-[0.65rem] font-bold uppercase tracking-[0.12em] text-white/65">Total deposit</p>
                <p className="mt-0.5 truncate font-heading text-xl font-bold">{formatCurrency(totalDeposits)}</p>
                <p className="text-xs text-white/65">{formatUsdFromPkr(totalDeposits)} USDT</p>
              </div>
            </div>
            <div className="wallet-hero-stat flex items-center gap-3.5">
              <span className="wallet-hero-stat-icon">
                <i className="fa-solid fa-wallet" aria-hidden="true" />
              </span>
              <div className="min-w-0">
                <p className="text-[0.65rem] font-bold uppercase tracking-[0.12em] text-white/65">Total withdraw</p>
                <p className="mt-0.5 truncate font-heading text-xl font-bold">{formatCurrency(totalWithdrawals)}</p>
                <p className="text-xs text-white/65">{formatUsdFromPkr(totalWithdrawals)} USDT</p>
              </div>
            </div>
          </div>
        </section>

        {/* Quick actions */}
        <section id="withdraw" className="mb-6 grid grid-cols-2 gap-3 sm:mb-8 sm:gap-4 lg:grid-cols-4" aria-label="Quick actions">
          <DepositDialog settings={settings} userId={viewedProfile.id} shortcut />
          <WithdrawDialog settings={settings} balance={Number(viewedProfile.wallet_balance)} shortcut />
          <Link href="/plans" className="action-card">
            <span className="action-icon action-icon--teal">
              <i className="fa-solid fa-layer-group" aria-hidden="true" />
            </span>
            <span>
              <span className="block font-heading text-base font-bold">My plan</span>
              <span className="mt-0.5 block text-xs text-muted-foreground">Browse VIP plans</span>
            </span>
          </Link>
          <Link href="/team" className="action-card">
            <span className="action-icon action-icon--violet">
              <i className="fa-solid fa-users" aria-hidden="true" />
            </span>
            <span>
              <span className="block font-heading text-base font-bold">Team</span>
              <span className="mt-0.5 block text-xs text-muted-foreground">Referrals &amp; rewards</span>
            </span>
          </Link>
        </section>

        {/* Trust strip */}
        <section className="trust-strip mb-9" aria-label="Platform highlights">
          <span className="trust-item">
            <span className="trust-icon"><i className="fa-solid fa-bolt" aria-hidden="true" /></span>
            <span className="trust-text"><small>Daily</small><strong>Profit Credit</strong></span>
          </span>
          <span className="trust-divider" aria-hidden="true" />
          <span className="trust-item">
            <span className="trust-icon"><i className="fa-solid fa-shield-halved" aria-hidden="true" /></span>
            <span className="trust-text"><small>Secure</small><strong>USDT Deposits</strong></span>
          </span>
          <span className="trust-divider" aria-hidden="true" />
          <span className="trust-item">
            <span className="trust-icon"><i className="fa-solid fa-user-shield" aria-hidden="true" /></span>
            <span className="trust-text"><small>Fast</small><strong>Admin Approval</strong></span>
          </span>
        </section>

        {/* Overview */}
        <section className="mb-10" aria-labelledby="overview-heading">
          <div className="mb-4 flex items-end justify-between gap-4">
            <div>
              <p className="eyebrow">A quick snapshot</p>
              <h2 id="overview-heading" className="mt-1 font-heading text-2xl font-bold">Overview</h2>
            </div>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-white px-3 py-1.5 text-[0.68rem] font-bold uppercase tracking-[0.08em] text-muted-foreground">
              <i className="fa-solid fa-calendar-days text-primary" aria-hidden="true" /> All time
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
            {stats.map((stat) => (
              <article key={stat.label} className="stat-card">
                <div className="flex items-start justify-between gap-2">
                  <span className={`action-icon ${stat.iconClass}`}>
                    <i className={`fa-solid ${stat.icon}`} aria-hidden="true" />
                  </span>
                  <span className={`stat-chip ${stat.chip}`}>{stat.status}</span>
                </div>
                <div>
                  <p className="text-[0.68rem] font-bold uppercase tracking-[0.1em] text-muted-foreground">{stat.label}</p>
                  <p className="mt-1 font-heading text-2xl font-extrabold leading-tight sm:text-[1.7rem]">
                    {stat.kind === "money" ? formatCurrency(stat.value) : stat.value.toLocaleString("en-US")}
                  </p>
                  {stat.kind === "money" && (
                    <p className="mt-0.5 text-xs text-muted-foreground">{formatUsdFromPkr(stat.value)} USDT</p>
                  )}
                </div>
              </article>
            ))}
          </div>
        </section>

        <div className="grid gap-8 lg:grid-cols-5">
          <section className="lg:col-span-3" aria-labelledby="active-plans-heading">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <p className="eyebrow">Growing balance</p>
                <h2 id="active-plans-heading" className="mt-1 font-heading text-xl font-bold">
                  Active plans{" "}
                  <span className="text-base font-semibold text-muted-foreground">({activeInvestments.length})</span>
                </h2>
              </div>
              <Button variant="ghost" size="sm" nativeButton={false} render={<Link href="/plans" />}>
                Explore plans <i className="fa-solid fa-arrow-right ml-1.5" aria-hidden="true" />
              </Button>
            </div>
            {activeInvestments.length === 0 ? (
              <Card className="surface-card rounded-3xl">
                <CardContent className="flex flex-col items-center gap-3 py-12 text-center">
                  <span className="action-icon action-icon--green h-14 w-14 rounded-2xl text-2xl">
                    <i className="fa-solid fa-seedling" aria-hidden="true" />
                  </span>
                  <div>
                    <p className="font-heading font-bold">No active plans yet</p>
                    <p className="mt-1 text-sm text-muted-foreground">Choose a plan to see your progress here.</p>
                  </div>
                  <Button nativeButton={false} render={<Link href="/plans">Browse plans</Link>} />
                </CardContent>
              </Card>
            ) : (
              <div className="flex flex-col gap-4">
                {activeInvestments.map((investment) => <InvestmentCard key={investment.id} investment={investment} />)}
              </div>
            )}
          </section>

          <section className="lg:col-span-2" aria-labelledby="recent-activity-heading">
            <div className="mb-4">
              <p className="eyebrow">Latest updates</p>
              <h2 id="recent-activity-heading" className="mt-1 font-heading text-xl font-bold">Recent activity</h2>
            </div>
            <Card className="surface-card rounded-3xl">
              <CardHeader className="pb-0"><CardTitle className="sr-only">Recent transactions</CardTitle></CardHeader>
              <CardContent className="pt-2"><TransactionList transactions={transactions.slice(0, 8)} /></CardContent>
            </Card>
          </section>
        </div>
      </main>
    </div>
  )
}
