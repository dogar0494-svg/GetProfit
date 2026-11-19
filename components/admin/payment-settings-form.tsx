"use client"

import type React from "react"
import { useState } from "react"
import { toast } from "sonner"
import { savePaymentSettings } from "@/lib/actions/admin"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { Settings } from "@/lib/types"

export function PaymentSettingsForm({ settings }: { settings: Settings | null }) {
  const [form, setForm] = useState({
    jazzcash_number: settings?.jazzcash_number ?? "",
    jazzcash_name: settings?.jazzcash_name ?? "",
    easypaisa_number: settings?.easypaisa_number ?? "",
    easypaisa_name: settings?.easypaisa_name ?? "",
    referral_bonus_percent: String(settings?.referral_bonus_percent ?? 5),
  })
  const [loading, setLoading] = useState(false)

  function update(key: keyof typeof form, value: string) {
    setForm((f) => ({ ...f, [key]: value }))
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    const res = await savePaymentSettings({
      jazzcash_number: form.jazzcash_number,
      jazzcash_name: form.jazzcash_name,
      easypaisa_number: form.easypaisa_number,
      easypaisa_name: form.easypaisa_name,
      referral_bonus_percent: Number(form.referral_bonus_percent),
    })
    setLoading(false)
    if (res.ok) toast.success("Settings saved.")
    else toast.error(res.error ?? "Could not save settings.")
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-6 lg:grid-cols-2">
      <Card className="surface-card rounded-2xl lg:col-span-2">
        <CardHeader>
          <CardTitle>Receiving accounts</CardTitle>
          <CardDescription>Users will see the number and account name for their selected method when depositing.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          {([
            ["jazzcash_number", "JazzCash number", "03XX-XXXXXXX"],
            ["jazzcash_name", "JazzCash account name", "Account title"],
            ["easypaisa_number", "Easypaisa number", "03XX-XXXXXXX"],
            ["easypaisa_name", "Easypaisa account name", "Account title"],
          ] as const).map(([key, label, placeholder]) => (
            <div key={key} className="flex flex-col gap-2">
              <Label htmlFor={key}>{label}</Label>
              <Input id={key} value={form[key]} onChange={(e) => update(key, e.target.value)} placeholder={placeholder} />
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="surface-card rounded-2xl lg:col-span-2">
        <CardHeader>
          <CardTitle>Platform rules</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4 sm:flex-row">
          <div className="flex flex-1 flex-col gap-2">
            <Label htmlFor="ref-pct">Referral bonus (%)</Label>
            <Input
              id="ref-pct"
              type="number"
              value={form.referral_bonus_percent}
              onChange={(e) => update("referral_bonus_percent", e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      <div className="lg:col-span-2">
        <Button type="submit" disabled={loading}>
          {loading ? "Saving..." : "Save settings"}
        </Button>
      </div>
    </form>
  )
}
