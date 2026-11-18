import { getCurrentUser, getReferrals } from "@/lib/data"
import { AppNav } from "@/components/app-nav"
import { ProfileDetailsForm, PasswordForm, ReferralCodeCard } from "@/components/profile-forms"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Toaster } from "@/components/ui/sonner"

export default async function ProfilePage() {
  const { profile } = await getCurrentUser()
  const referrals = profile.referral_code ? await getReferrals(profile.referral_code) : []

  const initials = (profile.name || profile.username || "U")
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase()

  return (
    <div className="app-bg flex min-h-dvh flex-col pb-24 md:pb-0">
      <AppNav isAdmin={profile.role === "admin"} />
      <Toaster position="top-center" richColors />

      <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-8">
        <Card className="referral-hero mb-8">
          <CardContent className="flex items-center gap-4 p-6">
            <Avatar className="h-16 w-16 border border-white/40 bg-white/15 text-white">
              <AvatarFallback className="bg-transparent text-lg font-bold text-white">{initials}</AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <h1 className="truncate text-2xl font-bold">{profile.name || profile.username}</h1>
              <p className="truncate text-sm text-white/75">{profile.email}</p>
            </div>
            {profile.role === "admin" && <Badge className="plan-featured-badge ml-auto">Admin</Badge>}
          </CardContent>
        </Card>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card className="glass-card lg:col-span-2">
            <CardHeader>
              <CardTitle>Account details</CardTitle>
              <CardDescription>Update your personal information.</CardDescription>
            </CardHeader>
            <CardContent>
              <ProfileDetailsForm profile={profile} />
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Referral program</CardTitle>
              <CardDescription>
                {referrals.length} {referrals.length === 1 ? "person has" : "people have"} joined with your code.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <ReferralCodeCard code={profile.referral_code ?? ""} />
              {referrals.length > 0 && (
                <ul className="flex flex-col divide-y divide-border/60">
                  {referrals.map((r) => (
                    <li key={r.id} className="flex items-center justify-between py-2 text-sm">
                      <span>{r.name || r.username}</span>
                      <span className="text-muted-foreground">{new Date(r.created_at).toLocaleDateString()}</span>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Change password</CardTitle>
              <CardDescription>Choose a strong password you don&apos;t use elsewhere.</CardDescription>
            </CardHeader>
            <CardContent>
              <PasswordForm />
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
