"use client"

import * as React from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  getEstablishedYears,
  getFamiliesForSelection,
  submitFamilyPasswordResetRequest,
} from "@/lib/family-actions"

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
  const [message, setMessage] = React.useState("")
  const [error, setError] = React.useState("")
  const [loading, setLoading] = React.useState(false)

  React.useEffect(() => {
    const loadYears = async () => {
      const availableYears = await getEstablishedYears()
      setYears(availableYears)
      const savedYear = localStorage.getItem("selected_year")
      setSelectedYear(savedYear && availableYears.includes(savedYear) ? savedYear : availableYears[0] || "")
    }
    loadYears()
  }, [])

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
    setMessage("")
    if (!familyId) {
      setError("Select your family account first.")
      return
    }

    setLoading(true)
    try {
      const result = await submitFamilyPasswordResetRequest(familyId)
      if (!result.success) {
        setError(result.error || "Unable to send your request.")
      } else {
        setMessage("Your request has been sent to the Sabbath School leader for approval.")
      }
    } catch {
      setError("Unable to send your request. Please try again.")
    } finally {
      setLoading(false)
    }
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
        {message && <p role="status" className="rounded-md border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-800">{message}</p>}

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

        <div className="flex justify-between text-sm">
          <Link href="/family/signin" className="text-indigo-700 underline underline-offset-4">Back to family sign in</Link>
          <Link href="/login" className="text-slate-600 underline underline-offset-4">Staff login</Link>
        </div>
      </section>
    </main>
  )
}