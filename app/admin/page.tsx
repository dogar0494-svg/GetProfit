import { requireAdminProfile, getAdminData } from "@/lib/admin-data"
import { AppNav } from "@/components/app-nav"
import { AdminPanel } from "@/components/admin/admin-panel"
import { Toaster } from "@/components/ui/sonner"

export default async function AdminPage() {
  const adminProfile = await requireAdminProfile()
  const data = await getAdminData()

  return (
    <div className="app-bg app-shell flex min-h-dvh flex-col pb-24 lg:pb-0">
      <AppNav isAdmin userName={adminProfile.name || adminProfile.username} userEmail={adminProfile.email} />
      <Toaster position="top-center" richColors />

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6">
        <div className="mb-8">
          <p className="eyebrow">InvestPro / Control</p>
          <h1 className="mt-1 font-heading text-3xl font-bold sm:text-4xl">Admin Panel</h1>
          <p className="mt-1.5 text-sm text-muted-foreground sm:text-base">Manage deposits, withdrawals, users, plans, and settings.</p>
        </div>
        <AdminPanel
          users={data.users}
          deposits={data.deposits}
          withdrawals={data.withdrawals}
          allTransactions={data.allTransactions}
          plans={data.plans}
          settings={data.settings}
          stats={data.stats}
        />
      </main>
    </div>
  )
}
