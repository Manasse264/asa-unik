"use client"

import * as React from "react"
import { Newspaper, Calendar as CalendarIcon, Download } from "lucide-react"
import { cn } from "@/lib/utils"

const translations = {
  en: { 
    title: "News",
    noNews: "No news published yet.",
    publishedOn: "Published on",
    download: "Download Attachment"
  },
  rw: { 
    title: "Amakuru",
    noNews: "Nta makuru aratangazwa.",
    publishedOn: "Byashyizweho kuwa",
    download: "Kuramo umugereka"
  },
  fr: { 
    title: "Nouvelles",
    noNews: "Aucune nouvelle publiée pour le moment.",
    publishedOn: "Publié le",
    download: "Télécharger la pièce jointe"
  }
}

export default function NewsPage() {
  const [lang, setLang] = React.useState<"en" | "rw" | "fr">("en")
  const [news, setNews] = React.useState<any[]>([])

  const loadNews = () => {
    const year = localStorage.getItem('selected_year') || new Date().getFullYear().toString()
    const saved = localStorage.getItem(`church_announcements_${year}`)
    if (saved) {
      const parsed = JSON.parse(saved)
      const filtered = parsed
        .filter((item: any) => item.published && item.type === "News")
        .sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime())
      setNews(filtered)
    } else {
      setNews([])
    }
  }

  React.useEffect(() => {
    const updateLang = () => {
      const savedLang = (localStorage.getItem("app_lang") || "en") as "en" | "rw" | "fr"
      setLang(savedLang)
    }
    updateLang()
    loadNews()

    window.addEventListener("lang-change", updateLang)
    window.addEventListener("announcements-updated", loadNews)
    window.addEventListener("storage", loadNews)
    window.addEventListener("year-changed", loadNews)

    return () => {
      window.removeEventListener("lang-change", updateLang)
      window.removeEventListener("announcements-updated", loadNews)
      window.removeEventListener("storage", loadNews)
      window.removeEventListener("year-changed", loadNews)
    }
  }, [])

  const t = translations[lang]

  const downloadFile = (item: any) => {
    if (!item.fileData) {
      alert("No file data found for this news item.")
      return
    }
    const link = document.createElement("a")
    link.href = item.fileData
    link.download = item.fileName
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="container py-12 space-y-10">
      <h1 className="text-4xl font-bold mb-6">{t.title}</h1>
      
      {news.length > 0 ? (
        <div className="grid gap-6">
          {news.map((item) => (
            <div 
              key={item.id} 
              className="group relative flex flex-col md:flex-row gap-6 p-6 rounded-2xl border bg-card hover:shadow-md transition-all border-primary/10"
            >
              <div className="flex-1 space-y-4">
                <div className="flex items-center gap-3">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-700">
                    {t.title}
                  </span>
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <CalendarIcon className="w-3 h-3" />
                    {t.publishedOn} {item.date}
                  </span>
                </div>
                
                <h2 className="text-2xl font-bold group-hover:text-primary transition-colors">
                  {item.title}
                </h2>
                
                <p className="text-muted-foreground leading-relaxed">
                  {item.content}
                </p>

                {item.fileName && (
                  <div className="pt-2">
                    <button 
                      onClick={() => downloadFile(item)}
                      className="flex items-center gap-2 text-sm font-semibold text-primary hover:underline bg-primary/5 px-4 py-2 rounded-lg"
                    >
                      <Download className="w-4 h-4" />
                      {t.download}: {item.fileName}
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 border-2 border-dashed rounded-3xl">
          <p className="text-muted-foreground">{t.noNews}</p>
        </div>
      )}
    </div>
  )
}
