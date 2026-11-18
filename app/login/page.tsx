"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { BrandLogo } from "@/components/brand-logo"
import { AuthBrandPanel } from "@/components/auth-brand-panel"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }
    // Hard navigation so the freshly-set auth cookie is sent with the next request
    window.location.href = "/dashboard"
  }

  return (
    <main className="grid min-h-dvh lg:grid-cols-2">
      <AuthBrandPanel />

      <div className="app-bg flex flex-col items-center justify-center px-4 py-10 sm:px-8">
        <div className="w-full max-w-md">
          <div className="mb-8 flex justify-center lg:hidden">
            <BrandLogo />
          </div>
          <div className="surface-card rounded-3xl p-6 sm:p-9">
            <div className="mb-7">
              <p className="eyebrow">Welcome back</p>
              <h1 className="mt-2 font-heading text-3xl font-bold">Sign in to InvestPro</h1>
              <p className="mt-1.5 text-sm text-muted-foreground">Sign in to manage your investments</p>
            </div>
            <form onSubmit={handleLogin} className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  required
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  required
                  placeholder="Your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              {error && (
                <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive" role="alert">
                  {error}
                </p>
              )}
              <Button type="submit" className="btn-gradient mt-2 h-11 w-full text-base" disabled={loading}>
                {loading ? "Signing in..." : "Sign in"}
              </Button>
            </form>
            <p className="mt-6 text-center text-sm text-muted-foreground">
              Don&apos;t have an account?{" "}
              <Link href="/register" className="font-semibold text-primary hover:underline">
                Create one
              </Link>
            </p>
          </div>
          <p className="mt-6 text-center text-xs text-muted-foreground">
            <Link href="/" className="hover:text-foreground">
              &larr; Back to home
            </Link>
          </p>
        </div>
      </div>
    </main>
  )
}
