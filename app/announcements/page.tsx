"use client"

import * as React from "react"
import { Bell, Calendar as CalendarIcon, Download } from "lucide-react"
import { cn } from "@/lib/utils"

const translations = {
  en: { 
    title: "Announcements",
    noAnnouncements: "No announcements published yet.",
    publishedOn: "Published on",
    download: "Download Attachment",
    announcement: "Announcement",
    event: "Event"
  },
  fr: { 
    title: "Annonces",
    noAnnouncements: "Aucune annonce publiée pour le moment.",
    publishedOn: "Publié le",
    download: "Télécharger la pièce jointe",
    announcement: "Annonce",
    event: "Événement"
  }
}

export default function AnnouncementsPage() {
  const [lang, setLang] = React.useState<"en" | "fr">("en")
  const [announcements, setAnnouncements] = React.useState<any[]>([])

  const loadAnnouncements = () => {
    const year = localStorage.getItem('selected_year') || new Date().getFullYear().toString()
    const saved = localStorage.getItem(`church_announcements_${year}`)
    if (saved) {
      const parsed = JSON.parse(saved)
      const filtered = parsed
        .filter((item: any) => item.published && (item.type === "Announcement" || item.type === "Event"))
        .sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime())
      setAnnouncements(filtered)
    } else {
      setAnnouncements([])
    }
  }

  React.useEffect(() => {
    const updateLang = () => {
      const savedLang = (localStorage.getItem("app_lang") || "en") as "en" | "fr"
      setLang(savedLang)
    }
    updateLang()
    loadAnnouncements()

    window.addEventListener("lang-change", updateLang)
    window.addEventListener("announcements-updated", loadAnnouncements)
    window.addEventListener("storage", loadAnnouncements)
    window.addEventListener("year-changed", loadAnnouncements)

    return () => {
      window.removeEventListener("lang-change", updateLang)
      window.removeEventListener("announcements-updated", loadAnnouncements)
      window.removeEventListener("storage", loadAnnouncements)
      window.removeEventListener("year-changed", loadAnnouncements)
    }
  }, [])

  const t = translations[lang]

  const downloadFile = (item: any) => {
    if (!item.fileData) {
      alert("No file data found for this announcement.")
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
      
      {announcements.length > 0 ? (
        <div className="grid gap-6">
          {announcements.map((item) => (
            <div 
              key={item.id} 
              className="group relative flex flex-col md:flex-row gap-6 p-6 rounded-2xl border bg-card hover:shadow-md transition-all border-primary/10"
            >
              <div className="flex-1 space-y-4">
                <div className="flex items-center gap-3">
                  <span className={cn(
                    "px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider",
                    item.type === "Event" ? "bg-purple-100 text-purple-700" : "bg-blue-100 text-blue-700"
                  )}>
                    {item.type === "Event" ? t.event : t.announcement}
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
          <p className="text-muted-foreground">{t.noAnnouncements}</p>
        </div>
      )}
    </div>
  )
}
