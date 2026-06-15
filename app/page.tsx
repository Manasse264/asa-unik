"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { cn } from "@/lib/utils"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"

const translations = {
  en: {
    marqueeText: "Welcome to ASA RP Ngoma College",
    welcome: "ASA RP Ngoma College",
    description: "The platform for everything you need. Empowering students and the community.",
    getStarted: "Get Started",
    learnMore: "Learn More",
    eduTitle: "Spiritual Growth",
    eduDesc: "Strengthening faith through Bible study, prayer, and Christian fellowship.",
    comTitle: "Unity in Christ",
    comDesc: "Encouraging spiritual growth, friendship, and service among students.",
    secTitle: "Security",
    secDesc: "Your data is safe and secure with us.",
    updatesSectionTitle: "Latest Updates",
    newsTitle: "News",
    newsDesc: "Stay informed with the latest happenings at ASA RP Ngoma.",
    annTitle: "Announcements",
    annDesc: "Important notices and announcements for the community.",
    latestAnnouncements: "Latest Announcements"
  },
  fr: {
    marqueeText: "Bienvenue à l'ASA RP Ngoma College",
    welcome: "ASA RP Ngoma College",
    description: "La plateforme pour tout ce dont vous avez besoin. Autonomiser les étudiants et la communauté.",
    getStarted: "Commencer",
    learnMore: "En savoir plus",
    eduTitle: "Croissance Spirituelle",
    eduDesc: "Renforcer la foi par l'étude de la Bible, la prière et la fraternité chrétienne.",
    comTitle: "Unité en Christ",
    comDesc: "Encourager la croissance spirituelle, l'amitié et le service parmi les étudiants.",
    secTitle: "Sécurité",
    secDesc: "Vos données sont en sécurité avec nous.",
    updatesSectionTitle: "Dernières Mises à jour",
    newsTitle: "Nouvelles",
    newsDesc: "Restez informé des derniers événements à l'ASA RP Ngoma.",
    annTitle: "Annonces",
    annDesc: "Avis et annonces importants pour la communauté.",
    latestAnnouncements: "Dernières annonces"
  }
}

export default function Page() {
  const [lang, setLang] = React.useState<"en" | "rw" | "fr">("en")
  const [announcements, setAnnouncements] = React.useState<any[]>([])

  const loadAnnouncements = () => {
    const saved = localStorage.getItem("church_announcements")
    if (saved) {
      const parsed = JSON.parse(saved)
      // Only show published ones
      setAnnouncements(parsed.filter((a: any) => a.published))
    }
  }

  React.useEffect(() => {
    const updateLang = () => {
      const savedLang = (localStorage.getItem("app_lang") || "en") as "en" | "rw" | "fr"
      setLang(savedLang)
    }

    updateLang()
    loadAnnouncements()

    window.addEventListener("lang-change", updateLang)
    window.addEventListener("announcements-updated", loadAnnouncements)
    window.addEventListener("storage", loadAnnouncements)

    return () => {
      window.removeEventListener("lang-change", updateLang)
      window.removeEventListener("announcements-updated", loadAnnouncements)
      window.removeEventListener("storage", loadAnnouncements)
    }
  }, [])

  const t = translations[lang === "rw" ? "en" : lang]

  return (
    <main className="relative flex-1 min-h-[calc(100vh-64px)] overflow-hidden">
      {/* Global Background Images with Zoom and Fade Animation */}
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
      {/* Overlay to ensure text readability */}
      <div className="absolute inset-0 z-10 bg-black/60" />

      {/* Page Content */}
      <div className="relative z-20 flex flex-col min-h-full">
        <div className="w-full bg-white/10 backdrop-blur-sm border-b border-white/20 overflow-hidden py-3">
          <h1 className="animate-marquee whitespace-nowrap text-lg font-bold tracking-tight text-white inline-block">
            {t.marqueeText}
          </h1>
        </div>
        
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2 w-full">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none text-white">
                  {t.welcome}
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-200 md:text-xl">
                  {t.description}
                </p>
              </div>
              <div className="space-x-4">
                <Button asChild size="lg">
                  <Link href="/register">{t.getStarted}</Link>
                </Button>
                <Button variant="outline" size="lg" asChild className="text-white border-white hover:bg-white/20">
                  <Link href="/about">{t.learnMore}</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
        
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
              <div className="flex flex-col items-center space-y-4 text-center">
                <div className="rounded-full bg-primary p-4 text-primary-foreground">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" /><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" /></svg>
                </div>
                <h3 className="text-xl font-bold text-white">{t.eduTitle}</h3>
                <p className="text-gray-200">{t.eduDesc}</p>
              </div>
              <div className="flex flex-col items-center space-y-4 text-center">
                <div className="rounded-full bg-primary p-4 text-primary-foreground">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
                </div>
                <h3 className="text-xl font-bold text-white">{t.comTitle}</h3>
                <p className="text-gray-200">{t.comDesc}</p>
              </div>
              <div className="flex flex-col items-center space-y-4 text-center">
                <div className="rounded-full bg-primary p-4 text-primary-foreground">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" /></svg>
                </div>
                <h3 className="text-xl font-bold text-white">{t.secTitle}</h3>
                <p className="text-gray-200">{t.secDesc}</p>
              </div>
            </div>
          </div>
        </section>

        {announcements.length > 0 && (
          <section className="w-full py-12 md:py-24 bg-white/5 backdrop-blur-sm border-t border-white/10">
            <div className="container px-4 md:px-6">
              <div className="flex flex-col items-center justify-center space-y-4 text-center mb-10">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl text-white">{t.updatesSectionTitle}</h2>
                <div className="h-1 w-20 bg-primary rounded-full" />
              </div>

              <Tabs defaultValue="announcements" className="w-full">
                <div className="flex justify-center mb-8">
                  <TabsList className="bg-white/10 border border-white/20">
                    <TabsTrigger value="announcements" className="data-[state=active]:bg-primary text-white">
                      {t.annTitle}
                    </TabsTrigger>
                    <TabsTrigger value="news" className="data-[state=active]:bg-primary text-white">
                      {t.newsTitle}
                    </TabsTrigger>
                  </TabsList>
                </div>

                <TabsContent value="announcements">
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {announcements.filter(a => a.type === "Announcement" || a.type === "Event").length > 0 ? (
                      announcements.filter(a => a.type === "Announcement" || a.type === "Event").map((a) => (
                        <div key={a.id} className="group relative overflow-hidden rounded-xl border border-white/20 bg-white/5 p-6 hover:bg-white/10 transition-all">
                          <div className="flex items-center justify-between mb-4">
                            <span className={cn(
                              "px-2 py-1 rounded text-[10px] font-bold uppercase",
                              a.type === "Event" ? "bg-purple-500/20 text-purple-300 border border-purple-500/30" : "bg-blue-500/20 text-blue-300 border border-blue-500/30"
                            )}>
                              {a.type}
                            </span>
                            <span className="text-xs text-gray-400">{a.date}</span>
                          </div>
                          <h3 className="text-xl font-bold text-white mb-2 group-hover:text-primary transition-colors">{a.title}</h3>
                          <p className="text-gray-300 text-sm line-clamp-3 mb-4">{a.content}</p>
                          {a.fileName && (
                            <div className="flex items-center gap-2 text-xs text-primary bg-primary/10 w-fit px-2 py-1 rounded">
                              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
                              {a.fileName}
                            </div>
                          )}
                        </div>
                      ))
                    ) : (
                      <div className="col-span-full py-10 text-center text-gray-400">
                        No announcements yet.
                      </div>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="news">
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {announcements.filter(a => a.type === "News").map((a) => (
                      <div key={a.id} className="group relative overflow-hidden rounded-xl border border-white/20 bg-white/5 p-6 hover:bg-white/10 transition-all">
                        <div className="flex items-center justify-between mb-4">
                          <span className="px-2 py-1 rounded text-[10px] font-bold uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                            {a.type}
                          </span>
                          <span className="text-xs text-gray-400">{a.date}</span>
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-primary transition-colors">{a.title}</h3>
                        <p className="text-gray-300 text-sm line-clamp-3 mb-4">{a.content}</p>
                        {a.fileName && (
                          <div className="flex items-center gap-2 text-xs text-primary bg-primary/10 w-fit px-2 py-1 rounded">
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
                            {a.fileName}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </section>
        )}
      </div>
    </main>
  )
}
