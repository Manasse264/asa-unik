"use client"

import * as React from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  completeFamilyPasswordReset,
  getEstablishedYears,
  getFamilyPasswordResetRequestStatus,
  getFamiliesForSelection,
  submitFamilyPasswordResetRequest,
} from "@/lib/family-actions"

const resetTokenStorageKey = "family_password_reset_token"

interface FamilyOption {
  id: string
  name: string
  hasAccount: boolean
}

export default function FamilyForgotPasswordPage() {
  const [years, setYears] = React.useState<string[]>([])
  const [selectedYear, setSelectedYear] = React.useState("")
  const [families, setFamilies] = React.useState<FamilyOption[]>([])
  const [familyId, setFamilyId] = React.useState("")
  const [accessToken, setAccessToken] = React.useState("")
  const [requestStatus, setRequestStatus] = React.useState("")
  const [approvedFamilyName, setApprovedFamilyName] = React.useState("")
  const [enteredFamilyName, setEnteredFamilyName] = React.useState("")
  const [newPassword, setNewPassword] = React.useState("")
  const [confirmPassword, setConfirmPassword] = React.useState("")
  const [error, setError] = React.useState("")
  const [loading, setLoading] = React.useState(false)

  React.useEffect(() => {
    const loadYears = async () => {
      const savedToken = localStorage.getItem(resetTokenStorageKey)
      const availableYears = await getEstablishedYears()
      if (savedToken) setAccessToken(savedToken)
      setYears(availableYears)
      const savedYear = localStorage.getItem("selected_year")
      setSelectedYear(savedYear && availableYears.includes(savedYear) ? savedYear : availableYears[0] || "")
    }
    loadYears()
  }, [])

  React.useEffect(() => {
    if (!accessToken || requestStatus === "COMPLETED") return
    let isActive = true

    const checkRequestStatus = async () => {
      try {
        const result = await getFamilyPasswordResetRequestStatus(accessToken)
        if (!isActive) return
        if (!result.success) {
          setError(result.error || "Unable to check your request status.")
          return
        }
        setError("")
        setRequestStatus(result.status || "")
        setApprovedFamilyName(result.familyName || "")
      } catch {
        if (isActive) setError("Unable to check your request status. Please try again.")
      }
    }

    void checkRequestStatus()
    const intervalId = window.setInterval(() => void checkRequestStatus(), 5000)
    return () => {
      isActive = false
      window.clearInterval(intervalId)
    }
  }, [accessToken, requestStatus])

  React.useEffect(() => {
    if (!selectedYear) return
    const loadFamilies = async () => {
      const availableFamilies = await getFamiliesForSelection(selectedYear)
      setFamilies(availableFamilies.filter((family: FamilyOption) => family.hasAccount))
      setFamilyId("")
    }
    loadFamilies()
  }, [selectedYear])

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setError("")
    if (!familyId) {
      setError("Select your family account first.")
      return
    }

    setLoading(true)
    try {
      const result = await submitFamilyPasswordResetRequest(familyId)
      if (!result.success) {
        setError(result.error || "Unable to send your request.")
      } else if (result.accessToken) {
        localStorage.setItem(resetTokenStorageKey, result.accessToken)
        setAccessToken(result.accessToken)
        setRequestStatus("PENDING")
      } else {
        setError("Unable to track your request. Please try again.")
      }
    } catch {
      setError("Unable to send your request. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handlePasswordReset = async (event: React.FormEvent) => {
    event.preventDefault()
    setError("")
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.")
      return
    }

    setLoading(true)
    try {
      const result = await completeFamilyPasswordReset({
        accessToken,
        familyName: enteredFamilyName,
        newPassword,
      })
      if (!result.success) {
        setError(result.error || "Unable to reset password.")
        return
      }
      localStorage.removeItem(resetTokenStorageKey)
      setRequestStatus("COMPLETED")
      setNewPassword("")
      setConfirmPassword("")
    } catch {
      setError("Unable to reset password. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const startNewRequest = () => {
    localStorage.removeItem(resetTokenStorageKey)
    setAccessToken("")
    setRequestStatus("")
    setApprovedFamilyName("")
    setEnteredFamilyName("")
    setError("")
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50/40 to-indigo-50/50 px-4 py-12">
      <section className="w-full max-w-md space-y-6 rounded-2xl border border-slate-100 bg-white p-8 shadow-xl shadow-slate-200/50">
        <div className="space-y-2 text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-indigo-700">ASA UNIK-RP NGOMA</p>
          <h1 className="text-2xl font-bold text-slate-900">Request a password reset</h1>
          <p className="text-sm text-slate-600">Choose your family account. The Sabbath School leader must approve the request.</p>
        </div>

        {error && <p role="alert" className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</p>}

        {requestStatus === "PENDING" && (
          <p role="status" className="rounded-md border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
            Your request has been sent. Please wait for the Sabbath School leader to approve it. This page will update automatically.
          </p>
        )}

        {requestStatus === "APPROVED" && (
          <form onSubmit={handlePasswordReset} className="space-y-4">
            <p role="status" className="rounded-md border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-800">Your request is approved. Enter your family name and choose a new password.</p>
            <label className="grid gap-2 text-sm font-medium text-slate-800">
              Family name
              <input value={enteredFamilyName} onChange={event => setEnteredFamilyName(event.target.value)} placeholder={approvedFamilyName} required autoComplete="organization" className="h-10 rounded-md border border-slate-200 bg-white px-3" />
            </label>
            <label className="grid gap-2 text-sm font-medium text-slate-800">
              New password
              <input type="password" value={newPassword} onChange={event => setNewPassword(event.target.value)} required minLength={4} autoComplete="new-password" className="h-10 rounded-md border border-slate-200 bg-white px-3" />
            </label>
            <label className="grid gap-2 text-sm font-medium text-slate-800">
              Re-enter new password
              <input type="password" value={confirmPassword} onChange={event => setConfirmPassword(event.target.value)} required minLength={4} autoComplete="new-password" className="h-10 rounded-md border border-slate-200 bg-white px-3" />
            </label>
            <Button type="submit" disabled={loading} className="w-full">{loading ? "Saving..." : "Save password"}</Button>
          </form>
        )}

        {requestStatus === "REJECTED" && (
          <div className="space-y-4">
            <p role="status" className="rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-800">Your request was not approved. Contact the Sabbath School leader if you need help.</p>
            <Button type="button" variant="outline" onClick={startNewRequest} className="w-full">Submit a new request</Button>
          </div>
        )}

        {requestStatus === "COMPLETED" && (
          <p role="status" className="rounded-md border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">Your password has been reset. You can now sign in with your new password.</p>
        )}

        {!requestStatus && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <label className="grid gap-2 text-sm font-medium text-slate-800">
              Church year
              <select
                value={selectedYear}
                onChange={event => setSelectedYear(event.target.value)}
                required
                className="h-10 rounded-md border border-slate-200 bg-white px-3"
              >
                {years.map(year => <option key={year} value={year}>{year}</option>)}
              </select>
            </label>
            <label className="grid gap-2 text-sm font-medium text-slate-800">
              Family
              <select
                value={familyId}
                onChange={event => setFamilyId(event.target.value)}
                required
                disabled={families.length === 0}
                className="h-10 rounded-md border border-slate-200 bg-white px-3 disabled:opacity-60"
              >
                <option value="">Select family account</option>
                {families.map(family => <option key={family.id} value={family.id}>{family.name}</option>)}
              </select>
            </label>
            <Button type="submit" disabled={loading || families.length === 0} className="w-full">
              {loading ? "Sending request..." : "Send reset request"}
            </Button>
          </form>
        )}

        <div className="flex justify-between text-sm">
          <Link href="/family/signin" className="text-indigo-700 underline underline-offset-4">Back to family sign in</Link>
        </div>
      </section>
    </main>
  )
}