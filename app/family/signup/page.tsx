"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { 
  Users, 
  Lock, 
  User, 
  Calendar, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle,
  Eye,
  EyeOff,
  Home
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { 
  getEstablishedYears, 
  getFamiliesForSelection, 
  registerFamilyAccount 
} from "@/lib/family-actions"

export default function FamilySignupPage() {
  const router = useRouter()
  const [years, setYears] = React.useState<string[]>([])
  const [selectedYear, setSelectedYear] = React.useState("")
  const [families, setFamilies] = React.useState<any[]>([])
  const [selectedFamilyId, setSelectedFamilyId] = React.useState("")
  const [pereName, setPereName] = React.useState("")
  const [mereName, setMereName] = React.useState("")
  const [password, setPassword] = React.useState("")
  const [confirmPassword, setConfirmPassword] = React.useState("")
  const [showPassword, setShowPassword] = React.useState(false)
  const [loading, setLoading] = React.useState(false)
  const [fetchingFamilies, setFetchingFamilies] = React.useState(false)
  const [errorMessage, setErrorMessage] = React.useState("")
  const [successMessage, setSuccessMessage] = React.useState("")

  // Load established years
  React.useEffect(() => {
    async function initYears() {
      const availableYears = await getEstablishedYears()
      setYears(availableYears)
      const currentYear = localStorage.getItem("selected_year") || availableYears[0] || "2024-2025"
      setSelectedYear(currentYear)
    }
    initYears()
  }, [])

  // Load families when selectedYear changes
  React.useEffect(() => {
    if (!selectedYear) return
    async function loadFamilies() {
      setFetchingFamilies(true)
      try {
        const fams = await getFamiliesForSelection(selectedYear)
        setFamilies(fams)
        setSelectedFamilyId("")
        setPereName("")
        setMereName("")
      } catch (e) {
        console.error("Error loading families:", e)
      } finally {
        setFetchingFamilies(false)
      }
    }
    loadFamilies()
  }, [selectedYear])

  // Handle Family selection
  const handleFamilyChange = (famId: string) => {
    setSelectedFamilyId(famId)
    const fam = families.find(f => f.id === famId)
    if (fam) {
      if (fam.pere) setPereName(fam.pere)
      if (fam.mere) setMereName(fam.mere)
    }
  }

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage("")
    setSuccessMessage("")

    if (!selectedFamilyId) {
      setErrorMessage("Please select your family name from the list.")
      return
    }
    if (!pereName.trim() || !mereName.trim()) {
      setErrorMessage("Please enter names for both Pere (Father) and Mere (Mother).")
      return
    }
    if (!password || password.length < 4) {
      setErrorMessage("Password must be at least 4 characters long.")
      return
    }
    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match.")
      return
    }

    setLoading(true)
    try {
      const res = await registerFamilyAccount({
        familyId: selectedFamilyId,
        pere: pereName,
        mere: mereName,
        password,
        confirmPassword,
      })

      if (!res.success) {
        setErrorMessage(res.error || "Failed to register family account.")
      } else {
        setSuccessMessage("Family account successfully created! Redirecting to sign in...")
        setTimeout(() => {
          router.push(`/family/signin?year=${encodeURIComponent(selectedYear)}&family=${encodeURIComponent(res.family?.name || "")}`)
        }, 1500)
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
            Sign up for your family portal (Pere & Mere)
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-lg">
        <div className="bg-white py-8 px-6 sm:px-10 shadow-xl shadow-slate-200/50 rounded-2xl border border-slate-100">
          <form onSubmit={handleSignup} className="space-y-5">
            {errorMessage && (
              <div className="p-3.5 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl flex items-start gap-2.5 animate-in fade-in">
                <AlertCircle className="w-5 h-5 shrink-0 text-red-500 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            {successMessage && (
              <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm rounded-xl flex items-center gap-2.5 animate-in fade-in">
                <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-600" />
                <span>{successMessage}</span>
              </div>
            )}

            {/* Established Year Selection */}
            <div>
              <Label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5 mb-1.5">
                <Calendar className="w-3.5 h-3.5 text-indigo-600" />
                Church Year
              </Label>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm font-medium text-slate-800 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
              >
                {years.map((y) => (
                  <option key={y} value={y}>
                     {y}
                  </option>
                ))}
              </select>
              <p className="text-[11px] text-slate-500 mt-1">
            
              </p>
            </div>

            {/* Family Name Selection */}
            <div>
              <Label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5 mb-1.5">
                <Home className="w-3.5 h-3.5 text-indigo-600" />
                Family 
              </Label>
              <select
                value={selectedFamilyId}
                onChange={(e) => handleFamilyChange(e.target.value)}
                disabled={fetchingFamilies || families.length === 0}
                className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm font-medium text-slate-800 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all disabled:opacity-60"
              >
                <option value="">-- Select Your Family Name --</option>
                {families.map((fam) => (
                  <option key={fam.id} value={fam.id}>
                    {fam.name} {fam.hasAccount ? "✓ (Account Exists)" : ""}
                  </option>
                ))}
              </select>
              {families.length === 0 && !fetchingFamilies && (
                <p className="text-[11px] text-amber-600 mt-1">
                  No families found for year {selectedYear}. Please contact your Sabbath School Leader to register your family first.
                </p>
              )}
            </div>

            {/* Names: Pere & Mere */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5 mb-1.5">
                  <User className="w-3.5 h-3.5 text-indigo-600" />
                  Pere (Father) Name
                </Label>
                <Input
                  type="text"
                  
                  value={pereName}
                  onChange={(e) => setPereName(e.target.value)}
                  required
                  className="rounded-xl border-slate-200 py-2 text-sm"
                />
              </div>
              <div>
                <Label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5 mb-1.5">
                  <User className="w-3.5 h-3.5 text-indigo-600" />
                  Mere (Mother) Name
                </Label>
                <Input
                  type="text"
                  
                  value={mereName}
                  onChange={(e) => setMereName(e.target.value)}
                  required
                  className="rounded-xl border-slate-200 py-2 text-sm"
                />
              </div>
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
                  className="rounded-xl border-slate-200 py-2 text-sm pr-10"
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

            {/* Re-enter Password */}
            <div>
              <Label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5 mb-1.5">
                <Lock className="w-3.5 h-3.5 text-indigo-600" />
                Re-enter Password
              </Label>
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="rounded-xl border-slate-200 py-2 text-sm"
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 rounded-xl shadow-md shadow-indigo-600/20 transition-all flex items-center justify-center gap-2"
            >
              {loading ? (
                "Creating Account..."
              ) : (
                <>
                  <span>Create Family Account</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-600">
            <span>Already registered your family account?</span>
            <Link
              href="/family/signin"
              className="font-bold text-indigo-600 hover:text-indigo-800 transition-colors"
            >
              Sign In to Family Portal →
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
