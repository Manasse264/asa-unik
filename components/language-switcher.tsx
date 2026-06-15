"use client"

import * as React from "react"
import { Check, ChevronDown, Globe } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

const languages = [
  { label: "English", value: "en" },
  { label: "Français", value: "fr" },
]

export function LanguageSwitcher() {
  const [open, setOpen] = React.useState(false)
  const [currentLang, setCurrentLang] = React.useState("en")

  React.useEffect(() => {
    const savedLang = localStorage.getItem("app_lang") || "en"
    setCurrentLang(savedLang)
  }, [])

  const handleLangChange = (lang: string) => {
    setCurrentLang(lang)
    localStorage.setItem("app_lang", lang)
    window.dispatchEvent(new Event("lang-change"))
    setOpen(false)
  }

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="sm"
        className="flex items-center gap-2"
        onClick={() => setOpen(!open)}
      >
        <Globe className="h-4 w-4" />
        <span className="uppercase">{currentLang}</span>
        <ChevronDown className={cn("h-4 w-4 transition-transform", open && "rotate-180")} />
      </Button>

      {open && (
        <>
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setOpen(false)} 
          />
          <div className="absolute right-0 mt-2 w-40 rounded-md border bg-popover p-1 shadow-md z-20">
            {languages.map((lang) => (
              <button
                key={lang.value}
                className={cn(
                  "flex w-full items-center justify-between rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground text-left",
                  currentLang === lang.value && "bg-accent text-accent-foreground"
                )}
                onClick={() => handleLangChange(lang.value)}
              >
                {lang.label}
                {currentLang === lang.value && <Check className="h-4 w-4" />}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
