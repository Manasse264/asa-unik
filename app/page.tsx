"use client"

import * as React from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import {
  Calendar,
  Clock,
  MapPin,
  Play,
  Users,
  BookOpen,
  HeartHandshake,
  Music,
  ArrowRight,
  Sparkles,
  ChevronRight,
  Compass
} from "lucide-react"

const translations = {
  en: {
    welcomeSub: "WELCOME TO",
    churchName: "ASA UNIK-RP NGOMA",
    sdaSub: "A Seventh-day Adventist Church",
    mottoTitle: "A Place to Worship. A Place to Belong. A Place to Grow.",
    mottoDesc: "Together in Christ, we seek to know God, grow in faith, and serve our community.",
    joinSabbath: "Join Us This Sabbath",
    watchOnline: "Watch Online",
    heroQuote: "“For where two or three gather in my name, there am I with them.”",
    heroVerse: "Matthew 18:20",

    worshipHeader: "WORSHIP WITH US",
    worshipSub: "Come and experience God's love with us this Sabbath and throughout the week.",
    sabbathWorship: "Sabbath Worship",
    sabbathTime: "9:00 AM – 12:00 PM",
    bibleStudy: "Bible Study",
    bibleStudyTime: "Wednesday • 5:00 PM",
    prayerMeeting: "Prayer Meeting",
    prayerTime: "Friday • 5:00 PM",
    ourLocation: "Our Location",
    locationDesc: "RP Ngoma, Rwanda",

    aboutBadge: "ABOUT OUR CHURCH",
    aboutTitle: "You Are Welcome Here",
    aboutDesc: "We are a family of believers, united by Christ's love, seeking to know God, grow in faith, serve others, and share hope with our community. Whether you are visiting for the first time or looking for a church family, there is a place for you here.",
    learnAboutUs: "Learn About Us",

    verseBadge: "BIBLE VERSE OF THE WEEK",
    verseText: "“Come to me, all you who are weary and burdened, and I will give you rest.”",
    verseRef: "Matthew 11:28",

    sermonBadge: "LATEST SERMON",
    sermonTitle: "Walking by Faith",
    sermonSpeaker: "Speaker: Pastor Jean Bosco Niyongabo",
    sermonDate: "September 7, 2026",
    watchSermon: "Watch Sermon",

    ministriesBadge: "OUR MINISTRIES",
    youthMin: "Youth Ministry",
    childrenMin: "Children's Ministry",
    womenMin: "Women's Ministry",
    menMin: "Men's Ministry",
    choirMin: "Choir & Music",
    bibleMin: "Bible Study",
    prayerMin: "Prayer Ministry",
    outreachMin: "Community Outreach",

    eventsBadge: "UPCOMING EVENTS",
    viewAllUpdates: "View All Updates",

    galleryBadge: "CHURCH GALLERY",
    viewGallery: "View Gallery"
  },
  rw: {
    welcomeSub: "MURA KAZA NEZA KURI",
    churchName: "ASA UNIK-RP NGOMA",
    sdaSub: "Itorero ry'Abadiventisti b'Umunsi wa Karindwi",
    mottoTitle: "Aho Gusengera. Aho Kuba Umuryango. Aho Gukurira.",
    mottoDesc: "Turi hamwe muli Kristo, tushaka kumenya Imana, gukura mu kwizera, no gukorera umuryango wacu.",
    joinSabbath: "Sangana Nayo Isabato",
    watchOnline: "Kurikirana Online",
    heroQuote: "“Kuko aho babiri cyangwa batatu bateraniye mu izina ryanjye, mba ndi hagati yabo.”",
    heroVerse: "Matayo 18:20",

    worshipHeader: "SENGANA NASI",
    worshipSub: "Naza wishimire urukundo rw'Imana hamwe natwe kuri iyi Sabato no mu cyumweru cyose.",
    sabbathWorship: "Gusenga Kuri Isabato",
    sabbathTime: "9:00 AM – 12:00 PM",
    bibleStudy: "Kwiga Bibiliya",
    bibleStudyTime: "Ku Wagatatu • 5:00 PM",
    prayerMeeting: "Gusenga",
    prayerTime: "Ku Wagatanu • 5:00 PM",
    ourLocation: "Aho Turi",
    locationDesc: "RP Ngoma, Rwanda",

    aboutBadge: "IBYEREKEYE ITORERO WACU",
    aboutTitle: "Murakaza Neza Hano",
    aboutDesc: "Turi umuryango w'abizera, bunze ubumwe mu rukundo rwa Kristo, bashaka kumenya Imana, gukura mu kwizera, gukorera abandi, no gusangira icyizere n'umuryango wacu.",
    learnAboutUs: "Mumenye Byinshi",

    verseBadge: "ICYO BIBLE YIGISHA MU CYUMWERU",
    verseText: "“Nimuze gukorera aho muri hose mwese abafite umutwaro uremerewe, nanjye nzabaruhura.”",
    verseRef: "Matayo 11:28",

    sermonBadge: "INYIGISHO Y'IBIHUZO",
    sermonTitle: "Kugenda Mu Kwizera",
    sermonSpeaker: "Umwigisha: Pastor Jean Bosco Niyongabo",
    sermonDate: "7 Nzeri 2026",
    watchSermon: "Reba Inyigisho",

    ministriesBadge: "MINISITIRI ZACU",
    youthMin: "Urubyiruko",
    childrenMin: "Abana",
    womenMin: "Abagore",
    menMin: "Abagabo",
    choirMin: "Korali no Kuririmba",
    bibleMin: "Kwiga Bibiliya",
    prayerMin: "Isengesho",
    outreachMin: "Gukorera Umuryango",

    eventsBadge: "IBYAKORWA BIRI IMBERE",
    viewAllUpdates: "Reba Amakuru Yose",

    galleryBadge: "AMAFOTO Y'ITORERO",
    viewGallery: "Reba Amafoto"
  },
  fr: {
    welcomeSub: "BIENVENUE À",
    churchName: "ASA UNIK-RP NGOMA",
    sdaSub: "Église Adventiste du Septième Jour",
    mottoTitle: "Un lieu pour adorer. Un lieu pour appartenir. Un lieu pour grandir.",
    mottoDesc: "Ensemble en Christ, nous cherchons à connaître Dieu, à grandir dans la foi et à servir notre communauté.",
    joinSabbath: "Rejoignez-nous ce Sabbat",
    watchOnline: "Regarder en direct",
    heroQuote: "« Car là où deux ou trois sont assemblés en mon nom, je suis au milieu d'eux. »",
    heroVerse: "Matthieu 18:20",

    worshipHeader: "ADOREZ AVEC NOUS",
    worshipSub: "Venez expérimenter l'amour de Dieu avec nous ce sabbat et tout au long de la semaine.",
    sabbathWorship: "Culte du Sabbat",
    sabbathTime: "9:00 AM – 12:00 PM",
    bibleStudy: "Étude Biblique",
    bibleStudyTime: "Mercredi • 5:00 PM",
    prayerMeeting: "Réunion de Prière",
    prayerTime: "Vendredi • 5:00 PM",
    ourLocation: "Notre Emplacement",
    locationDesc: "RP Ngoma, Rwanda",

    aboutBadge: "À PROPOS DE NOTRE ÉGLISE",
    aboutTitle: "Vous Êtes les Bienvenus Ici",
    aboutDesc: "Nous sommes une famille de croyants, unis par l'amour du Christ, cherchant à connaître Dieu, à grandir dans la foi, à servir les autres et à partager l'espoir avec notre communauté.",
    learnAboutUs: "En Savoir Plus",

    verseBadge: "VERSET BIBLIQUE DE LA SEMAINE",
    verseText: "« Venez à moi, vous tous qui êtes fatigués et chargés, et je vous donnerai du repos. »",
    verseRef: "Matthieu 11:28",

    sermonBadge: "DERNIER SERMON",
    sermonTitle: "Marcher par la Foi",
    sermonSpeaker: "Prédicateur: Pasteur Jean Bosco Niyongabo",
    sermonDate: "7 Septembre 2026",
    watchSermon: "Regarder le Sermon",

    ministriesBadge: "NOS MINISTÈRES",
    youthMin: "Ministère des Jeunes",
    childrenMin: "Ministère des Enfants",
    womenMin: "Ministère des Femmes",
    menMin: "Ministère des Hommes",
    choirMin: "Chœur & Musique",
    bibleMin: "Étude Biblique",
    prayerMin: "Ministère de Prière",
    outreachMin: "Action Communautaire",

    eventsBadge: "ÉVÉNEMENTS À VENIR",
    viewAllUpdates: "Voir Toutes les Mises à Jour",

    galleryBadge: "GALERIE DE L'ÉGLISE",
    viewGallery: "Voir la Galerie"
  }
}

const upcomingEvents = [
  {
    id: 1,
    day: "13",
    month: "SEP",
    title: "Prayer Night",
    time: "5:00 PM – 7:00 PM",
    location: "Church Hall"
  },
  {
    id: 2,
    day: "17",
    month: "SEP",
    title: "Youth Fellowship",
    time: "5:00 PM – 7:00 PM",
    location: "Church Hall"
  },
  {
    id: 3,
    day: "20",
    month: "SEP",
    title: "Community Outreach",
    time: "8:00 AM – 12:00 PM",
    location: "Ngoma Community"
  },
  {
    id: 4,
    day: "27",
    month: "SEP",
    title: "Family Worship",
    time: "9:00 AM – 12:00 PM",
    location: "Main Sanctuary"
  }
]

export default function Page() {
  const [lang, setLang] = React.useState<"en" | "rw" | "fr">("en")

  React.useEffect(() => {
    const updateLang = () => {
      const savedLang = (localStorage.getItem("app_lang") || "en") as "en" | "rw" | "fr"
      setLang(savedLang)
    }
    updateLang()

    window.addEventListener("lang-change", updateLang)
    return () => window.removeEventListener("lang-change", updateLang)
  }, [])

  const t = translations[lang]

  const ministryList = [
    { name: t.youthMin, icon: Users, color: "bg-blue-500 text-white" },
    { name: t.childrenMin, icon: HeartHandshake, color: "bg-emerald-500 text-white" },
    { name: t.womenMin, icon: Sparkles, color: "bg-pink-500 text-white" },
    { name: t.menMin, icon: Compass, color: "bg-amber-500 text-white" },
    { name: t.choirMin, icon: Music, color: "bg-purple-500 text-white" },
    { name: t.bibleMin, icon: BookOpen, color: "bg-cyan-500 text-white" },
    { name: t.prayerMin, icon: HeartHandshake, color: "bg-red-500 text-white" },
    { name: t.outreachMin, icon: Users, color: "bg-teal-500 text-white" },
  ]

  return (
    <main className="flex-1 w-full bg-slate-50 overflow-x-hidden">
      
      {/* 1. HERO SECTION */}
      <section className="relative w-full min-h-[580px] lg:min-h-[640px] flex items-center justify-center overflow-hidden bg-slate-900 py-16">
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center opacity-40 scale-105 transition-transform duration-1000"
          style={{ backgroundImage: "url('/photo1.jpg')" }}
        />
        <div className="absolute inset-0 z-10 bg-gradient-to-r from-slate-950/80 via-slate-900/60 to-transparent" />

        <div className="container relative z-20 px-4 md:px-8 grid lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-8 space-y-6 text-left">
            <div className="inline-block px-3 py-1 bg-white/10 backdrop-blur-md rounded-md border border-white/20 text-xs font-bold tracking-widest text-white uppercase">
              {t.welcomeSub}
            </div>
            
            <div className="space-y-2">
              <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight leading-none">
                {t.churchName}
              </h1>
              <p className="text-xl md:text-2xl font-semibold text-blue-200">
                {t.sdaSub}
              </p>
            </div>

            <div className="space-y-2 max-w-2xl">
              <h2 className="text-2xl md:text-3xl font-extrabold text-amber-300 italic">
                {t.mottoTitle}
              </h2>
              <p className="text-base md:text-lg text-slate-200 leading-relaxed font-medium">
                {t.mottoDesc}
              </p>
            </div>

            <div className="flex flex-wrap gap-4 pt-2">
              <Button asChild size="lg" className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-full px-6 shadow-lg border-none">
                <Link href="/events" className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  {t.joinSabbath}
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild className="border-2 border-white/80 bg-white/10 hover:bg-white/20 text-white font-bold rounded-full px-6 backdrop-blur-sm">
                <Link href="/sermons" className="flex items-center gap-2">
                  <Play className="w-5 h-5 fill-current" />
                  {t.watchOnline}
                </Link>
              </Button>
            </div>
          </div>

          <div className="lg:col-span-4 hidden lg:block">
            <div className="p-6 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-white space-y-4 shadow-2xl">
              <p className="text-lg italic font-serif leading-relaxed text-slate-100">
                {t.heroQuote}
              </p>
              <p className="text-sm font-bold text-amber-300 text-right">
                — {t.heroVerse}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 2. WORSHIP WITH US SECTION */}
      <section className="w-full bg-white border-b border-slate-200 shadow-sm py-8">
        <div className="container px-4 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6 items-center">
            
            <div className="md:col-span-1 flex items-center gap-4 pr-4 border-b md:border-b-0 md:border-r border-slate-200 pb-4 md:pb-0">
              <div className="p-3 bg-blue-50 text-blue-900 rounded-xl">
                <Calendar className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">{t.worshipHeader}</h3>
                <p className="text-xs text-slate-500 leading-snug mt-0.5">{t.worshipSub}</p>
              </div>
            </div>

            <div className="md:col-span-4 grid grid-cols-2 lg:grid-cols-4 gap-4 text-center">
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-100 flex flex-col items-center justify-center">
                <Calendar className="w-5 h-5 text-blue-600 mb-1" />
                <span className="text-xs font-bold text-slate-900">{t.sabbathWorship}</span>
                <span className="text-[11px] font-medium text-slate-600 mt-0.5">{t.sabbathTime}</span>
              </div>

              <div className="p-3 rounded-lg bg-slate-50 border border-slate-100 flex flex-col items-center justify-center">
                <BookOpen className="w-5 h-5 text-blue-600 mb-1" />
                <span className="text-xs font-bold text-slate-900">{t.bibleStudy}</span>
                <span className="text-[11px] font-medium text-slate-600 mt-0.5">{t.bibleStudyTime}</span>
              </div>

              <div className="p-3 rounded-lg bg-slate-50 border border-slate-100 flex flex-col items-center justify-center">
                <HeartHandshake className="w-5 h-5 text-blue-600 mb-1" />
                <span className="text-xs font-bold text-slate-900">{t.prayerMeeting}</span>
                <span className="text-[11px] font-medium text-slate-600 mt-0.5">{t.prayerTime}</span>
              </div>

              <div className="p-3 rounded-lg bg-slate-50 border border-slate-100 flex flex-col items-center justify-center">
                <MapPin className="w-5 h-5 text-blue-600 mb-1" />
                <span className="text-xs font-bold text-slate-900">{t.ourLocation}</span>
                <span className="text-[11px] font-medium text-slate-600 mt-0.5">{t.locationDesc}</span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 3. WELCOME & BIBLE VERSE SECTION */}
      <section className="w-full py-16 bg-slate-50">
        <div className="container px-4 md:px-8">
          <div className="grid lg:grid-cols-12 gap-8 items-stretch">
            
            {/* Left: About Church Card */}
            <div className="lg:col-span-7 bg-white rounded-2xl p-6 md:p-8 border border-slate-200 shadow-sm flex flex-col md:flex-row gap-6 items-center">
              <div className="relative w-full md:w-1/2 h-56 md:h-full min-h-[220px] rounded-xl overflow-hidden shrink-0">
                <Image 
                  src="/photo2.jpg" 
                  alt="Church Building" 
                  fill 
                  className="object-cover"
                />
              </div>
              <div className="space-y-4 flex-1">
                <span className="text-xs font-extrabold tracking-widest text-blue-800 uppercase">
                  {t.aboutBadge}
                </span>
                <h2 className="text-2xl md:text-3xl font-black text-slate-900 leading-tight">
                  {t.aboutTitle}
                </h2>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {t.aboutDesc}
                </p>
                <Button asChild size="sm" className="bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-full px-5">
                  <Link href="/about" className="flex items-center gap-1.5">
                    {t.learnAboutUs}
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </Button>
              </div>
            </div>

            {/* Right: Bible Verse Card */}
            <div className="lg:col-span-5 bg-gradient-to-br from-blue-900 to-slate-900 rounded-2xl p-6 md:p-8 text-white flex flex-col justify-between relative overflow-hidden shadow-md">
              <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                <BookOpen className="w-40 h-40" />
              </div>
              <div className="space-y-4 relative z-10">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-amber-400" />
                  <span className="text-xs font-extrabold tracking-widest text-amber-400 uppercase">
                    {t.verseBadge}
                  </span>
                </div>
                <p className="text-lg md:text-xl font-serif italic text-slate-100 leading-relaxed pt-2">
                  {t.verseText}
                </p>
              </div>
              <div className="pt-6 relative z-10 text-right">
                <span className="text-sm font-bold text-amber-300">
                  — {t.verseRef}
                </span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 4. LATEST SERMON & MINISTRIES SECTION */}
      <section className="w-full py-16 bg-white border-y border-slate-200">
        <div className="container px-4 md:px-8">
          <div className="grid lg:grid-cols-12 gap-8">
            
            {/* Latest Sermon Card */}
            <div className="lg:col-span-5 bg-slate-900 rounded-2xl overflow-hidden shadow-lg border border-slate-800 text-white flex flex-col">
              <div className="relative w-full h-48 bg-slate-800">
                <Image 
                  src="/photo3.jpg" 
                  alt="Sermon Thumbnail" 
                  fill 
                  className="object-cover opacity-80"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white border border-white/40 cursor-pointer hover:scale-110 transition-transform">
                    <Play className="w-6 h-6 fill-current ml-0.5" />
                  </div>
                </div>
              </div>

              <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                <div>
                  <span className="text-[11px] font-extrabold tracking-widest text-amber-400 uppercase">
                    {t.sermonBadge}
                  </span>
                  <h3 className="text-2xl font-bold text-white mt-1">
                    {t.sermonTitle}
                  </h3>
                  <p className="text-xs font-medium text-slate-300 mt-2">
                    {t.sermonSpeaker}
                  </p>
                  <p className="text-xs font-medium text-slate-400 mt-0.5">
                    {t.sermonDate}
                  </p>
                </div>

                <Button asChild className="w-full bg-white hover:bg-slate-100 text-slate-950 font-bold rounded-lg mt-4">
                  <Link href="/sermons" className="flex items-center justify-center gap-2">
                    <Play className="w-4 h-4 fill-current" />
                    {t.watchSermon}
                  </Link>
                </Button>
              </div>
            </div>

            {/* Ministries Grid */}
            <div className="lg:col-span-7 space-y-6">
              <div>
                <span className="text-xs font-extrabold tracking-widest text-blue-800 uppercase">
                  {t.ministriesBadge}
                </span>
                <h2 className="text-2xl md:text-3xl font-black text-slate-900 mt-1">
                  Connect & Serve
                </h2>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {ministryList.map((m, idx) => {
                  const Icon = m.icon
                  return (
                    <Link key={idx} href="/ministries" className="group p-4 bg-slate-50 hover:bg-blue-50 border border-slate-200/80 hover:border-blue-200 rounded-xl transition-all text-center flex flex-col items-center justify-center">
                      <div className={cn("p-3 rounded-full mb-2 transition-transform group-hover:scale-110", m.color)}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="text-xs font-bold text-slate-800 group-hover:text-blue-900">
                        {m.name}
                      </span>
                    </Link>
                  )
                })}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 5. UPCOMING EVENTS & GALLERY PREVIEW */}
      <section className="w-full py-16 bg-slate-50">
        <div className="container px-4 md:px-8 space-y-12">
          
          {/* Upcoming Events */}
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
              <div>
                <span className="text-xs font-extrabold tracking-widest text-blue-800 uppercase">
                  {t.eventsBadge}
                </span>
                <h2 className="text-2xl md:text-3xl font-black text-slate-900 mt-1">
                  Upcoming Events
                </h2>
              </div>
              <Button variant="ghost" asChild className="text-blue-900 hover:text-blue-700 font-bold self-start sm:self-auto p-0">
                <Link href="/events" className="flex items-center gap-1">
                  {t.viewAllUpdates}
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {upcomingEvents.map((ev) => (
                <div key={ev.id} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-start gap-4">
                  <div className="bg-blue-50 border border-blue-100 rounded-lg p-2.5 text-center shrink-0 min-w-[56px]">
                    <span className="block text-lg font-black text-blue-900 leading-none">{ev.day}</span>
                    <span className="block text-[10px] font-bold text-blue-600 tracking-wider uppercase mt-1">{ev.month}</span>
                  </div>
                  <div className="space-y-1 min-w-0">
                    <h4 className="text-sm font-bold text-slate-900 truncate">{ev.title}</h4>
                    <p className="text-xs text-slate-500 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {ev.time}
                    </p>
                    <p className="text-xs text-slate-500 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5" />
                      {ev.location}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Church Gallery Preview */}
          <div className="space-y-6 pt-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
              <div>
                <span className="text-xs font-extrabold tracking-widest text-blue-800 uppercase">
                  {t.galleryBadge}
                </span>
                <h2 className="text-2xl md:text-3xl font-black text-slate-900 mt-1">
                  Recent Moments
                </h2>
              </div>
              <Button variant="ghost" asChild className="text-blue-900 hover:text-blue-700 font-bold self-start sm:self-auto p-0">
                <Link href="/gallery" className="flex items-center gap-1">
                  {t.viewGallery}
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </Button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
              {["/photo1.jpg", "/photo2.jpg", "/photo3.jpg", "/photo4.jpg", "/photo1.jpg"].map((src, i) => (
                <div key={i} className="relative h-36 rounded-xl overflow-hidden group shadow-sm">
                  <Image 
                    src={src} 
                    alt={`Gallery photo ${i + 1}`} 
                    fill 
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-slate-950/20 group-hover:bg-slate-950/0 transition-colors" />
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

    </main>
  )
}