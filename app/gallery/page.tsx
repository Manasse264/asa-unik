"use client"

import * as React from "react"
import { Camera } from "lucide-react"
import { getStoredGallery } from "@/lib/website-gallery-storage"

const categories = ["Worship Services", "Sabbath School", "Youth", "Children", "Women's Ministry", "Men's Ministry", "Choir", "Baptism", "Evangelism", "Community Outreach", "Special Events"]
interface GalleryPhoto {
  id?: string
  src: string
  title: string
  date: string
  event: string
  caption: string
  type?: "photo" | "video"
}

const DEFAULT_PHOTOS: GalleryPhoto[] = [
  { src: "/photo1.jpg", title: "Sabbath Worship", date: "September 2026", event: "Worship Services", caption: "The church family gathered for worship and Bible teaching." },
  { src: "/photo2.jpg", title: "Bible Study", date: "September 2026", event: "Sabbath School", caption: "Members studying Scripture together in small groups." },
  { src: "/photo3.jpg", title: "Youth Program", date: "August 2026", event: "Youth", caption: "Young people serving and growing in Christ." },
  { src: "/photo4.jpg", title: "Choir Ministry", date: "August 2026", event: "Choir", caption: "Music ministry leading praise and worship." },
  { src: "/photo1.jpg", title: "Outreach Day", date: "July 2026", event: "Community Outreach", caption: "Serving the community with compassion and hope." },
  { src: "/photo2.jpg", title: "Special Program", date: "July 2026", event: "Special Events", caption: "A special church program for students and visitors." },
]

const getPublishedGallery = async (): Promise<GalleryPhoto[]> => {
  if (typeof window === "undefined") return DEFAULT_PHOTOS
  try {
    const parsed = await getStoredGallery()
    if (!parsed) return DEFAULT_PHOTOS

    return parsed.map((photo) => ({
      ...photo,
      event: photo.category ?? "Church Event",
      caption: photo.caption ?? "",
      src: photo.src ?? "/photo1.jpg",
      type: photo.type ?? "photo",
    }))
  } catch {
    return DEFAULT_PHOTOS
  }
}

export default function GalleryPage() {
  const [photos, setPhotos] = React.useState(DEFAULT_PHOTOS)

  React.useEffect(() => {
    const syncGallery = async () => setPhotos(await getPublishedGallery())
    syncGallery()
    window.addEventListener("website-content-updated", syncGallery)
    window.addEventListener("storage", syncGallery)
    window.addEventListener("year-changed", syncGallery)
    return () => {
      window.removeEventListener("website-content-updated", syncGallery)
      window.removeEventListener("storage", syncGallery)
      window.removeEventListener("year-changed", syncGallery)
    }
  }, [])

  return (
    <main className="bg-slate-50">
      <section className="container px-4 py-12 md:px-8">
        <div className="mb-8 max-w-3xl space-y-3">
          <p className="text-xs font-bold uppercase tracking-widest text-primary">Church Gallery</p>
          <h1 className="text-3xl font-black text-slate-900 sm:text-4xl">ASA UNIK-RP NGOMA</h1>
          <p className="text-sm leading-7 text-slate-600 sm:text-base">Photos and videos from worship services, Sabbath School, ministries, baptisms, evangelism, outreach, and special events.</p>
        </div>

        <div className="mb-8 flex gap-2 overflow-x-auto pb-2">
          {categories.map((category) => (
            <span key={category} className="shrink-0 rounded-full border bg-white px-3 py-1.5 text-xs font-semibold text-slate-700">{category}</span>
          ))}
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {photos.map((photo) => (
            <article key={photo.id ?? `${photo.title}-${photo.date}`} className="overflow-hidden rounded-lg border bg-white shadow-sm">
              <div className="relative aspect-[4/3]">
                {photo.type === "video" ? (
                  <video src={photo.src} controls className="h-full w-full object-cover" />
                ) : (
                  <img src={photo.src} alt={photo.title} className="h-full w-full object-cover" />
                )}
              </div>
              <div className="space-y-2 p-4">
                <div className="flex items-center justify-between gap-3">
                  <h2 className="font-black text-slate-900">{photo.title}</h2>
                  <Camera className="h-4 w-4 shrink-0 text-primary" />
                </div>
                <p className="text-xs font-bold uppercase tracking-wide text-amber-700">{photo.event} | {photo.date}</p>
                <p className="text-sm leading-6 text-slate-600">{photo.caption}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

    </main>
  )
}
