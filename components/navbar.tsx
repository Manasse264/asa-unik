"use client"

import * as React from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter, usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { LanguageSwitcher } from "@/components/language-switcher"
import { getSystemConfig } from "@/lib/actions"

import { 
  Check, 
  ChevronDown, 
  Globe, 
  Heart, 
  Key, 
  LogOut, 
  Sparkles, 
  User 
} from "lucide-react"
import { cn } from "@/lib/utils"

const navTranslations = {
  en: { 
    home: "Home", 
    about: "About Us", 
    ministries: "Ministries",
    sermons: "Sermons",
    events: "Events",
    gallery: "Gallery",
    updates: "Updates",
    news: "News",
    announcements: "Announcements",
    account: "Account",
    login: "Login", 
    register: "Register", 
    logout: "Logout",
    give: "Give",
    selectYear: "Select Year",
    yearRequired: "Please select a church year to continue.",
    mustSelectYear: "Year Selection Required",
    selectYearPrompt: "Please select the church year you wish to work in to access your dashboard.",
    continue: "Continue to Dashboard"
  },
  rw: { 
    home: "Ahabanza", 
    about: "Ibyerekeye", 
    ministries: "Minisitiri",
    sermons: "Inyigisho",
    events: "Ibyakorwa",
    gallery: "Amafoto",
    updates: "Amakuru Mashya",
    news: "Amakuru",
    announcements: "Amatangazo",
    account: "Konte",
    login: "Injira", 
    register: "Kwiyandikisha", 
    logout: "Sohoka",
    give: "Tanga",
    selectYear: "Hitamo Umwaka",
    yearRequired: "Nyamuneka hitamo umwaka w'itorero kugira ngo ukomeze.",
    mustSelectYear: "Guhitamo Umwaka Ni Ngombwa",
    selectYearPrompt: "Nyamuneka hitamo umwaka w'itorero wifuza gukoreramo kugira ngo ufungure igenzura ryawe.",
    continue: "Komeza kuri Dashboard"
  },
  fr: { 
    home: "Accueil", 
    about: "À propos", 
    ministries: "Ministères",
    sermons: "Sermons",
    events: "Événements",
    gallery: "Galerie",
    updates: "Mises à jour",
    news: "Nouvelles",
    announcements: "Annonces",
    account: "Compte",
    login: "Connexion", 
    register: "S'inscrire", 
    logout: "Déconnexion",
    give: "Donner",
    selectYear: "Choisir l'année",
    yearRequired: "Veuillez sélectionner une année d'église pour continuer.",
    mustSelectYear: "Sélection de l'année requise",
    selectYearPrompt: "Veuillez sélectionner l'année d'église dans laquelle vous souhaitez travailler pour accéder à votre tableau de bord.",
    continue: "Continuer vers le tableau de bord"
  }
}

export function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = React.useState(false)
  const [userRole, setUserRole] = React.useState("")
  const [registrationYear, setRegistrationYear] = React.useState("")
  const [restrictNew, setRestrictNew] = React.useState(false)
  const [restrictOld, setRestrictOld] = React.useState(false)
  const [blockedYears, setBlockedYears] = React.useState<string[]>([])
  const [lang, setLang] = React.useState<"en" | "rw" | "fr">("en")
  const [availableYears, setAvailableYears] = React.useState<string[]>([])
  const [selectedYear, setSelectedYear] = React.useState<string>("")
  const [isAccountOpen, setIsAccountOpen] = React.useState(false)

  const router = useRouter()
  const pathname = usePathname()
  const accountMenuRef = React.useRef<HTMLDivElement>(null)

  const isDashboard = pathname.startsWith("/dashboard")
  const isUpdatesSection = pathname.startsWith("/updates") || pathname.startsWith("/news") || pathname.startsWith("/announcements")

  // Close account dropdown on outside click
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (accountMenuRef.current && !accountMenuRef.current.contains(event.target as Node)) {
        setIsAccountOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const applyYearConfig = (config: any) => {
    if (!config) return
    const years = Array.isArray(config.availableYears) ? config.availableYears : []
    setAvailableYears(years)
    setRestrictNew(!!config.restrictNewAccounts)
    setRestrictOld(!!config.restrictOldAccounts)
    setBlockedYears(Array.isArray(config.blockedYears) ? config.blockedYears : [])
  }

  const loadYearConfig = async () => {
    const cachedConfig = localStorage.getItem("system_config")
    if (cachedConfig) {
      try {
        applyYearConfig(JSON.parse(cachedConfig))
      } catch (e) {
        console.error("Error parsing system_config", e)
      }
    }

    try {
      const config = await getSystemConfig()
      applyYearConfig(config)
      localStorage.setItem("system_config", JSON.stringify(config))
    } catch (e) {
      console.error("Error loading system_config", e)
    }

    const savedYear = localStorage.getItem("selected_year")
    if (savedYear) setSelectedYear(savedYear)
    
    setRegistrationYear(localStorage.getItem("user_registration_year") || "")
  }

  React.useEffect(() => {
    const user = localStorage.getItem("user_role")
    setIsLoggedIn(!!user)
    setUserRole(user || "")

    loadYearConfig()

    const updateLang = () => {
      const savedLang = (localStorage.getItem("app_lang") || "en") as "en" | "rw" | "fr"
      setLang(savedLang)
    }
    updateLang()

    const handleStorageChange = () => {
      const currentUser = localStorage.getItem("user_role")
      setIsLoggedIn(!!currentUser)
      setUserRole(currentUser || "")
      loadYearConfig()
    }

    window.addEventListener("storage", handleStorageChange)
    window.addEventListener("auth-change", () => {
      const currentUser = localStorage.getItem("user_role")
      setIsLoggedIn(!!currentUser)
      setUserRole(currentUser || "")
    })
    window.addEventListener("lang-change", updateLang)

    return () => {
      window.removeEventListener("lang-change", updateLang)
      window.removeEventListener("storage", handleStorageChange)
    }
  }, [])

  const t = navTranslations[lang]

  const handleLogout = () => {
    localStorage.removeItem("user_role")
    setIsLoggedIn(false)
    setUserRole("")
    setIsAccountOpen(false)
    router.push("/")
    window.dispatchEvent(new Event("auth-change"))
  }

  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const year = e.target.value
    setSelectedYear(year)
    localStorage.setItem("selected_year", year)
    window.dispatchEvent(new Event("year-changed"))
  }

  const filteredYearsList = React.useMemo(() => {
    if (userRole.includes("elder") || userRole.includes("umukuru")) return availableYears
    if (!registrationYear || !availableYears.length) return availableYears

    let filtered = availableYears.filter((year) => !blockedYears.includes(year))
    const regIndex = availableYears.indexOf(registrationYear)
    if (regIndex === -1) return filtered

    if (restrictNew) {
      filtered = filtered.filter((year) => availableYears.indexOf(year) >= regIndex)
    }

    if (restrictOld) {
      filtered = filtered.filter((year) => availableYears.indexOf(year) <= regIndex)
    }

    return filtered
  }, [userRole, registrationYear, availableYears, blockedYears, restrictNew, restrictOld])

  React.useEffect(() => {
    if (selectedYear && filteredYearsList.length > 0 && !filteredYearsList.includes(selectedYear)) {
      setSelectedYear("")
      localStorage.removeItem("selected_year")
      window.dispatchEvent(new Event("year-changed"))
    }
  }, [filteredYearsList, selectedYear])

  const navLinks = [
    { href: "/", label: t.home },
    { href: "/about", label: t.about },
    { href: "/ministries", label: t.ministries },
    { href: "/sermons", label: t.sermons },
    { href: "/events", label: t.events },
    { href: "/gallery", label: t.gallery },
    { href: "/updates", label: t.updates, isUpdates: true },
  ]

  return (
    <div className="sticky top-0 z-50 w-full">
      {isDashboard && !selectedYear && (
        <div className="bg-amber-500 text-white text-center py-2 text-sm font-bold animate-pulse">
          {t.yearRequired}
        </div>
      )}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm">
        <div className="container flex h-20 items-center justify-between px-4 md:px-8">
          
          {/* Logo Section */}
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-3 group">
              <Image 
                src="/logo.jpeg" 
                alt="ASA-UNIK Logo" 
                width={48} 
                height={48} 
                className="rounded-full object-cover transition-transform group-hover:scale-105"
              />
              <div className="flex flex-col">
                <span className="text-xl font-black tracking-tight text-slate-900 leading-none">
                  ASA UNIK-RP NGOMA
                </span>
                <span className="text-[11px] font-semibold text-slate-600 mt-1">
                  Seventh-day Adventist Church
                </span>
                <span className="text-[9px] font-medium text-slate-500 tracking-wider">
                  Know God • Grow Together • Serve Others
                </span>
              </div>
            </Link>
          </div>

          {/* Navigation Links */}
          {!isDashboard && (
            <nav className="hidden xl:flex items-center gap-7">
              {navLinks.map((link) => {
                const isActive = link.isUpdates ? isUpdatesSection : pathname === link.href
                return (
                  <Link 
                    key={link.href}
                    href={link.href} 
                    className={cn(
                      "text-sm font-semibold transition-colors hover:text-primary relative py-1",
                      isActive ? "text-primary border-b-2 border-primary font-bold" : "text-slate-700"
                    )}
                  >
                    {link.label}
                  </Link>
                )
              })}
            </nav>
          )}

          {/* Right Section Actions */}
          <div className="flex items-center gap-3">
            
            {/* Account Dropdown */}
            <div className="relative" ref={accountMenuRef}>
              <button
                onClick={() => setIsAccountOpen(!isAccountOpen)}
                className="flex items-center gap-2 bg-[#0d3b66] hover:bg-[#0a2e52] text-white px-4 py-2 rounded-full text-sm font-medium shadow-sm transition-all"
              >
                <User className="w-4 h-4" />
                <span>{t.account}</span>
                <ChevronDown className={cn("w-4 h-4 transition-transform duration-200", isAccountOpen && "rotate-180")} />
              </button>

              {isAccountOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-100 rounded-xl shadow-xl py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  {!isLoggedIn ? (
                    <>
                      <Link
                        href="/login"
                        onClick={() => setIsAccountOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                      >
                        <Key className="w-4 h-4 text-slate-500" />
                        {t.login}
                      </Link>
                      <Link
                        href="/register"
                        onClick={() => setIsAccountOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                      >
                        <Sparkles className="w-4 h-4 text-slate-500" />
                        {t.register}
                      </Link>
                    </>
                  ) : (
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors text-left"
                    >
                      <LogOut className="w-4 h-4" />
                      {t.logout}
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Language Switcher */}
            <div className="flex items-center">
              <LanguageSwitcher />
            </div>

            {/* Give Button */}
            <Button 
              asChild
              className="bg-[#f4a261] hover:bg-[#e76f51] text-white font-bold px-5 py-2 rounded-full flex items-center gap-1.5 shadow-sm border-none transition-all"
            >
              <Link href="/give">
                <Heart className="w-4 h-4 fill-current" />
                {t.give}
              </Link>
            </Button>
          </div>

        </div>
      </header>

      {/* Updates / News / Announcements Subtabs */}
      {isUpdatesSection && (
        <div className="container flex justify-end mt-1 px-4 md:px-6 pointer-events-none">
          <div className="pointer-events-auto flex items-center gap-6 py-2">
            <Link 
              href="/news" 
              className={cn(
                "text-sm font-bold uppercase tracking-widest transition-colors hover:text-primary",
                pathname === "/news" ? "text-primary underline underline-offset-8 decoration-2" : "text-muted-foreground"
              )}
            >
              {t.news}
            </Link>
            <Link 
              href="/announcements" 
              className={cn(
                "text-sm font-bold uppercase tracking-widest transition-colors hover:text-primary",
                pathname === "/announcements" ? "text-primary underline underline-offset-8 decoration-2" : "text-muted-foreground"
              )}
            >
              {t.announcements}
            </Link>
          </div>
        </div>
      )}

      {/* Mandatory Year Selection Overlay */}
      {isLoggedIn && isDashboard && !selectedYear && (
        <div className="fixed inset-0 z-[100] bg-background flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-card border shadow-2xl rounded-xl p-8 space-y-8 animate-in fade-in zoom-in duration-300">
            <div className="text-center space-y-4">
              <div className="flex justify-center">
                <Image 
                  src="/logo.jpeg" 
                  alt="Logo" 
                  width={80} 
                  height={80} 
                  className="rounded-full shadow-lg"
                />
              </div>
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">{t.mustSelectYear}</h2>
                <p className="text-muted-foreground text-lg">
                  {lang === 'en' ? 'Welcome back! ' : lang === 'rw' ? 'Murakaza neza! ' : 'Bienvenue ! '}
                  <span className="font-bold text-foreground capitalize">
                    {userRole.replace('-', ' ')}
                  </span>
                </p>
                <p className="text-muted-foreground">{t.selectYearPrompt}</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  {t.selectYear}
                </label>
                <select
                  className="flex h-12 w-full rounded-md border border-input bg-background px-3 py-2 text-lg font-bold ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  value={selectedYear}
                  onChange={handleYearChange}
                >
                  <option value="" disabled>{lang === 'en' ? 'Select Year' : lang === 'rw' ? 'Hitamo Umwaka' : 'Choisir l\'année'}</option>
                  {filteredYearsList.length > 0 ? (
                    filteredYearsList.map(year => (
                      <option key={year} value={year}>{year}</option>
                    ))
                  ) : (
                    <option value="2026">2026</option>
                  )}
                </select>
              </div>
              
              <Button 
                className="w-full h-12 text-lg font-bold" 
                disabled={!selectedYear}
                onClick={() => {
                  if (selectedYear) {
                    window.dispatchEvent(new Event("year-changed"))
                  }
                }}
              >
                {t.continue}
              </Button>
            </div>

            <div className="pt-4 border-t text-center">
              <Button variant="ghost" size="sm" onClick={handleLogout} className="text-muted-foreground hover:text-destructive">
                {t.logout}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}