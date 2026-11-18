import { signOut } from "@/lib/actions/auth"
import { Button } from "@/components/ui/button"
import { BrandLogo } from "@/components/brand-logo"

export default function BlockedPage() {
  return (
    <main className="app-bg flex min-h-dvh flex-col items-center justify-center px-4 py-10">
      <div className="surface-card flex w-full max-w-md flex-col items-center gap-6 rounded-3xl p-8 text-center sm:p-10">
        <BrandLogo />
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10 text-destructive">
          <i className="fa-solid fa-ban text-2xl" aria-hidden="true" />
        </div>
        <div>
          <h1 className="font-heading text-2xl font-bold">Account suspended</h1>
          <p className="mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground">
            Your account has been blocked by an administrator. Please contact support if you believe this is a mistake.
          </p>
        </div>
        <form action={signOut}>
          <Button type="submit" variant="outline">
            Sign out
          </Button>
        </form>
      </div>
    </main>
  )
}
