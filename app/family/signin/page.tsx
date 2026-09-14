"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { 
  Users, 
  Lock, 
  Home, 
  ArrowRight, 
  AlertCircle,
  Eye,
  EyeOff,
  Calendar
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { 
  getEstablishedYears, 
  getFamiliesForSelection, 
  loginFamilyAccount 
} from "@/lib/family-actions"

export default function FamilySigninPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const [years, setYears] = React.useState<string[]>([])
  const [selectedYear, setSelectedYear] = React.useState("")
  const [familyName, setFamilyName] = React.useState("")
  const [availableFamilies, setAvailableFamilies] = React.useState<any[]>([])
  const [password, setPassword] = React.useState("")
  const [showPassword, setShowPassword] = React.useState(false)
  const [loading, setLoading] = React.useState(false)
  const [errorMessage, setErrorMessage] = React.useState("")

  React.useEffect(() => {
    async function init() {
      const availableYears = await getEstablishedYears()
      setYears(availableYears)
      const queryYear = searchParams.get("year")
      const currentYear = queryYear || localStorage.getItem("selected_year") || availableYears[0] || "2024-2025"
      setSelectedYear(currentYear)

      const queryFamily = searchParams.get("family")
      if (queryFamily) {
        setFamilyName(queryFamily)
      }
    }
    init()
  }, [searchParams])

  React.useEffect(() => {
    if (!selectedYear) return
    async function loadFams() {
      try {
        const fams = await getFamiliesForSelection(selectedYear)
        setAvailableFamilies(fams)
      } catch (e) {
        console.error(e)
      }
    }
    loadFams()
  }, [selectedYear])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage("")

    if (!familyName.trim()) {
      setErrorMessage("Please enter or select your Family Name.")
      return
    }
    if (!password) {
      setErrorMessage("Please enter your password.")
      return
    }

    setLoading(true)
    try {
      const res = await loginFamilyAccount(familyName, password, selectedYear)
      if (!res.success || !res.family) {
        setErrorMessage(res.error || "Invalid family name or password.")
      } else {
        // Save family session
        localStorage.setItem("family_auth", JSON.stringify(res.family))
        localStorage.setItem("selected_year", res.family.year)
        window.dispatchEvent(new Event("family-auth-change"))
        router.push("/family/dashboard")
      }
    } catch (err: any) {
      setErrorMessage(err.message || "An unexpected error occurred.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/40 to-indigo-50/50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center mb-2">
          <div className="w-14 h-14 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-600/30">
            <Users className="w-8 h-8" />
          </div>
        </div>
        <div className="text-center space-y-1">
          <p className="text-xs font-semibold tracking-widest text-indigo-700 uppercase">
            ASA UNIK-RP NGOMA • SABBATH SCHOOL
          </p>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Family Management System
          </h2>
          <p className="text-sm text-slate-600">
            Sign in to your family portal (Pere / Mere)
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 sm:px-10 shadow-xl shadow-slate-200/50 rounded-2xl border border-slate-100">
          <form onSubmit={handleLogin} className="space-y-5">
            {errorMessage && (
              <div className="p-3.5 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl flex items-start gap-2.5 animate-in fade-in">
                <AlertCircle className="w-5 h-5 shrink-0 text-red-500 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Established Year */}
            <div>
              <Label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5 mb-1.5">
                <Calendar className="w-3.5 h-3.5 text-indigo-600" />
                Established Church Year
              </Label>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm font-medium text-slate-800 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
              >
                {years.map((y) => (
                  <option key={y} value={y}>
                    Church Year: {y}
                  </option>
                ))}
              </select>
            </div>

            {/* Family Name */}
            <div>
              <Label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5 mb-1.5">
                <Home className="w-3.5 h-3.5 text-indigo-600" />
                Family Name
              </Label>
              <div className="relative">
                <Input
                  type="text"
                  list="family-suggestions"
                  placeholder="e.g. Family of Joshua"
                  value={familyName}
                  onChange={(e) => setFamilyName(e.target.value)}
                  required
                  className="rounded-xl border-slate-200 py-2.5 text-sm"
                />
                <datalist id="family-suggestions">
                  {availableFamilies.map((f) => (
                    <option key={f.id} value={f.name} />
                  ))}
                </datalist>
              </div>
              {availableFamilies.length > 0 && (
                <div className="mt-1 flex flex-wrap gap-1">
                  <span className="text-[11px] text-slate-500">Quick select:</span>
                  {availableFamilies.slice(0, 4).map((f) => (
                    <button
                      type="button"
                      key={f.id}
                      onClick={() => setFamilyName(f.name)}
                      className="text-[11px] text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 px-2 py-0.5 rounded-md transition-colors"
                    >
                      {f.name}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Password */}
            <div>
              <Label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5 mb-1.5">
                <Lock className="w-3.5 h-3.5 text-indigo-600" />
                Password
              </Label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="rounded-xl border-slate-200 py-2.5 text-sm pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 rounded-xl shadow-md shadow-indigo-600/20 transition-all flex items-center justify-center gap-2"
            >
              {loading ? (
                "Signing In..."
              ) : (
                <>
                  <span>Sign In to Family Portal</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-600">
            <span>First time here?</span>
            <Link
              href="/family/signup"
              className="font-bold text-indigo-600 hover:text-indigo-800 transition-colors"
            >
              Sign Up Family Account →
            </Link>
          </div>
        </div>

        <div className="mt-6 text-center text-xs text-slate-500">
          <Link href="/" className="hover:text-slate-800 underline underline-offset-4">
            ← Return to Church Home
          </Link>
        </div>
      </div>
    </div>
  )
}
