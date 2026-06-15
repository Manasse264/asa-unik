"use client"

import * as React from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

function ResetPasswordContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const email = searchParams.get("email")
  const [password, setPassword] = React.useState("")
  const [confirmPassword, setConfirmPassword] = React.useState("")
  const [isSuccess, setIsSuccess] = React.useState(false)

  const handleReset = (e: React.FormEvent) => {
    e.preventDefault()
    if (password !== confirmPassword) {
      alert("Passwords do not match!")
      return
    }

    const allUsers = JSON.parse(localStorage.getItem("app_users") || "[]")
    const updatedUsers = allUsers.map((u: any) =>
      u.email.toLowerCase() === email?.toLowerCase() ? { ...u, password } : u
    )
    localStorage.setItem("app_users", JSON.stringify(updatedUsers))

    setIsSuccess(true)
    setTimeout(() => router.push("/login"), 3000)
  }

  if (isSuccess) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen space-y-4">
        <h1 className="text-2xl font-bold text-primary">Password Reset Successful!</h1>
        <p className="text-muted-foreground">Redirecting to login page...</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Reset Password</h1>
          <p className="text-sm text-muted-foreground">Resetting password for {email}</p>
        </div>
        <form onSubmit={handleReset} className="space-y-4">
          <div className="grid gap-2">
            <Label>New Password</Label>
            <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          <div className="grid gap-2">
            <Label>Confirm New Password</Label>
            <Input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
          </div>
          <Button type="submit" className="w-full">Reset Password</Button>
        </form>
      </div>
    </div>
  )
}

export default function ResetPasswordPage() {
  return (
    <React.Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
      <ResetPasswordContent />
    </React.Suspense>
  )
}
