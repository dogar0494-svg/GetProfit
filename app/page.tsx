import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { getPlans } from "@/lib/data"
import { BrandLogo } from "@/components/brand-logo"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { formatCurrency } from "@/lib/format"

const TICKER_ITEMS = [
  "Daily profit credited to wallets",
  "All amounts in Pakistani Rupees (PKR)",
  "JazzCash & Easypaisa deposits",
  "Withdrawals to your own account",
  "Every deposit verified by a person",
  "3-level referral rewards",
]

const SHOWCASE_PLANS = [
  { name: "Starter", icon: "fa-seedling", min: 1400, max: 14000, daily: 1.5, days: 30, total: 145, featured: false },
  { name: "Growth", icon: "fa-chart-line", min: 14000, max: 140000, daily: 2.5, days: 45, total: 212, featured: true },
  { name: "Premium", icon: "fa-crown", min: 140000, max: 1400000, daily: 4, days: 60, total: 340, featured: false },
]

const FAQS = [
  {
    q: "How do I start earning?",
    a: "Create a free account, send PKR to the JazzCash or Easypaisa number shown in the app, upload your receipt screenshot, and pick a plan once the deposit is approved. Your plan then credits profit to your wallet every day.",
  },
  {
    q: "Which deposit methods are supported?",
    a: "Deposits are made in PKR through JazzCash or Easypaisa — send the amount to the account number shown in the app and upload your receipt screenshot. Withdrawals are paid to your own JazzCash or Easypaisa account after admin approval.",
  },
  {
    q: "How are deposits and withdrawals approved?",
    a: "Every deposit proof and every withdrawal request is reviewed manually by an administrator before money moves. That human check is what keeps accounts and balances protected.",
  },
  {
    q: "How does the referral program work?",
    a: "Share your personal referral link from your dashboard. You earn a bonus when your referrals deposit, across three levels of your team, and VIP milestones unlock extra rewards.",
  },
  {
    q: "Which currency does the platform use?",
    a: "Everything on InvestPro is in Pakistani Rupees (PKR) — deposits, plan amounts, daily profit and withdrawals are all calculated and paid in PKR, with no conversion rates or hidden charges.",
  },
]

export default async function HomePage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  const plans = await getPlans()

  const steps = [
    { icon: "fa-user-plus", title: "Create account", desc: "Sign up in under a minute with your details." },
    { icon: "fa-wallet", title: "Deposit funds", desc: "Send PKR via JazzCash or Easypaisa, upload your receipt, and get verified." },
    { icon: "fa-layer-group", title: "Choose a plan", desc: "Pick an investment plan that matches your budget." },
    { icon: "fa-sack-dollar", title: "Earn daily", desc: "Watch your wallet grow with daily returns." },
  ]

  return (
    <div className="app-bg flex min-h-dvh flex-col">
      {/* Header */}
      <header className="landing-header sticky top-0 z-40">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-3 py-3 sm:px-6">
          <BrandLogo />
          <nav className="hidden items-center gap-7 text-sm font-semibold text-muted-foreground lg:flex" aria-label="Sections">
            <Link href="#plans" className="hover:text-primary">Plans</Link>
            <Link href="#how" className="hover:text-primary">How it works</Link>
            <Link href="#features" className="hover:text-primary">Features</Link>
            <Link href="#faq" className="hover:text-primary">FAQ</Link>
          </nav>
          <nav className="flex shrink-0 items-center gap-1.5 sm:gap-2">
            {user ? (
              <Button nativeButton={false} render={<Link href="/dashboard">Dashboard</Link>} />
            ) : (
              <>
                <Button variant="ghost" nativeButton={false} render={<Link href="/login">Sign in</Link>} />
                <Button nativeButton={false} render={<Link href="/register">Get started</Link>} />
              </>
            )}
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="mx-auto grid w-full max-w-6xl items-center gap-14 px-4 pb-16 pt-14 sm:px-6 lg:grid-cols-2 lg:pb-24 lg:pt-20">
          <div className="flex flex-col items-start gap-6">
            <Badge className="border border-[#eadfae] bg-[#f7edd0] px-3 py-1.5 text-[#8a6d1f] hover:bg-[#f7edd0]">
              <span className="mr-2 h-2 w-2 rounded-full bg-[#c9a227]" aria-hidden="true" />
              Trusted by investors across Pakistan
            </Badge>
            <h1 className="font-heading text-balance text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
              Grow your wealth, <span className="hero-gradient-text">one day at a time.</span>
            </h1>
            <p className="max-w-md text-pretty text-base leading-relaxed text-muted-foreground md:text-lg">
              InvestPro makes it simple to invest and earn daily returns. Flexible plans, secure JazzCash &amp; Easypaisa
              deposits, and fast payouts — all in one bright, easy platform.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button size="lg" className="btn-gradient h-12 px-6 text-base" nativeButton={false} render={<Link href="/register" />}>
                Start investing <i className="fa-solid fa-arrow-right ml-2" aria-hidden="true" />
              </Button>
              <Button size="lg" variant="outline" className="h-12 px-6 text-base" nativeButton={false} render={<Link href="#plans" />}>
                View plans
              </Button>
            </div>
            <div className="mt-1 flex flex-wrap gap-x-9 gap-y-4">
              <div>
                <p className="font-heading text-2xl font-extrabold">10K+</p>
                <p className="text-sm text-muted-foreground">Active investors</p>
              </div>
              <div>
                <p className="font-heading text-2xl font-extrabold">Rs 50M+</p>
                <p className="text-sm text-muted-foreground">Paid out</p>
              </div>
              <div>
                <p className="font-heading text-2xl font-extrabold">Up to 6%</p>
                <p className="text-sm text-muted-foreground">Daily returns</p>
              </div>
            </div>
          </div>

          {/* Phone-style app preview cluster */}
          <div className="relative mx-auto w-fit lg:mx-0 lg:justify-self-end">
            <div className="phone-frame">
              <span className="phone-notch" aria-hidden="true" />
              <div className="flex flex-col gap-4 px-5 pb-6 pt-11">
                <div className="flex items-center gap-2.5">
                  <span className="grid h-9 w-9 place-items-center rounded-full bg-[#e3f2e7] text-xs font-bold text-primary">AK</span>
                  <div className="leading-tight">
                    <p className="text-[0.65rem] text-muted-foreground">Good morning</p>
                    <p className="text-sm font-bold">Ahmed Khan</p>
                  </div>
                  <span className="ml-auto grid h-8 w-8 place-items-center rounded-full border border-border bg-white text-xs text-muted-foreground">
                    <i className="fa-solid fa-bell" aria-hidden="true" />
                  </span>
                </div>

                <div className="phone-balance">
                  <p className="text-[0.62rem] font-bold uppercase tracking-[0.14em] text-white/65">Wallet balance</p>
                  <p className="mt-1 font-heading text-[1.65rem] font-extrabold leading-none">Rs 84,250</p>
                  <p className="mt-1.5 text-[0.7rem] text-white/70">Earning daily returns</p>
                </div>

                <div className="grid grid-cols-4 gap-2 text-center">
                  {[
                    { icon: "fa-building-columns", label: "Deposit" },
                    { icon: "fa-wallet", label: "Withdraw" },
                    { icon: "fa-layer-group", label: "My plan" },
                    { icon: "fa-users", label: "Team" },
                  ].map((a) => (
                    <div key={a.label} className="flex flex-col items-center gap-1.5">
                      <span className="grid h-11 w-11 place-items-center rounded-2xl border border-border bg-white text-sm text-primary shadow-sm">
                        <i className={`fa-solid ${a.icon}`} aria-hidden="true" />
                      </span>
                      <span className="text-[0.6rem] font-semibold text-muted-foreground">{a.label}</span>
                    </div>
                  ))}
                </div>

                <div className="flex flex-col gap-2">
                  {[
                    { icon: "fa-chart-pie", label: "Total invest", value: "Rs 56,000" },
                    { icon: "fa-gift", label: "Referral bonus", value: "Rs 3,150" },
                    { icon: "fa-fire", label: "Team invest", value: "Rs 128,400" },
                  ].map((row) => (
                    <div key={row.label} className="flex items-center gap-3 rounded-xl border border-border bg-white px-3 py-2.5">
                      <span className="grid h-8 w-8 place-items-center rounded-lg bg-[#e3f2e7] text-xs text-primary">
                        <i className={`fa-solid ${row.icon}`} aria-hidden="true" />
                      </span>
                      <span className="text-xs font-medium text-muted-foreground">{row.label}</span>
                      <span className="ml-auto text-sm font-bold">{row.value}</span>
                    </div>
                  ))}
                </div>

                <div className="rounded-xl border border-border bg-white px-3 py-3">
                  <div className="flex items-end justify-between gap-1.5" aria-hidden="true">
                    {[35, 48, 42, 60, 55, 72, 66, 84, 78, 95].map((h, i) => (
                      <span
                        key={i}
                        className={`w-full rounded-t-md ${i === 9 ? "bg-[#c9a227]" : "bg-[#0a6c3c]/75"}`}
                        style={{ height: `${h * 0.55}px` }}
                      />
                    ))}
                  </div>
                  <p className="mt-2 text-[0.65rem] font-semibold text-muted-foreground">Profit growth · last 10 days</p>
                </div>
              </div>
            </div>

            {/* Floating cards */}
            <div className="float-card -right-4 top-16 hidden w-48 sm:block lg:-right-14">
              <div className="flex items-center gap-2">
                <span className="grid h-8 w-8 place-items-center rounded-lg bg-[#f7edd0] text-xs text-[#8a6d1f]">
                  <i className="fa-solid fa-crown" aria-hidden="true" />
                </span>
                <p className="text-xs font-bold">Growth plan</p>
                <span className="ml-auto rounded-full bg-[#e3f2e7] px-2 py-0.5 text-[0.62rem] font-bold text-primary">Active</span>
              </div>
              <p className="mt-2.5 font-heading text-xl font-extrabold text-primary">
                2.5%<span className="text-xs font-semibold text-muted-foreground"> / day</span>
              </p>
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted">
                <div className="h-full w-2/3 rounded-full bg-primary" />
              </div>
              <p className="mt-1.5 text-[0.65rem] text-muted-foreground">Day 30 of 45 · on track</p>
            </div>

            <div className="float-card -left-4 bottom-24 hidden w-52 sm:block lg:-left-16">
              <div className="flex items-center gap-2.5">
                <span className="grid h-9 w-9 place-items-center rounded-full bg-[#e3f2e7] text-sm text-primary">
                  <i className="fa-solid fa-arrow-trend-up" aria-hidden="true" />
                </span>
                <div className="leading-tight">
                  <p className="text-[0.65rem] text-muted-foreground">Profit credited today</p>
                  <p className="text-sm font-extrabold text-primary">+ Rs 1,400</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Ticker */}
        <div className="border-y border-border bg-white/70 py-3">
          <div className="ticker" aria-hidden="true">
            <div className="ticker-track">
              {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, i) => (
                <span key={i} className="flex items-center gap-3 text-sm font-medium text-muted-foreground">
                  <i className="fa-solid fa-circle text-[0.4rem] text-[#c9a227]" aria-hidden="true" />
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stats band */}
      <section className="stats-band mt-16 lg:mt-24">
        <div className="mx-auto grid w-full max-w-6xl grid-cols-2 gap-8 px-4 py-10 sm:px-6 lg:grid-cols-4">
          {[
            { value: "10K+", label: "Active investors" },
            { value: "Rs 50M+", label: "Paid out to members" },
            { value: "2", label: "Payment methods supported" },
            { value: "3 levels", label: "Referral reward depth" },
          ].map((s) => (
            <div key={s.label} className="text-center lg:text-left">
              <p className="font-heading text-3xl font-extrabold lg:text-4xl">{s.value}</p>
              <p className="mt-1 text-sm text-white/70">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Plans showcase */}
      <section id="plans" className="mx-auto w-full max-w-6xl scroll-mt-24 px-4 py-16 sm:px-6 lg:py-24">
        <div className="mb-12 text-center">
          <p className="eyebrow">Investment plans</p>
          <h2 className="mt-2 font-heading text-3xl font-bold sm:text-4xl">Pick a plan, earn every day</h2>
          <p className="mx-auto mt-3 max-w-lg text-muted-foreground">
            Every plan credits a fixed daily profit to your wallet for its full duration. No hidden steps.
          </p>
        </div>

        {plans.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
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
                  <Button
                    className={plan.featured ? "btn-gold mt-2 w-full" : "mt-2 w-full"}
                    variant={plan.featured ? "default" : "outline"}
                    nativeButton={false}
                    render={<Link href="/register">Invest now</Link>}
                  />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <>
            <div className="grid gap-6 md:grid-cols-3">
              {SHOWCASE_PLANS.map((plan) => (
                <Card key={plan.name} className={`plan-card flex flex-col rounded-3xl ${plan.featured ? "plan-card--featured" : ""}`}>
                  {plan.featured && (
                    <Badge className="plan-featured-badge absolute -top-3 left-1/2 z-10 -translate-x-1/2">
                      <i className="fa-solid fa-crown mr-1.5" aria-hidden="true" /> Most popular
                    </Badge>
                  )}
                  <CardContent className="flex flex-1 flex-col gap-4 p-6">
                    <div className="flex items-center justify-between">
                      <span className="plan-icon-chip h-12 w-12 rounded-xl">
                        <i className={`fa-solid ${plan.icon} text-xl`} aria-hidden="true" />
                      </span>
                      <span className="rounded-full bg-muted px-2.5 py-1 text-[0.65rem] font-bold uppercase tracking-wide text-muted-foreground">
                        Example
                      </span>
                    </div>
                    <div>
                      <h3 className="font-heading text-lg font-bold">{plan.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {formatCurrency(plan.min)} – {formatCurrency(plan.max)}
                      </p>
                    </div>
                    <div className="flex items-end gap-1">
                      <span className="font-heading text-4xl font-extrabold text-primary">{plan.daily}%</span>
                      <span className="mb-1.5 text-sm text-muted-foreground">/ day</span>
                    </div>
                    <ul className="flex flex-1 flex-col gap-2.5 border-t border-border pt-4 text-sm text-muted-foreground">
                      <li className="flex items-center gap-2.5">
                        <i className="fa-solid fa-clock w-4 text-primary" aria-hidden="true" /> {plan.days} days duration
                      </li>
                      <li className="flex items-center gap-2.5">
                        <i className="fa-solid fa-chart-line w-4 text-primary" aria-hidden="true" /> {plan.total}% total return
                      </li>
                      <li className="flex items-center gap-2.5">
                        <i className="fa-solid fa-bolt w-4 text-primary" aria-hidden="true" /> Daily auto payouts
                      </li>
                    </ul>
                    <Button
                      className={plan.featured ? "btn-gold mt-2 w-full" : "mt-2 w-full"}
                      variant={plan.featured ? "default" : "outline"}
                      nativeButton={false}
                      render={<Link href="/register">Invest now</Link>}
                    />
                  </CardContent>
                </Card>
              ))}
            </div>
            <p className="mt-6 text-center text-sm text-muted-foreground">
              Sample plans shown — live plans appear here as soon as they are published.
            </p>
          </>
        )}
      </section>

      {/* How it works — step rail */}
      <section id="how" className="scroll-mt-24 border-y border-border bg-white/60">
        <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 lg:py-20">
          <div className="mb-12 text-center">
            <p className="eyebrow">How it works</p>
            <h2 className="mt-2 font-heading text-3xl font-bold sm:text-4xl">Start earning in four steps</h2>
          </div>
          <div className="step-rail grid gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
            {steps.map((s, i) => (
              <div key={s.title} className="flex flex-col items-center gap-3 text-center">
                <span className="step-dot">{i + 1}</span>
                <span className="text-xl text-primary">
                  <i className={`fa-solid ${s.icon}`} aria-hidden="true" />
                </span>
                <h3 className="font-heading font-bold">{s.title}</h3>
                <p className="max-w-[15rem] text-sm leading-relaxed text-muted-foreground">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features — bento grid */}
      <section id="features" className="mx-auto w-full max-w-6xl scroll-mt-24 px-4 py-16 sm:px-6 lg:py-24">
        <div className="mb-12 text-center">
          <p className="eyebrow">Why InvestPro</p>
          <h2 className="mt-2 font-heading text-3xl font-bold sm:text-4xl">Everything you need to invest with confidence</h2>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          <Card className="surface-card rounded-3xl md:col-span-2">
            <CardContent className="flex h-full flex-col gap-4 p-7">
              <span className="bento-icon bento-icon--green">
                <i className="fa-solid fa-shield-halved" aria-hidden="true" />
              </span>
              <h3 className="font-heading text-xl font-bold">Secure &amp; trusted</h3>
              <p className="max-w-md text-sm leading-relaxed text-muted-foreground">
                Bank-grade security with manual deposit verification and protected withdrawals. Nothing moves on
                autopilot — a person reviews every request, so your balance stays exactly where it should be.
              </p>
              <div className="mt-auto flex flex-wrap gap-2 pt-2">
                {["Manual verification", "Protected withdrawals", "Admin approval"].map((chip) => (
                  <span key={chip} className="rounded-full bg-[#eaf3ec] px-3 py-1.5 text-xs font-semibold text-primary">
                    {chip}
                  </span>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="surface-card rounded-3xl">
            <CardContent className="flex h-full flex-col gap-4 p-7">
              <span className="bento-icon bento-icon--gold">
                <i className="fa-solid fa-chart-line" aria-hidden="true" />
              </span>
              <h3 className="font-heading text-xl font-bold">Daily returns</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                Earn fixed daily profit on every active plan, credited automatically to your wallet.
              </p>
            </CardContent>
          </Card>

          <Card className="surface-card rounded-3xl">
            <CardContent className="flex h-full flex-col gap-4 p-7">
              <span className="bento-icon bento-icon--teal">
                <i className="fa-solid fa-bolt" aria-hidden="true" />
              </span>
              <h3 className="font-heading text-xl font-bold">Fast payouts</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                Withdraw via JazzCash or Easypaisa with quick admin approval.
              </p>
            </CardContent>
          </Card>

          <Card className="surface-card rounded-3xl">
            <CardContent className="flex h-full flex-col gap-4 p-7">
              <span className="bento-icon bento-icon--violet">
                <i className="fa-solid fa-users" aria-hidden="true" />
              </span>
              <h3 className="font-heading text-xl font-bold">Referral rewards</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                Invite friends and earn a bonus on every successful referral deposit, across three levels.
              </p>
            </CardContent>
          </Card>

          <Card className="surface-card rounded-3xl">
            <CardContent className="flex h-full flex-col gap-4 p-7">
              <span className="bento-icon bento-icon--green">
                <i className="fa-solid fa-coins" aria-hidden="true" />
              </span>
              <h3 className="font-heading text-xl font-bold">JazzCash &amp; Easypaisa</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                Deposit and withdraw with the local payment apps you already use — no wallets or conversions.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Trust & security */}
      <section className="border-y border-border bg-white/60">
        <div className="mx-auto grid w-full max-w-6xl items-center gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:py-20">
          <div>
            <p className="eyebrow">Trust &amp; security</p>
            <h2 className="mt-2 font-heading text-3xl font-bold sm:text-4xl">Built around human checks, not blind automation</h2>
            <p className="mt-4 max-w-md leading-relaxed text-muted-foreground">
              Automated platforms get drained by bots and bad actors. InvestPro keeps a person in the loop for the
              moments that matter — deposits, withdrawals, and account changes — while your daily profit still
              credits automatically.
            </p>
            <Button className="btn-gradient mt-7" nativeButton={false} render={<Link href="/register" />}>
              Create your free account <i className="fa-solid fa-arrow-right ml-2" aria-hidden="true" />
            </Button>
          </div>
          <div className="flex flex-col gap-4">
            {[
              {
                icon: "fa-user-shield",
                title: "Every deposit verified by a person",
                desc: "Your payment proof is checked against the receiving account before your balance is credited.",
              },
              {
                icon: "fa-lock",
                title: "Withdrawals reviewed before payout",
                desc: "Withdrawal requests are locked from your balance and reviewed by an admin — a rejection refunds you in full.",
              },
              {
                icon: "fa-eye",
                title: "Full activity history",
                desc: "Every deposit, profit credit, and payout is listed in your account, so nothing happens out of sight.",
              },
            ].map((item) => (
              <div key={item.title} className="surface-card flex gap-4 rounded-2xl p-5">
                <span className="bento-icon bento-icon--green flex-none">
                  <i className={`fa-solid ${item.icon}`} aria-hidden="true" />
                </span>
                <span>
                  <span className="block font-heading font-bold">{item.title}</span>
                  <span className="mt-1 block text-sm leading-relaxed text-muted-foreground">{item.desc}</span>
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="mx-auto w-full max-w-3xl scroll-mt-24 px-4 py-16 sm:px-6 lg:py-24">
        <div className="mb-10 text-center">
          <p className="eyebrow">FAQ</p>
          <h2 className="mt-2 font-heading text-3xl font-bold sm:text-4xl">Questions, answered</h2>
        </div>
        <div className="flex flex-col gap-3">
          {FAQS.map((faq) => (
            <details key={faq.q} className="faq-item">
              <summary className="flex items-center justify-between gap-4 px-6 py-5 font-heading font-bold">
                {faq.q}
                <i className="fa-solid fa-plus flex-none text-sm text-primary" aria-hidden="true" />
              </summary>
              <p className="px-6 pb-6 text-sm leading-relaxed text-muted-foreground">{faq.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="mx-auto w-full max-w-6xl px-4 pb-20 sm:px-6">
        <Card className="cta-band rounded-[2rem]">
          <CardContent className="flex flex-col items-center gap-5 p-10 text-center sm:p-14">
            <h2 className="font-heading text-balance text-3xl font-bold sm:text-4xl">Ready to start growing your money?</h2>
            <p className="max-w-md text-white/80">
              Join thousands of investors earning daily returns with InvestPro.
            </p>
            <Button size="lg" className="btn-gold h-12 px-7 text-base" nativeButton={false} render={<Link href="/register">Create your free account</Link>} />
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-white/70">
        <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-5 px-4 py-9 sm:px-6 md:flex-row">
          <BrandLogo />
          <nav className="flex items-center gap-6 text-sm font-medium text-muted-foreground" aria-label="Footer">
            <Link href="#plans" className="hover:text-primary">Plans</Link>
            <Link href="#how" className="hover:text-primary">How it works</Link>
            <Link href="#faq" className="hover:text-primary">FAQ</Link>
            <Link href="/login" className="hover:text-primary">Sign in</Link>
          </nav>
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} InvestPro. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}
