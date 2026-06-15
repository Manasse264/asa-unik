"use client"

import * as React from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const regTranslations = {
  en: {
    title: "Create an account", subtitle: "Enter your details below to create your account",
    firstName: "First name", lastName: "Last name", email: "Email", role: "Role",
    pwd: "Password", rePwd: "Re-enter Password", signup: "Sign Up",
    agree: "By clicking continue, you agree to our", terms: "Terms of Service", privacy: "Privacy Policy",
    already: "Already have an account?", login: "Login", selectRole: "Select your role",
    ce: "Church Elder", cs: "Church Secretary", ct: "Church Treasurer", ssl: "Sabbath School Leader"
  },
  rw: {
    title: "Fungura konti", subtitle: "Yinjiza imyirondoro yawe ushyireho konti",
    firstName: "Izina rya mbere", lastName: "Izina rya kabiri", email: "Imeli", role: "Inshingano",
    pwd: "Ijambo ry'ibanga", rePwd: "Subiramo ijambo ry'ibanga", signup: "Kwiyandikisha",
    agree: "Ukanze komeza, uba wemeye", terms: "Amategeko agenga imikoreshereze", privacy: "Ibijyanye n'ibanga",
    already: "Usanzwe ufite konti?", login: "Injira", selectRole: "Hitamo inshingano yawe",
    ce: "Umukuru w'Itorero", cs: "Umunyamabanga w'Itorero", ct: "Umbitsi w'Itorero", ssl: "Umuyobozi w'Ishuri ryo ku Isabato"
  },
  fr: {
    title: "Créer un compte", subtitle: "Entrez vos détails ci-dessous pour créer votre compte",
    firstName: "Prénom", lastName: "Nom", email: "E-mail", role: "Rôle",
    pwd: "Mot de passe", rePwd: "Ré-entrer le mot de passe", signup: "S'inscrire",
    agree: "En cliquant sur continuer, vous acceptez nos", terms: "Conditions d'utilisation", privacy: "Politique de confidentialité",
    already: "Vous avez déjà un compte ?", login: "Connexion", selectRole: "Sélectionnez votre rôle",
    ce: "Ancien de l'église", cs: "Secrétaire de l'église", ct: "Trésorier de l'église", ssl: "Responsable de l'école du sabbat"
  }
}

export default function RegisterPage() {
  const [lang, setLang] = React.useState<"en" | "rw" | "fr">("en")
  const [isBlocked, setIsBlocked] = React.useState(false)
  
  // Form state
  const [formData, setFormData] = React.useState({
    firstName: "",
    lastName: "",
    email: "",
    role: "",
    password: "",
    confirmPassword: ""
  })

  React.useEffect(() => {
    const updateLang = () => setLang((localStorage.getItem("app_lang") || "en") as "en" | "rw" | "fr")
    updateLang()
    
    // Check if register is blocked
    const checkBlocked = () => {
      setIsBlocked(localStorage.getItem("block_register") === "true")
    }
    checkBlocked()

    window.addEventListener("lang-change", updateLang)
    window.addEventListener("storage", checkBlocked)
    return () => {
      window.removeEventListener("lang-change", updateLang)
      window.removeEventListener("storage", checkBlocked)
    }
  }, [])

  const t = regTranslations[lang]

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!")
      return
    }

    const roleMap: Record<string, string> = {
      ce: "Church Elder",
      cs: "Church Secretary",
      ct: "Church Treasurer",
      ssl: "Sabbath School Leader"
    }

    // Get current church year for registration
    let registrationYear = new Date().getFullYear().toString()
    const config = localStorage.getItem("system_config")
    if (config) {
      try {
        const { availableYears } = JSON.parse(config)
        if (availableYears && availableYears.length > 0) {
          // Use the latest available year as the registration year
          registrationYear = availableYears[availableYears.length - 1]
        }
      } catch (e) {
        console.error("Error getting registration year", e)
      }
    }

    const newUser = {
      id: Math.random().toString(36).substr(2, 9),
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      role: roleMap[formData.role] || formData.role,
      password: formData.password, // In a real app, this would be hashed
      registrationYear: registrationYear
    }

    // Save to localStorage for Elder to manage
    const existingUsers = JSON.parse(localStorage.getItem("app_users") || "[]")
    localStorage.setItem("app_users", JSON.stringify([...existingUsers, newUser]))
    
    alert("Registration successful! You can now login.")
    window.location.href = "/login"
  }

  const blockMessages = {
    en: "Registration is currently disabled by the Church Elder.",
    rw: "Kwiyandikisha kwahagaritswe n'Umukuru w'Itorero.",
    fr: "L'inscription est actuellement désactivée par l'Ancien de l'église."
  }

  return (
    <div className="container relative flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-2 lg:px-0 min-h-[calc(100vh-64px)] overflow-hidden">
      <div className="relative hidden h-full flex-col p-10 text-white dark:border-r lg:flex overflow-hidden">
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
        <div className="relative z-20 flex items-center text-lg font-bold tracking-tight">ASA RP NGOMA COLLEGE</div>
      </div>
      <div className="lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[400px]">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">{t.title}</h1>
            <p className="text-sm text-muted-foreground">{t.subtitle}</p>
          </div>
          {isBlocked && (
            <div className="p-3 text-sm font-medium text-destructive bg-destructive/10 rounded-md border border-destructive/20 text-center">
              {blockMessages[lang]}
            </div>
          )}
          <form onSubmit={handleRegister} className="grid gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>{t.firstName}</Label>
                <Input 
                  value={formData.firstName} 
                  onChange={(e) => setFormData({...formData, firstName: e.target.value})} 
                  required 
                  disabled={isBlocked} 
                />
              </div>
              <div className="grid gap-2">
                <Label>{t.lastName}</Label>
                <Input 
                  value={formData.lastName} 
                  onChange={(e) => setFormData({...formData, lastName: e.target.value})} 
                  required 
                  disabled={isBlocked} 
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label>{t.email}</Label>
              <Input 
                type="email" 
                value={formData.email} 
                onChange={(e) => setFormData({...formData, email: e.target.value})} 
                required 
                disabled={isBlocked} 
              />
            </div>
            <div className="grid gap-2">
              <Label>{t.role}</Label>
              <select 
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" 
                value={formData.role} 
                onChange={(e) => setFormData({...formData, role: e.target.value})}
                required 
                disabled={isBlocked}
              >
                <option value="" disabled>{t.selectRole}</option>
                <option value="ce">{t.ce}</option>
                <option value="cs">{t.cs}</option>
                <option value="ct">{t.ct}</option>
                <option value="ssl">{t.ssl}</option>
              </select>
            </div>
            <div className="grid gap-2">
              <Label>{t.pwd}</Label>
              <Input 
                type="password" 
                value={formData.password} 
                onChange={(e) => setFormData({...formData, password: e.target.value})} 
                required 
                disabled={isBlocked} 
              />
            </div>
            <div className="grid gap-2">
              <Label>{t.rePwd}</Label>
              <Input 
                type="password" 
                value={formData.confirmPassword} 
                onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})} 
                required 
                disabled={isBlocked} 
              />
            </div>
            <Button className="w-full" disabled={isBlocked}>{t.signup}</Button>
          </form>
          <p className="px-8 text-center text-sm text-muted-foreground">
            {t.agree} <Link href="#" className="underline">{t.terms}</Link> {lang === 'en' ? 'and' : lang === 'rw' ? 'na' : 'et'} <Link href="#" className="underline">{t.privacy}</Link>.
          </p>
          <div className="text-center text-sm">{t.already} <Link href="/login" className="underline">{t.login}</Link></div>
        </div>
      </div>
    </div>
  )
}
