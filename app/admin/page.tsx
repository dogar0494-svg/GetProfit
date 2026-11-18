import { requireAdminProfile, getAdminData } from "@/lib/admin-data"
import { AppNav } from "@/components/app-nav"
import { AdminPanel } from "@/components/admin/admin-panel"
import { Toaster } from "@/components/ui/sonner"

export default async function AdminPage() {
  await requireAdminProfile()
  const data = await getAdminData()

  return (
    <div className="app-bg flex min-h-dvh flex-col pb-24 md:pb-0">
      <AppNav isAdmin />
      <Toaster position="top-center" richColors />

      <main className="admin-glass mx-auto w-full max-w-6xl flex-1 px-4 py-8">
        <div className="mb-8">
          <p className="dashboard-eyebrow">INVESTPRO / CONTROL</p>
          <h1 className="mt-1 text-2xl font-bold">Admin Panel</h1>
          <p className="text-sm text-muted-foreground">Manage deposits, withdrawals, users, plans, and settings.</p>
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
