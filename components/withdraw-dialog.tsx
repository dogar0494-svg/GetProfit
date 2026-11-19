"use client"

import { useState } from "react"
import { submitWithdrawal } from "@/lib/actions/wallet"
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
import { formatCurrency } from "@/lib/format"
import type { Settings } from "@/lib/types"

export function WithdrawDialog({
  settings,
  balance,
  shortcut = false,
}: {
  settings: Settings | null
  balance: number
  shortcut?: boolean
}) {
  const [open, setOpen] = useState(false)
  const [method, setMethod] = useState("JazzCash")
  const [amount, setAmount] = useState("")
  const [accountNumber, setAccountNumber] = useState("")
  const [accountTitle, setAccountTitle] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleSubmit() {
    if (!amount || Number(amount) <= 0) return toast.error("Enter a valid amount.")
    if (Number(amount) > balance) return toast.error(`Insufficient balance. Available: ${formatCurrency(balance)}.`)
    if (!accountNumber) return toast.error("Enter your account number.")
    setLoading(true)
    try {
      const fd = new FormData()
      fd.set("amount", amount)
      fd.set("payment_method", method)
      fd.set("account_number", accountTitle.trim() ? `${accountNumber} (${accountTitle.trim()})` : accountNumber)
      const res = await submitWithdrawal(fd)
      if (!res.ok) throw new Error(res.error)
      toast.success("Withdrawal request submitted! Awaiting admin approval.")
      setOpen(false)
      setAmount("")
      setAccountNumber("")
      setAccountTitle("")
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
          <Button className={shortcut ? "action-card" : "w-full bg-primary text-primary-foreground shadow-md hover:bg-primary/90"}>
            {shortcut ? (
              <>
                <span className="action-icon action-icon--gold"><i className="fa-solid fa-wallet" aria-hidden="true" /></span>
                <span>
                  <span className="block font-heading text-base font-bold">Withdraw</span>
                  <span className="mt-0.5 block text-xs font-normal text-muted-foreground">Cash out earnings</span>
                </span>
              </>
            ) : (
              <><i className="fa-solid fa-arrow-up-from-bracket mr-2" aria-hidden="true" /> Withdraw</>
            )}
          </Button>
        }
      />
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Withdraw funds</DialogTitle>
          <DialogDescription>
            Available balance: <span className="font-semibold text-foreground">{formatCurrency(balance)}</span>. There is no
            withdrawal fee — you receive the full amount in your own JazzCash or Easypaisa account after admin approval.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label>Withdraw to</Label>
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

          <div className="flex flex-col gap-2">
            <Label htmlFor="wd-amount">Amount (Rs)</Label>
            <Input
              id="wd-amount"
              type="number"
              min={0}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="e.g. 7000"
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="wd-acc">Your {method} account number</Label>
            <Input
              id="wd-acc"
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value)}
              placeholder="03XX-XXXXXXX"
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="wd-title">Account title / name</Label>
            <Input
              id="wd-title"
              value={accountTitle}
              onChange={(e) => setAccountTitle(e.target.value)}
              placeholder="Name on your account"
            />
          </div>

          <div className="rounded-lg border border-border bg-muted/40 p-4 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Amount</span>
              <span className="font-semibold">{formatCurrency(Number(amount || 0))}</span>
            </div>
            <div className="mt-2 flex items-center justify-between">
              <span className="text-muted-foreground">Fee</span>
              <span className="font-semibold">Rs 0</span>
            </div>
            <div className="mt-2 flex items-center justify-between border-t border-border pt-2">
              <span className="text-muted-foreground">You receive</span>
              <span className="font-semibold text-primary">{formatCurrency(Number(amount || 0))}</span>
            </div>
          </div>

          <Button onClick={handleSubmit} disabled={loading} className="w-full">
            {loading ? "Submitting..." : "Request withdrawal"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
