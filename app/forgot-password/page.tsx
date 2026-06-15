"use client"

import * as React from "react"
import Link from "next/link"

const translations = {
  en: {
    title: "Forgot Password",
    description: "Enter your email address and we'll send you a link to reset your password.",
    email: "Email address",
    send: "Send Reset Link",
    back: "Back to login",
    success: "Check your email for a reset link."
  },
  rw: {
    title: "Wibagiwe ijambo ry'ibanga",
    description: "Yinjiza imeli yawe maze tukoherereze ihuza ryo guhindura ijambo ry'ibanga.",
    email: "Imeli",
    send: "Ohereza ihuza",
    back: "Subira ahabanza",
    success: "Reba imeli yawe uone ihuza ryo guhindura ijambo ry'ibanga."
  },
  fr: {
    title: "Mot de passe oublié",
    description: "Entrez votre adresse e-mail et nous vous enverrons un lien pour réinitialiser votre mot de passe.",
    email: "Adresse e-mail",
    send: "Envoyer le lien de réinitialisation",
    back: "Retour à la connexion",
    success: "Vérifiez vos e-mails pour un lien de réinitialisation."
  }
}

export default function ForgotPasswordPage() {
  const [lang, setLang] = React.useState<"en" | "rw" | "fr">("en")

  React.useEffect(() => {
    const updateLang = () => setLang((localStorage.getItem("app_lang") || "en") as "en" | "rw" | "fr")
    updateLang()
    window.addEventListener("lang-change", updateLang)
    return () => window.removeEventListener("lang-change", updateLang)
  }, [])

  const t = translations[lang]

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
          <div className="flex flex-col space-y-4 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">{t.title}</h1>
            <div className="p-6 bg-amber-50 border border-amber-200 rounded-lg">
              <p className="text-amber-800 font-medium text-lg">
                {lang === 'rw' ? "Nyamuneka vugana n'ubuyobozi kugira ngo uhindure ijambo ry'ibanga." : 
                 lang === 'fr' ? "Veuillez contacter l'administrateur pour réinitialiser votre mot de passe." : 
                 "Please contact admin to reset password"}
              </p>
            </div>
            <div className="pt-4">
              <Link href="/login" className="text-sm underline font-medium">
                {t.back}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
