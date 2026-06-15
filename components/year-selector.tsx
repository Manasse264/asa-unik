"use client"

import * as React from "react"
import { Calendar } from "lucide-react"

export function YearSelector() {
  const [availableYears, setAvailableYears] = React.useState<string[]>([])
  const [selectedYear, setSelectedYear] = React.useState<string>("")
  const [lang, setLang] = React.useState<string>("en")
  const [userRole, setUserRole] = React.useState<string>("")
  const [userRegYear, setUserRegYear] = React.useState<string>("")
  const [systemConfig, setSystemConfig] = React.useState<any>(null)

  const loadConfig = () => {
    if (typeof window === "undefined") return

    const configStr = localStorage.getItem("system_config")
    if (configStr) {
      try {
        const config = JSON.parse(configStr)
        setSystemConfig(config)
        if (config.availableYears) setAvailableYears(config.availableYears)
      } catch (e) {
        console.error("Error parsing system_config", e)
      }
    }
    const savedYear = localStorage.getItem("selected_year")
    if (savedYear) setSelectedYear(savedYear)
    
    setLang(localStorage.getItem("app_lang") || "en")
    setUserRole(localStorage.getItem("user_role") || "")
    setUserRegYear(localStorage.getItem("user_registration_year") || "")
  }

  const getFilteredYears = () => {
    const isElder = userRole.includes("elder") || userRole.includes("umukuru")
    let filtered = [...availableYears]

    // Remove blocked years from the global list for non-elders
    if (systemConfig?.blockedYears && !isElder) {
      filtered = filtered.filter(year => !systemConfig.blockedYears.includes(year))
    }

    if (isElder) return filtered

    if (!userRegYear || !filtered.length) return filtered

    if (!systemConfig) return filtered

    try {
      const { restrictNewAccounts, restrictOldAccounts } = systemConfig
      let finalFiltered = [...filtered]

      const regIndex = availableYears.indexOf(userRegYear)
      if (regIndex === -1) return filtered

      if (restrictNewAccounts) {
        // Block access to years BEFORE registration
        finalFiltered = finalFiltered.filter(year => {
          const idx = availableYears.indexOf(year)
          return idx >= regIndex
        })
      }

      if (restrictOldAccounts) {
        // Block access to years AFTER registration
        finalFiltered = finalFiltered.filter(year => {
          const idx = availableYears.indexOf(year)
          return idx <= regIndex
        })
      }

      return finalFiltered
    } catch (e) {
      return filtered
    }
  }

  React.useEffect(() => {
    loadConfig()
    window.addEventListener("storage", loadConfig)
    window.addEventListener("lang-change", loadConfig)
    window.addEventListener("login-state-change", loadConfig)
    return () => {
      window.removeEventListener("storage", loadConfig)
      window.removeEventListener("lang-change", loadConfig)
      window.removeEventListener("login-state-change", loadConfig)
    }
  }, [])

  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const year = e.target.value
    setSelectedYear(year)
    localStorage.setItem("selected_year", year)
    window.dispatchEvent(new Event("year-changed"))
  }

  const filtered = getFilteredYears()
  const label = lang === 'rw' ? 'Umwaka' : lang === 'fr' ? 'Année' : 'Year'

  return (
    <div className="flex items-center gap-2 bg-card border rounded-lg px-3 py-1.5 shadow-sm mb-4 w-fit">
      <Calendar className="h-4 w-4 text-primary" />
      <span className="text-xs font-bold text-muted-foreground uppercase">{label}:</span>
      <select
        className="bg-transparent text-sm font-bold focus:outline-none cursor-pointer"
        value={selectedYear}
        onChange={handleYearChange}
      >
        {filtered.map(year => (
          <option key={year} value={year}>{year}</option>
        ))}
      </select>
    </div>
  )
}
