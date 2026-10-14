"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function AdminLoginPage() {
  const router = useRouter()
  const [username, setUsername] = React.useState("elder")
  const [password, setPassword] = React.useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const normalizedUser = username.trim().toLowerCase()
    const isDefaultElderLogin = (normalizedUser === "elder" || normalizedUser === "admin") && password === "admin123"

    if (!isDefaultElderLogin) {
      alert("Invalid credentials. Use the default elder login: elder / admin123")
      return
    }

    localStorage.setItem("user_role", "Church Elder")
    localStorage.setItem("user_registration_year", new Date().getFullYear().toString())
    localStorage.setItem("user_email", "elder")
    localStorage.setItem("user_allowed_years", JSON.stringify(["2024-2025"]))

    window.dispatchEvent(new Event("auth-change"))
    window.dispatchEvent(new Event("login-state-change"))
    router.push("/dashboard/elder")
  }

  return (
    <div className="container relative flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-2 lg:px-0 min-h-[calc(100vh-64px)] overflow-hidden">
      <div className="relative hidden h-full flex-col p-10 text-white lg:flex overflow-hidden">
        <div
          className="absolute inset-0 z-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/photo1.jpg')" }}
        />
        <div className="absolute inset-0 z-10 bg-black/60" />
        <div className="relative z-20 text-lg font-bold tracking-tight">ASA RP NGOMA COLLEGE</div>
      </div>

      <div className="lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">Admin Login</h1>
            <p className="text-sm text-muted-foreground">Use the default elder/admin account.</p>
          </div>

          <form onSubmit={handleSubmit} className="grid gap-4">
            <div className="grid gap-2">
              <Label>Admin</Label>
              <Input value={username} onChange={(e) => setUsername(e.target.value)} required />
            </div>
            <div className="grid gap-2">
              <Label>Password</Label>
              <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
            <Button className="w-full" type="submit">Login</Button>
          </form>

          <div className="text-center text-sm text-muted-foreground">
            Use the administrator login only. Regular users must use <Link href="/login" className="underline">User Login</Link>.
          </div>
        </div>
      </div>
    </div>
  )
}
