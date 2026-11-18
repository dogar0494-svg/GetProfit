"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { BrandLogo } from "@/components/brand-logo"
import { Button } from "@/components/ui/button"
import { signOut } from "@/lib/actions/auth"
import { cn } from "@/lib/utils"

const NAV_LINKS = [
  { href: "/dashboard", label: "Dashboard", icon: "fa-house" },
  { href: "/plans", label: "VIP plans", icon: "fa-layer-group" },
  { href: "/trading", label: "Earnings", icon: "fa-bolt" },
  { href: "/team", label: "Team", icon: "fa-users" },
  { href: "/profile", label: "Profile", icon: "fa-user" },
]

const ADMIN_LINK = { href: "/admin", label: "Admin", icon: "fa-shield-halved" }

export function AppNav({
  isAdmin,
  userName,
  userEmail,
}: {
  isAdmin?: boolean
  userName?: string | null
  userEmail?: string | null
}) {
  const pathname = usePathname()
  const links = isAdmin ? [...NAV_LINKS, ADMIN_LINK] : NAV_LINKS
  const displayName = userName || "Investor"
  const initials = displayName
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase()

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="app-sidebar" aria-label="Primary">
        <div className="px-2">
          <BrandLogo href="/dashboard" />
        </div>

        <nav className="mt-9 flex flex-col gap-1.5" aria-label="Primary navigation">
          {links.map((link) => {
            const active = pathname === link.href
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? "page" : undefined}
                className={cn("sidebar-link", active && "sidebar-link--active")}
              >
                <i className={`fa-solid ${link.icon}`} aria-hidden="true" />
                {link.label}
              </Link>
            )
          })}
        </nav>

        <div className="mt-auto flex flex-col gap-3">
          <div className="rounded-2xl bg-[#eaf3ec] p-4">
            <p className="flex items-center gap-2 text-sm font-semibold text-primary">
              <i className="fa-solid fa-seedling" aria-hidden="true" /> Grow daily
            </p>
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
              Your active plans credit profit to your wallet every day.
            </p>
            <Link href="/plans" className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:underline">
              Explore plans <i className="fa-solid fa-arrow-right" aria-hidden="true" />
            </Link>
          </div>

          <div className="sidebar-user">
            <span className="sidebar-avatar" aria-hidden="true">{initials}</span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold">{displayName}</p>
              <p className="truncate text-xs text-muted-foreground">{userEmail || "InvestPro member"}</p>
            </div>
          </div>

          <form action={signOut}>
            <Button type="submit" variant="outline" className="w-full justify-start">
              <i className="fa-solid fa-right-from-bracket mr-2" aria-hidden="true" /> Sign out
            </Button>
          </form>
        </div>
      </aside>

      {/* Mobile top bar */}
      <header className="mobile-topbar sticky top-0 z-40">
        <div className="flex items-center justify-between px-4 py-3">
          <BrandLogo href="/dashboard" />
          <div className="flex items-center gap-2">
            <Link
              href="/profile"
              className="grid h-10 w-10 place-items-center rounded-full border border-border bg-[#eaf3ec] text-primary"
              aria-label="Open your profile"
            >
              <i className="fa-solid fa-user" aria-hidden="true" />
            </Link>
            <form action={signOut}>
              <Button type="submit" variant="outline" size="icon" aria-label="Sign out">
                <i className="fa-solid fa-right-from-bracket" aria-hidden="true" />
              </Button>
            </form>
          </div>
        </div>
      </header>

      {/* Mobile bottom nav — same links as the sidebar */}
      <nav className="mobile-bottomnav" aria-label="Mobile navigation">
        <div className="mx-auto flex max-w-xl items-stretch px-1">
          {links.map((link) => {
            const active = pathname === link.href
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? "page" : undefined}
                className={cn("mobile-nav-link", active && "mobile-nav-link--active")}
              >
                <i className={`fa-solid ${link.icon}`} aria-hidden="true" />
                <span>{link.label}</span>
              </Link>
            )
          })}
        </div>
      </nav>
    </>
  )
}
