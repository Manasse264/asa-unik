"use client"

import * as React from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter, usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { LanguageSwitcher } from "@/components/language-switcher"

import { Check, ChevronDown, Globe } from "lucide-react"
import { cn } from "@/lib/utils"

const navTranslations = {
  en: { 
    home: "Home", 
    about: "About", 
    updates: "Updates",
    news: "News",
    announcements: "Announcements",
    login: "Login", 
    register: "Register", 
    logout: "Logout",
    selectYear: "Select Year",
    yearRequired: "Please select a church year to continue.",
    mustSelectYear: "Year Selection Required",
    selectYearPrompt: "Please select the church year you wish to work in to access your dashboard.",
    continue: "Continue to Dashboard"
  },
  rw: { 
    home: "Ahabanza", 
    about: "Ibyerekeye", 
    updates: "Amakuru Mashya",
    news: "Amakuru",
    announcements: "Amatangazo",
    login: "Injira", 
    register: "Kwiyandikisha", 
    logout: "Sohoka",
    selectYear: "Hitamo Umwaka",
    yearRequired: "Nyamuneka hitamo umwaka w'itorero kugira ngo ukomeze.",
    mustSelectYear: "Guhitamo Umwaka Ni Ngombwa",
    selectYearPrompt: "Nyamuneka hitamo umwaka w'itorero wifuza gukoreramo kugira ngo ufungure igenzura ryawe.",
    continue: "Komeza kuri Dashboard"
  },
  fr: { 
    home: "Accueil", 
    about: "À propos", 
    updates: "Mises à jour",
    news: "Nouvelles",
    announcements: "Annonces",
    login: "Connexion", 
    register: "S'inscrire", 
    logout: "Déconnexion",
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
  const [lang, setLang] = React.useState<"en" | "rw" | "fr">("en")
  const [showSubtabs, setShowSubtabs] = React.useState(false)
  const [availableYears, setAvailableYears] = React.useState<string[]>([])
  const [selectedYear, setSelectedYear] = React.useState<string>("")
  const router = useRouter()
  const pathname = usePathname()

  const isHomePage = pathname === "/"
  const isDashboard = pathname.startsWith("/dashboard")
  const isUpdatesSection = pathname.startsWith("/updates") || pathname.startsWith("/news") || pathname.startsWith("/announcements")

  React.useEffect(() => {
    // Hide subtabs on navigation if not in updates section
    if (!isUpdatesSection) {
      setShowSubtabs(false)
    }
  }, [pathname, isUpdatesSection])

  const loadYearConfig = () => {
    const config = localStorage.getItem("system_config")
    if (config) {
      try {
        const { availableYears: years, restrictNewAccounts, restrictOldAccounts } = JSON.parse(config)
        if (years) setAvailableYears(years)
        setRestrictNew(!!restrictNewAccounts)
        setRestrictOld(!!restrictOldAccounts)
      } catch (e) {
        console.error("Error parsing system_config", e)
      }
    }
    const savedYear = localStorage.getItem("selected_year")
    if (savedYear) setSelectedYear(savedYear)
    
    setRegistrationYear(localStorage.getItem("user_registration_year") || "")
  }

  React.useEffect(() => {
    // Check if user is logged in on mount
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
    router.push("/")
    window.dispatchEvent(new Event("auth-change"))
  }

  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const year = e.target.value
    setSelectedYear(year)
    localStorage.setItem("selected_year", year)
    // Trigger event so dashboards can react if needed
    window.dispatchEvent(new Event("year-changed"))
  }

  const filteredYearsList = React.useMemo(() => {
    if (userRole.includes("elder") || userRole.includes("umukuru")) return availableYears
    if (!registrationYear || !availableYears.length) return availableYears

    let filtered = [...availableYears]
    const regIndex = availableYears.indexOf(registrationYear)
    if (regIndex === -1) return availableYears

    if (restrictNew) {
      // Block access to years BEFORE registration
      filtered = filtered.filter((_, index) => index >= regIndex)
    }

    if (restrictOld) {
      // Block access to years AFTER registration
      filtered = filtered.filter((_, index) => index <= regIndex)
    }

    return filtered
  }, [userRole, registrationYear, availableYears, restrictNew, restrictOld])

  return (
    <div className="sticky top-0 z-50 w-full">
      {isDashboard && !selectedYear && (
        <div className="bg-amber-500 text-white text-center py-2 text-sm font-bold animate-pulse">
          {t.yearRequired}
        </div>
      )}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center space-x-2">
              <Image 
                src="/logo.jpeg" 
                alt="ASA-UNIK Logo" 
                width={32} 
                height={32} 
                className="rounded-full object-cover"
              />
              <span className="text-xl font-bold tracking-tight">ASA-UNIK</span>
            </Link>
          </div>

          <div className="flex items-center gap-8">
            {!isDashboard && (
              <nav className="hidden md:flex items-center gap-6">
                <Link 
                  href="/" 
                  className={cn(
                    "text-sm font-medium transition-colors hover:text-primary",
                    pathname === "/" ? "text-primary" : "text-muted-foreground"
                  )}
                >
                  {t.home}
                </Link>
                <Link 
                  href="/about" 
                  className={cn(
                    "text-sm font-medium transition-colors hover:text-primary",
                    pathname === "/about" ? "text-primary" : "text-muted-foreground"
                  )}
                >
                  {t.about}
                </Link>
                <Link 
                  href="/updates"
                  className={cn(
                    "text-sm font-medium transition-colors hover:text-primary",
                    isUpdatesSection ? "text-primary font-bold" : "text-muted-foreground"
                  )}
                >
                  {t.updates}
                </Link>
              </nav>
            )}

            <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center gap-2">
                {!isLoggedIn ? (
                  <>
                    <Button variant="ghost" asChild>
                      <Link href="/login">{t.login}</Link>
                    </Button>
                    <Button asChild>
                      <Link href="/register">{t.register}</Link>
                    </Button>
                  </>
                ) : (
                  <Button variant="outline" onClick={handleLogout}>
                    {t.logout}
                  </Button>
                )}
              </div>
              <div className="flex items-center gap-2">
                 <LanguageSwitcher />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Subtabs positioned below the header bar on the right side - Clean links without a container bar */}
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
                    <option value="2026">2026</option> // Fallback if no years defined
                  )}
                </select>
              </div>
              
              <Button 
                className="w-full h-12 text-lg font-bold" 
                disabled={!selectedYear}
                onClick={() => {
                  if (selectedYear) {
                    // Force refresh or just let state handle it
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
