"use client"

import * as React from "react"
import Link from "next/link"
import { Newspaper, Bell, ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"

const translations = {
  en: {
    title: "Updates ",
    newsTitle: "News",
    newsDesc: "Browse the latest stories and happenings in our community.",
    annTitle: "Announcements",
    annDesc: "View official notices, event schedules, and important information.",
    viewAll: "View All"
  },
  rw: {
    title: "Ahagezweho",
    newsTitle: "Amakuru",
    newsDesc: "Soma inkuru n'ibyabaye vuba mu muryango wacu.",
    annTitle: "Amatangazo",
    annDesc: "Reba amatangazo yemewe, gahunda z'ibirori, n'amakuru y'ingenzi.",
    viewAll: "Reba byose"
  },
  fr: {
    title: "Centre de mises à jour",
    newsTitle: "Nouvelles",
    newsDesc: "Consultez les dernières histoires et événements de notre communauté.",
    annTitle: "Annonces",
    annDesc: "Consultez les avis officiels, les horaires des événements et les informations importantes.",
    viewAll: "Voir tout"
  }
}

export default function UpdatesHubPage() {
  const [lang, setLang] = React.useState<"en" | "rw" | "fr">("en")
  const [latestAnn, setLatestAnn] = React.useState<any>(null)
  const [latestNews, setLatestNews] = React.useState<any>(null)

  const loadLatest = () => {
    const year = localStorage.getItem('selected_year') || new Date().getFullYear().toString()
    const saved = localStorage.getItem(`church_announcements_${year}`)
    if (saved) {
      const parsed = JSON.parse(saved).filter((i: any) => i.published)
      const ann = parsed.filter((i: any) => i.type !== 'News').sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime())[0]
      const news = parsed.filter((i: any) => i.type === 'News').sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime())[0]
      setLatestAnn(ann)
      setLatestNews(news)
    }
  }

  React.useEffect(() => {
    const updateLang = () => {
      const savedLang = (localStorage.getItem("app_lang") || "en") as "en" | "rw" | "fr"
      setLang(savedLang)
    }
    updateLang()
    loadLatest()
    window.addEventListener("lang-change", updateLang)
    window.addEventListener("year-changed", loadLatest)
    window.addEventListener("storage", loadLatest)
    return () => {
      window.removeEventListener("lang-change", updateLang)
      window.removeEventListener("year-changed", loadLatest)
      window.removeEventListener("storage", loadLatest)
    }
  }, [])

  const t = translations[lang]

  return (
    <div className="container py-12 space-y-12">
      <div className="max-w-2xl">
        <h1 className="text-4xl font-bold tracking-tight mb-4">{t.title}</h1>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <Link href="/news" className="group relative block p-8 rounded-3xl border bg-card hover:border-primary transition-all overflow-hidden">
          <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
            <Newspaper className="w-24 h-24" />
          </div>
          <div className="relative space-y-4">
            <div className="p-3 bg-emerald-100 text-emerald-700 w-fit rounded-2xl">
              <Newspaper className="w-6 h-6" />
            </div>
            <h2 className="text-3xl font-bold">{t.newsTitle}</h2>
            <p className="text-muted-foreground text-lg">{t.newsDesc}</p>
            {latestNews && (
              <div className="mt-4 p-4 bg-emerald-50 rounded-xl border border-emerald-100">
                <p className="text-xs font-bold text-emerald-700 uppercase mb-1">Latest News</p>
                <p className="font-semibold line-clamp-1">{latestNews.title}</p>
                <p className="text-xs text-muted-foreground">{latestNews.date}</p>
              </div>
            )}
            <div className="flex items-center gap-2 text-primary font-bold pt-4">
              {t.viewAll} <ArrowRight className="w-5 h-5" />
            </div>
          </div>
        </Link>

        <Link href="/announcements" className="group relative block p-8 rounded-3xl border bg-card hover:border-primary transition-all overflow-hidden">
          <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
            <Bell className="w-24 h-24" />
          </div>
          <div className="relative space-y-4">
            <div className="p-3 bg-blue-100 text-blue-700 w-fit rounded-2xl">
              <Bell className="w-6 h-6" />
            </div>
            <h2 className="text-3xl font-bold">{t.annTitle}</h2>
            <p className="text-muted-foreground text-lg">{t.annDesc}</p>
            {latestAnn && (
              <div className="mt-4 p-4 bg-blue-50 rounded-xl border border-blue-100">
                <p className="text-xs font-bold text-blue-700 uppercase mb-1">Latest Announcement</p>
                <p className="font-semibold line-clamp-1">{latestAnn.title}</p>
                <p className="text-xs text-muted-foreground">{latestAnn.date}</p>
              </div>
            )}
            <div className="flex items-center gap-2 text-primary font-bold pt-4">
              {t.viewAll} <ArrowRight className="w-5 h-5" />
            </div>
          </div>
        </Link>
      </div>
    </div>
  )
}
