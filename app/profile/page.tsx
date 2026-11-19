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
    <div className="app-bg app-shell flex min-h-dvh flex-col pb-24 lg:pb-0">
      <AppNav isAdmin={profile.role === "admin"} userName={profile.name || profile.username} userEmail={profile.email} />
      <Toaster position="top-center" richColors />

      <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-8 sm:px-6">
        <Card className="referral-hero mb-7 rounded-3xl">
          <CardContent className="flex items-center gap-4 p-6 sm:p-7">
            <Avatar className="h-16 w-16 border border-white/40 bg-white/15 text-white">
              <AvatarFallback className="bg-transparent font-heading text-lg font-bold text-white">{initials}</AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <h1 className="truncate font-heading text-2xl font-bold text-white sm:text-3xl">{profile.name || profile.username}</h1>
              <p className="truncate text-sm text-white/75">{profile.email}</p>
            </div>
            {profile.role === "admin" && <Badge className="plan-featured-badge ml-auto shrink-0">Admin</Badge>}
          </CardContent>
        </Card>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card className="surface-card rounded-3xl lg:col-span-2">
            <CardHeader>
              <CardTitle className="font-heading">Account details</CardTitle>
              <CardDescription>Update your personal information.</CardDescription>
            </CardHeader>
            <CardContent>
              <ProfileDetailsForm profile={profile} />
            </CardContent>
          </Card>

          <Card className="surface-card rounded-3xl">
            <CardHeader>
              <CardTitle className="font-heading">Referral program</CardTitle>
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

          <Card className="surface-card rounded-3xl">
            <CardHeader>
              <CardTitle className="font-heading">Change password</CardTitle>
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
