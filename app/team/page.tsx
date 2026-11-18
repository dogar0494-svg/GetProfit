import { AppNav } from "@/components/app-nav"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { getCurrentUser, getTeam } from "@/lib/data"

export default async function TeamPage() {
  const { profile } = await getCurrentUser()
  const team = await getTeam(profile.id, profile.referral_code ?? "")
  const referralLink = `${process.env.NEXT_PUBLIC_SITE_URL ?? ""}/register?ref=${profile.referral_code ?? ""}`
  const levels = [
    { label: "Level 1", members: team.level1 ?? [], color: "level-badge--1" },
    { label: "Level 2", members: team.level2 ?? [], color: "level-badge--2" },
    { label: "Level 3", members: team.level3 ?? [], color: "level-badge--3" },
  ]

  return (
    <div className="app-bg app-shell min-h-dvh pb-24 lg:pb-0">
      <AppNav isAdmin={profile.role === "admin"} userName={profile.name || profile.username} userEmail={profile.email} />
      <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6">
        <div className="mb-7">
          <p className="eyebrow">My network</p>
          <h1 className="mt-1 font-heading text-3xl font-bold sm:text-4xl">Team</h1>
          <p className="mt-2 text-muted-foreground">Share your referral link and track your three-level team.</p>
        </div>

        <Card className="referral-hero mb-7 rounded-3xl">
          <CardHeader><CardTitle className="font-heading text-lg text-white">Your referral link</CardTitle></CardHeader>
          <CardContent className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <code className="min-w-0 flex-1 truncate rounded-lg px-3 py-2.5 text-sm">{referralLink}</code>
            <Button className="btn-gold" nativeButton={false} render={<a href={`mailto:?subject=Join my team&body=${encodeURIComponent(referralLink)}`}>Share link</a>}>
              <i className="fa-solid fa-share-nodes mr-2" aria-hidden="true" /> Share
            </Button>
          </CardContent>
        </Card>

        <div className="grid gap-5 lg:grid-cols-3">
          {levels.map((level) => (
            <Card key={level.label} className="surface-card rounded-3xl">
              <CardHeader className="flex-row items-center justify-between">
                <CardTitle className="font-heading">{level.label}</CardTitle>
                <span className={`rounded-full px-3 py-1 text-sm font-bold ${level.color}`}>{level.members.length}</span>
              </CardHeader>
              <CardContent>
                {level.members.length === 0 ? (
                  <div className="flex flex-col items-center gap-2 py-8 text-center">
                    <span className="grid h-11 w-11 place-items-center rounded-full bg-[#eaf3ec] text-primary">
                      <i className="fa-solid fa-user-plus" aria-hidden="true" />
                    </span>
                    <p className="text-sm text-muted-foreground">No team members yet.</p>
                  </div>
                ) : (
                  <ul className="flex flex-col gap-2.5">
                    {level.members.map((member) => (
                      <li key={member.id} className="flex items-center gap-3 rounded-xl bg-[#f4f8f4] px-3 py-2.5">
                        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#e3f2e7] text-primary"><i className="fa-solid fa-user" aria-hidden="true" /></span>
                        <div className="min-w-0"><p className="truncate font-medium">{member.username || member.name || "Member"}</p><p className="text-xs text-muted-foreground">Joined {new Date(member.created_at).toLocaleDateString()}</p></div>
                      </li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  )
}
