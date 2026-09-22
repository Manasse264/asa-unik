"use client"

import * as React from "react"
import { Camera } from "lucide-react"
import { getWebsiteGallery } from "@/lib/actions"

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

interface StoredGalleryPhoto {
  id: string
  title: string
  date: string
  category: string
  caption: string
  src: string
  type: string
}

export default function GalleryPage() {
  const [photos, setPhotos] = React.useState<GalleryPhoto[]>([])

  React.useEffect(() => {
    const syncGallery = async () => {
      try {
        const publishedGallery = await getWebsiteGallery()
        setPhotos(publishedGallery.map((photo: StoredGalleryPhoto) => ({ ...photo, event: photo.category, type: photo.type as "photo" | "video" })))
      } catch {
        setPhotos([])
      }
    }
    void syncGallery()
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
