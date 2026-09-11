"use client"

import * as React from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  Search,
  Play,
  Volume2,
  Download,
  Calendar,
  User,
  BookOpen,
  Filter,
  Tag,
  X,
  Sparkles,
  Share2,
  Video
} from "lucide-react"

interface Sermon {
  id: string
  title: string
  speaker: string
  date: string
  category: string
  bibleReference: string
  description: string
  videoUrl: string
  audioUrl: string
  thumbnail: string
  featured?: boolean
}

const CATEGORIES = [
  "All",
  "Faith",
  "Prayer",
  "Family",
  "Youth",
  "Prophecy",
  "Christian Living",
  "Evangelism",
  "Sabbath"
]

const SERMONS_DATA: Sermon[] = [
  {
    id: "sermon-1",
    title: "Standing Firm in End-Time Faith",
    speaker: "Pastor John Doe",
    date: "September 5, 2026",
    category: "Prophecy",
    bibleReference: "Revelation 14:6-12",
    description: "An inspiring message examining how young believers can hold fast to God's truth amid modern secular challenges and prepare for Christ's return.",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    audioUrl: "/audio/sample-sermon1.mp3",
    thumbnail: "/photo1.jpg",
    featured: true
  },
  {
    id: "sermon-2",
    title: "The Power of Persistent Prayer",
    speaker: "Elder David Nkurunziza",
    date: "August 29, 2026",
    category: "Prayer",
    bibleReference: "Luke 18:1-8",
    description: "Discovering how consistent, faith-filled prayer transforms student life, brings inner peace, and unlocks heavenly wisdom.",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    audioUrl: "/audio/sample-sermon2.mp3",
    thumbnail: "/photo2.jpg"
  },
  {
    id: "sermon-3",
    title: "Walking in Divine Purpose as Youth",
    speaker: "Guest Evangelist Mark",
    date: "August 22, 2026",
    category: "Youth",
    bibleReference: "1 Timothy 4:12",
    description: "Encouraging young people to let no one despise their youth, but to set an example in speech, conduct, love, and purity.",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    audioUrl: "/audio/sample-sermon3.mp3",
    thumbnail: "/photo3.jpg"
  },
  {
    id: "sermon-4",
    title: "The Sabbath: A Sanctuary in Time",
    speaker: "Pastor John Doe",
    date: "August 15, 2026",
    category: "Sabbath",
    bibleReference: "Genesis 2:1-3, Isaiah 58:13-14",
    description: "Reframing the 7th-day Sabbath as a gift of rest, spiritual restoration, and holy delight in our busy academic lives.",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    audioUrl: "/audio/sample-sermon4.mp3",
    thumbnail: "/photo4.jpg"
  },
  {
    id: "sermon-5",
    title: "Building Strong Christian Families",
    speaker: "Elder Sarah Mukamana",
    date: "August 8, 2026",
    category: "Family",
    bibleReference: "Joshua 24:14-15",
    description: "Practical biblical principles for strengthening relationships, resolving conflict with love, and building homes centered on Christ.",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    audioUrl: "/audio/sample-sermon5.mp3",
    thumbnail: "/photo1.jpg"
  },
  {
    id: "sermon-6",
    title: "Living Out Faith on Campus",
    speaker: "Dr. Emmanuel Habimana",
    date: "August 1, 2026",
    category: "Christian Living",
    bibleReference: "Matthew 5:13-16",
    description: "How students can act as salt and light in classrooms, hostels, and local communities through academic integrity and service.",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    audioUrl: "/audio/sample-sermon6.mp3",
    thumbnail: "/photo2.jpg"
  }
]

export default function SermonsPage() {
  const [searchQuery, setSearchQuery] = React.useState("")
  const [selectedCategory, setSelectedCategory] = React.useState("All")
  const [activeMedia, setActiveMedia] = React.useState<{ sermon: Sermon; type: "video" | "audio" } | null>(null)

  const featuredSermon = SERMONS_DATA.find((s) => s.featured) || SERMONS_DATA[0]

  // Filter logic
  const filteredSermons = SERMONS_DATA.filter((sermon) => {
    const matchesSearch =
      sermon.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sermon.speaker.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sermon.bibleReference.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sermon.description.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesCategory =
      selectedCategory === "All" || sermon.category === selectedCategory

    return matchesSearch && matchesCategory
  })

  return (
    <main className="relative flex-1 min-h-[calc(100vh-64px)] overflow-hidden">
      {/* Background Images with Animations */}
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

      {/* Dark Overlay for Readability */}
      <div className="absolute inset-0 z-10 bg-slate-950/85 backdrop-blur-[2px]" />

      {/* Main Content Container */}
      <div className="relative z-20 container mx-auto px-4 py-12 md:py-20 text-white">
        <div className="max-w-6xl mx-auto space-y-12">

          {/* Intro Description */}
          <div className="text-center max-w-3xl mx-auto space-y-2">
            <p className="text-base md:text-xl text-slate-200 font-medium">
              Listen, watch, and download spiritual messages from ASA UNIK-RP NGOMA. Be transformed by God's Word wherever you are.
            </p>
          </div>

          {/* FEATURED SERMON HERO */}
          {featuredSermon && (
            <div className="p-6 md:p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md grid lg:grid-cols-12 gap-8 items-center shadow-2xl">
              {/* Thumbnail / Video Preview */}
              <div className="lg:col-span-7 relative group rounded-2xl overflow-hidden border border-white/15 h-64 md:h-80 w-full">
                <img
                  src={featuredSermon.thumbnail}
                  alt={featuredSermon.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent flex items-center justify-center">
                  <button
                    onClick={() => setActiveMedia({ sermon: featuredSermon, type: "video" })}
                    className="p-5 rounded-full bg-amber-500 text-slate-950 hover:scale-110 hover:bg-amber-400 transition-all shadow-xl flex items-center justify-center gap-2 group/btn"
                  >
                    <Play className="w-8 h-8 fill-slate-950 ml-1" />
                  </button>
                </div>
                <span className="absolute top-4 left-4 px-3 py-1 bg-amber-500 text-slate-950 rounded-full text-xs font-black tracking-widest uppercase shadow">
                  FEATURED MESSAGE
                </span>
              </div>

              {/* Text Meta */}
              <div className="lg:col-span-5 space-y-4">
                <div className="inline-flex items-center gap-2 text-xs font-semibold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-3 py-1 rounded-full">
                  <Tag className="w-3.5 h-3.5" />
                  {featuredSermon.category}
                </div>

                <h2 className="text-2xl md:text-3xl font-black text-white leading-tight">
                  {featuredSermon.title}
                </h2>

                <div className="space-y-1 text-xs md:text-sm text-slate-300">
                  <p className="flex items-center gap-2">
                    <User className="w-4 h-4 text-amber-400 shrink-0" />
                    <strong>Speaker:</strong> {featuredSermon.speaker}
                  </p>
                  <p className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-amber-400 shrink-0" />
                    <strong>Date:</strong> {featuredSermon.date}
                  </p>
                  <p className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-amber-400 shrink-0" />
                    <strong>Scripture:</strong> {featuredSermon.bibleReference}
                  </p>
                </div>

                <p className="text-sm text-slate-300 line-clamp-3 leading-relaxed">
                  {featuredSermon.description}
                </p>

                <div className="flex flex-wrap gap-3 pt-2">
                  <Button
                    onClick={() => setActiveMedia({ sermon: featuredSermon, type: "video" })}
                    className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold flex items-center gap-2 rounded-full"
                  >
                    <Play className="w-4 h-4 fill-slate-950" />
                    Watch Now
                  </Button>
                  <Button
                    onClick={() => setActiveMedia({ sermon: featuredSermon, type: "audio" })}
                    variant="outline"
                    className="border-white/20 text-white hover:bg-white/10 rounded-full flex items-center gap-2"
                  >
                    <Volume2 className="w-4 h-4 text-amber-400" />
                    Listen Audio
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* SEARCH & FILTER SECTION */}
          <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md space-y-6">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              {/* Search Box */}
              <div className="relative w-full md:w-96">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search by title, speaker, Bible book..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950/60 border border-white/10 text-white placeholder-slate-400 text-sm focus:outline-none focus:border-amber-400 transition-colors"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Total Count */}
              <p className="text-xs text-slate-400 font-medium">
                Showing <span className="text-amber-400 font-bold">{filteredSermons.length}</span> sermon{filteredSermons.length !== 1 ? "s" : ""}
              </p>
            </div>

            {/* Category Chips */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Filter className="w-3.5 h-3.5 text-amber-400" />
                Categories
              </span>
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                      selectedCategory === cat
                        ? "bg-amber-500 text-slate-950 shadow-md font-bold"
                        : "bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* SERMON LIBRARY GRID */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-amber-400 flex items-center gap-2">
              <Sparkles className="w-6 h-6" />
              Sermon Library
            </h2>

            {filteredSermons.length === 0 ? (
              <div className="p-12 text-center rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md space-y-3">
                <p className="text-lg text-slate-300">No sermons found matching your criteria.</p>
                <Button
                  onClick={() => {
                    setSearchQuery("")
                    setSelectedCategory("All")
                  }}
                  variant="outline"
                  className="border-white/20 text-white hover:bg-white/10"
                >
                  Clear Filters
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredSermons.map((sermon) => (
                  <div
                    key={sermon.id}
                    className="flex flex-col rounded-2xl bg-white/5 border border-white/10 overflow-hidden backdrop-blur-md hover:border-amber-400/50 transition-all duration-300 group shadow-lg"
                  >
                    {/* Card Thumbnail */}
                    <div className="relative h-44 w-full overflow-hidden">
                      <img
                        src={sermon.thumbnail}
                        alt={sermon.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
                      
                      <span className="absolute top-3 right-3 px-2.5 py-1 rounded-md bg-slate-950/80 text-amber-400 text-[10px] font-bold uppercase tracking-wider border border-white/10">
                        {sermon.category}
                      </span>

                      {/* Quick Play Overlay Button */}
                      <button
                        onClick={() => setActiveMedia({ sermon, type: "video" })}
                        className="absolute inset-0 flex items-center justify-center bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <div className="p-3 rounded-full bg-amber-500 text-slate-950 shadow-lg">
                          <Play className="w-6 h-6 fill-slate-950 ml-0.5" />
                        </div>
                      </button>
                    </div>

                    {/* Card Content */}
                    <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                      <div className="space-y-2">
                        <h3 className="text-lg font-bold text-white group-hover:text-amber-400 transition-colors leading-snug">
                          {sermon.title}
                        </h3>
                        <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                          {sermon.description}
                        </p>
                      </div>

                      {/* Meta Information */}
                      <div className="space-y-1.5 pt-2 border-t border-white/10 text-xs text-slate-300">
                        <div className="flex items-center gap-2">
                          <User className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                          <span>{sermon.speaker}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                          <span>{sermon.date}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <BookOpen className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                          <span className="text-amber-300 font-medium">{sermon.bibleReference}</span>
                        </div>
                      </div>

                      {/* Card Actions */}
                      <div className="grid grid-cols-3 gap-2 pt-2">
                        <Button
                          onClick={() => setActiveMedia({ sermon, type: "video" })}
                          size="sm"
                          className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs flex items-center justify-center gap-1"
                        >
                          <Video className="w-3.5 h-3.5" />
                          Watch
                        </Button>
                        <Button
                          onClick={() => setActiveMedia({ sermon, type: "audio" })}
                          size="sm"
                          variant="outline"
                          className="border-white/20 text-white hover:bg-white/10 text-xs flex items-center justify-center gap-1"
                        >
                          <Volume2 className="w-3.5 h-3.5 text-amber-400" />
                          Listen
                        </Button>
                        <a
                          href={sermon.audioUrl}
                          download
                          className="inline-flex items-center justify-center px-2 py-1.5 rounded-md border border-white/20 text-white hover:bg-white/10 text-xs font-medium transition-colors"
                          title="Download Audio"
                        >
                          <Download className="w-3.5 h-3.5 text-slate-300" />
                        </a>
                      </div>

                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>

      {/* MEDIA PLAYER MODAL (VIDEO / AUDIO) */}
      {activeMedia && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-3xl rounded-2xl bg-slate-900 border border-white/20 p-6 text-white space-y-6 shadow-2xl">
            
            {/* Close Button */}
            <button
              onClick={() => setActiveMedia(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Title */}
            <div className="space-y-1 pr-8">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-widest">
                {activeMedia.type === "video" ? "Video Sermon Player" : "Audio Sermon Player"}
              </span>
              <h3 className="text-xl font-black text-white">{activeMedia.sermon.title}</h3>
              <p className="text-xs text-slate-300">
                {activeMedia.sermon.speaker} • {activeMedia.sermon.date} • <span className="text-amber-300">{activeMedia.sermon.bibleReference}</span>
              </p>
            </div>

            {/* Player Element */}
            {activeMedia.type === "video" ? (
              <div className="aspect-video w-full rounded-xl overflow-hidden border border-white/10 bg-black">
                <iframe
                  src={activeMedia.sermon.videoUrl}
                  title={activeMedia.sermon.title}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            ) : (
              <div className="p-8 rounded-xl bg-slate-950 border border-white/10 space-y-6 text-center">
                <div className="w-20 h-20 mx-auto rounded-full bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
                  <Volume2 className="w-10 h-10" />
                </div>
                <div className="space-y-2">
                  <audio controls className="w-full max-w-md mx-auto">
                    <source src={activeMedia.sermon.audioUrl} type="audio/mpeg" />
                    Your browser does not support the audio element.
                  </audio>
                </div>
              </div>
            )}

            {/* Description & Download Action */}
            <div className="p-4 rounded-xl bg-white/5 border border-white/5 space-y-3">
              <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
                {activeMedia.sermon.description}
              </p>
              <div className="flex justify-between items-center pt-2 border-t border-white/10">
                <a
                  href={activeMedia.sermon.audioUrl}
                  download
                  className="inline-flex items-center gap-2 text-xs font-bold text-amber-400 hover:text-amber-300 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  Download Audio MP3
                </a>
                <Button
                  onClick={() => setActiveMedia(null)}
                  variant="outline"
                  size="sm"
                  className="border-white/20 text-white hover:bg-white/10 text-xs"
                >
                  Close Player
                </Button>
              </div>
            </div>

          </div>
        </div>
      )}
    </main>
  )
}