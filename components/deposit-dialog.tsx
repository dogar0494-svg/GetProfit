"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { submitDeposit } from "@/lib/actions/wallet"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
import type { Settings } from "@/lib/types"

export function DepositDialog({ settings, userId, shortcut = false }: { settings: Settings | null; userId: string; shortcut?: boolean }) {
  const [open, setOpen] = useState(false)
  const [method, setMethod] = useState("JazzCash")
  const [amount, setAmount] = useState("")
  const [accountNumber, setAccountNumber] = useState("")
  const [accountName, setAccountName] = useState("")
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)

  const methodDetails = {
    JazzCash: { label: "JazzCash", number: settings?.jazzcash_number, name: settings?.jazzcash_name },
    Easypaisa: { label: "Easypaisa", number: settings?.easypaisa_number, name: settings?.easypaisa_name },
  } as const
  const accountInfo = methodDetails[method as keyof typeof methodDetails]
  const configured = Boolean(accountInfo.number)

  async function handleSubmit() {
    if (!configured) return toast.error(`${accountInfo.label} deposits are not available yet.`)
    if (!amount || Number(amount) <= 0) return toast.error("Enter a valid amount.")
    if (!file) return toast.error("Upload your payment proof screenshot.")
    setLoading(true)
    try {
      const supabase = createClient()
      const ext = file.name.split(".").pop()
      const path = `${userId}/${Date.now()}.${ext}`
      const { error: upErr } = await supabase.storage.from("payment-proofs").upload(path, file)
      if (upErr) throw upErr
      const { data: pub } = supabase.storage.from("payment-proofs").getPublicUrl(path)

      const fd = new FormData()
      fd.set("amount", amount)
      fd.set("payment_method", method)
      fd.set("account_number", accountNumber)
      fd.set("account_name", accountName)
      fd.set("proof_image", pub.publicUrl)
      const res = await submitDeposit(fd)
      if (!res.ok) throw new Error(res.error)

      toast.success("Deposit submitted! Awaiting admin approval.")
      setOpen(false)
      setAmount("")
      setAccountNumber("")
      setAccountName("")
      setFile(null)
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Something went wrong.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button className={shortcut ? "action-card" : "w-full"}>
            {shortcut ? (
              <>
                <span className="action-icon action-icon--green"><i className="fa-solid fa-building-columns" aria-hidden="true" /></span>
                <span>
                  <span className="block font-heading text-base font-bold">Deposit</span>
                  <span className="mt-0.5 block text-xs font-normal text-muted-foreground">Add funds in PKR</span>
                </span>
              </>
            ) : (
              <><i className="fa-solid fa-plus mr-2" aria-hidden="true" /> Deposit</>
            )}
          </Button>
        }
      />
      <DialogContent className="max-h-[90dvh] overflow-y-auto sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Deposit funds</DialogTitle>
          <DialogDescription>Send PKR to the selected JazzCash or Easypaisa account, then upload your payment receipt screenshot.</DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label>Payment method</Label>
            <Select value={method} onValueChange={(value) => value && setMethod(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="JazzCash">JazzCash</SelectItem>
                <SelectItem value="Easypaisa">Easypaisa</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="rounded-lg border border-border bg-muted/40 p-4 text-sm">
            <p className="text-muted-foreground">Send PKR to this {accountInfo.label} account:</p>
            {configured ? (
              <>
                <p className="mt-1 break-all font-mono text-base font-semibold text-primary">{accountInfo.number}</p>
                {accountInfo.name && <p className="mt-1 font-semibold">{accountInfo.name}</p>}
              </>
            ) : (
              <p className="mt-1 font-semibold text-destructive">{accountInfo.label} is not configured yet. Please check back later.</p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="dep-amount">Deposit amount (Rs)</Label>
            <Input
              id="dep-amount"
              type="number"
              min={1}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="e.g. 5000"
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="dep-acc">Your {accountInfo.label} account number</Label>
            <Input
              id="dep-acc"
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value)}
              placeholder="03XX-XXXXXXX"
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="dep-name">Your account name (optional)</Label>
            <Input
              id="dep-name"
              value={accountName}
              onChange={(e) => setAccountName(e.target.value)}
              placeholder="Name on your account"
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="dep-proof">Payment proof screenshot</Label>
            <Input
              id="dep-proof"
              type="file"
              accept="image/*"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            />
          </div>

          <Button onClick={handleSubmit} disabled={loading || !configured} className="w-full">
            {loading ? "Submitting..." : "Submit deposit request"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
