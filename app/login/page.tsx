"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

import { getUsers, getSystemConfig } from "@/lib/actions"

const loginTranslations = {
  en: {
    title: "Login", subtitle: "Enter your email and password to login",
    identifier: "Email Address", pwd: "Password", forgot: "Forgot password?",
    login: "Login", noAccount: "Don't have an account?", register: "Register"
  },
  rw: {
    title: "Injira", subtitle: "Yinjiza imeli yawe n'ijambo ry'ibanga",
    identifier: "Imeli yawe", pwd: "Ijambo ry'ibanga", forgot: "Wibagiwe ijambo ry'ibanga?",
    login: "Injira", noAccount: "Ntabwo ufite konti?", register: "Kwiyandikisha"
  },
  fr: {
    title: "Connexion", subtitle: "Entrez votre e-mail et votre mot de passe pour vous connecter",
    identifier: "Adresse e-mail", pwd: "Mot de passe", forgot: "Mot de passe oublié ?",
    login: "Connexion", noAccount: "Vous n'avez pas de compte ?", register: "S'inscrire"
  }
}

export default function LoginPage() {
  const router = useRouter()
  const [identifier, setIdentifier] = React.useState("")
  const [password, setPassword] = React.useState("")
  const [lang, setLang] = React.useState<"en" | "rw" | "fr">("en")
  const [isBlocked, setIsBlocked] = React.useState(false)

  React.useEffect(() => {
    const updateLang = () => setLang((localStorage.getItem("app_lang") || "en") as "en" | "rw" | "fr")
    updateLang()
    
    // Check if login is blocked
    const checkBlocked = async () => {
      const config = await getSystemConfig()
      setIsBlocked(!!config.blockLogin)
    }
    checkBlocked()

    window.addEventListener("lang-change", updateLang)
    window.addEventListener("storage", checkBlocked)
    return () => {
      window.removeEventListener("lang-change", updateLang)
      window.removeEventListener("storage", checkBlocked)
    }
  }, [])

  const t = loginTranslations[lang]

  const blockMessages = {
    en: "Login is currently disabled by the Church Elder.",
    rw: "Kwinjira kwahagaritswe n'Umukuru w'Itorero.",
    fr: "La connexion est actuellement désactivée par l'Ancien de l'église."
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (isBlocked) return
    const input = identifier.toLowerCase().trim()
    
    // Find user in Database via Server Actions
    const allUsers = await getUsers()
    const user = allUsers.find((u: any) => 
      u.email.toLowerCase() === input && u.password === password
    )

    if (!user) {
      // Allow 'elder' identifier only for the hardcoded master account for emergency access
      const isMasterElder = input === "elder" && password === "admin123"
      
      if (isMasterElder) {
        localStorage.setItem("user_role", "Church Elder")
        localStorage.setItem("user_registration_year", new Date().getFullYear().toString())
        const config = await getSystemConfig()
        localStorage.setItem("user_allowed_years", JSON.stringify(config.availableYears || ["2024-2025"]))
        
        window.dispatchEvent(new Event("auth-change"))
        window.dispatchEvent(new Event("login-state-change"))
        router.push("/dashboard/elder")
        return
      }

      alert("Invalid email or password.")
      return
    }

    // Set user session
    localStorage.setItem("user_role", user.role)
    localStorage.setItem("user_registration_year", user.registrationYear || new Date().getFullYear().toString())
    localStorage.setItem("user_email", user.email)
    
    if (user.role.includes("Elder")) {
      const config = await getSystemConfig()
      localStorage.setItem("user_allowed_years", JSON.stringify(config.availableYears || ["2024-2025"]))
    } else {
      localStorage.setItem("user_allowed_years", JSON.stringify([]))
    }

    let targetPath = "/dashboard/secretary"
    const r = user.role.toLowerCase()
    if (r.includes("secretary")) targetPath = "/dashboard/secretary"
    else if (r.includes("elder")) targetPath = "/dashboard/elder"
    else if (r.includes("treasurer")) targetPath = "/dashboard/treasurer"
    else if (r.includes("sabbath") || r.includes("school")) targetPath = "/dashboard/sabbath-school"

    window.dispatchEvent(new Event("auth-change"))
    window.dispatchEvent(new Event("login-state-change"))
    router.push(targetPath)
  }

  return (
    <div className="container relative flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-2 lg:px-0 min-h-[calc(100vh-64px)] overflow-hidden">
      <div className="relative hidden h-full flex-col p-10 text-white lg:flex overflow-hidden">
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center animate-background-zoom animate-slide-fade"
          style={{ backgroundImage: "url('/photo1.jpg')" }}
        />
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center animate-background-zoom animate-slide-fade"
          style={{ backgroundImage: "url('/photo2.jpg')", animationDelay: "-10s, -10s" }}
        />
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center animate-background-zoom animate-slide-fade"
          style={{ backgroundImage: "url('/photo3.jpg')", animationDelay: "-20s, -20s" }}
        />
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center animate-background-zoom animate-slide-fade"
          style={{ backgroundImage: "url('/photo4.jpg')", animationDelay: "-30s, -30s" }}
        />
        <div className="absolute inset-0 z-10 bg-black/60" />
        <div className="relative z-20 text-lg font-bold tracking-tight">ASA RP NGOMA COLLEGE</div>
      </div>
      <div className="lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">{t.title}</h1>
            <p className="text-sm text-muted-foreground">{t.subtitle}</p>
          </div>
          {isBlocked && (
            <div className="p-3 text-sm font-medium text-destructive bg-destructive/10 rounded-md border border-destructive/20 text-center">
              {blockMessages[lang]}
            </div>
          )}
          <form onSubmit={handleLogin} className="grid gap-4">
            <div className="grid gap-2">
              <Label>{t.identifier}</Label>
              <Input value={identifier} onChange={(e) => setIdentifier(e.target.value)} required disabled={isBlocked} />
            </div>
            <div className="grid gap-2">
              <Label>{t.pwd}</Label>
              <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required disabled={isBlocked} />
              <div className="flex justify-end"><Link href="/forgot-password" disable-nprogress="true" className="text-sm underline">{t.forgot}</Link></div>
            </div>
            <Button className="w-full" type="submit" disabled={isBlocked}>{t.login}</Button>
          </form>
          <div className="text-center text-sm text-muted-foreground">{t.noAccount} <Link href="/register" className="underline">{t.register}</Link></div>
        </div>
      </div>
    </div>
  )
}
