"use client"

import * as React from "react"
import Image from "next/image"
import { CalendarDays, Clock, MapPin, Mic, Users } from "lucide-react"

const categories = ["Worship", "Prayer", "Youth", "Bible Study", "Evangelism", "Community Outreach", "Family", "Special Programs"]

const formatEventTime = (time: string | undefined) => {
  if (!time) return "Time to be announced"
  if (!/^\d{2}:\d{2}$/.test(time)) return time
  const [hours, minutes] = time.split(":").map(Number)
  const period = hours >= 12 ? "PM" : "AM"
  const displayHours = hours % 12 || 12
  return `${displayHours}:${String(minutes).padStart(2, "0")} ${period}`
}

const parseEventDate = (value: string | undefined) => {
  if (!value || value.toLowerCase().includes("every")) return null
  const parsed = /^\d{4}-\d{2}-\d{2}$/.test(value)
    ? new Date(`${value}T00:00:00`)
    : new Date(value)
  return Number.isNaN(parsed.getTime()) ? null : parsed
}

const getPublishedEvents = () => {
  if (typeof window === "undefined") return []
  try {
    const raw = localStorage.getItem("church_website_events")
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export default function EventsPage() {
  const [events, setEvents] = React.useState(getPublishedEvents)

  React.useEffect(() => {
    const syncEvents = () => setEvents(getPublishedEvents())
    syncEvents()
    window.addEventListener("website-content-updated", syncEvents)
    window.addEventListener("storage", syncEvents)
    window.addEventListener("year-changed", syncEvents)
    return () => {
      window.removeEventListener("website-content-updated", syncEvents)
      window.removeEventListener("storage", syncEvents)
      window.removeEventListener("year-changed", syncEvents)
    }
  }, [])

  const calendarEventDates = events
    .map((event) => parseEventDate(event.date))
    .filter((date): date is Date => date !== null)
    .sort((first, second) => first.getTime() - second.getTime())
  const calendarDate = calendarEventDates[0] || new Date()
  const calendarYear = calendarDate.getFullYear()
  const calendarMonth = calendarDate.getMonth()
  const daysInMonth = new Date(calendarYear, calendarMonth + 1, 0).getDate()
  const firstDayOfMonth = new Date(calendarYear, calendarMonth, 1).getDay()
  const calendarCells = Math.ceil((firstDayOfMonth + daysInMonth) / 7) * 7
  const eventDays = new Set(
    calendarEventDates
      .filter((date) => date.getFullYear() === calendarYear && date.getMonth() === calendarMonth)
      .map((date) => date.getDate())
  )
  const calendarLabel = new Intl.DateTimeFormat("en-US", { month: "long", year: "numeric" }).format(calendarDate)

  return (
    <main className="bg-slate-50">
      <section className="bg-slate-950 text-white">
        <div className="container grid gap-8 px-4 py-12 md:px-8 lg:grid-cols-2 lg:py-16">
          <div className="space-y-4">
            <p className="text-xs font-bold uppercase tracking-widest text-amber-300">Church Activities</p>
            <h1 className="text-3xl font-black leading-tight sm:text-4xl">ASA UNIK-RP NGOMA</h1>
            <p className="max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
              Follow upcoming worship services, prayer meetings, Bible studies, youth programs, evangelism, community outreach, and special church programs.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-2 rounded-lg border border-white/10 bg-white/5 p-3 text-sm">
            {categories.map((category) => (
              <span key={category} className="rounded-md bg-white/10 px-3 py-2 text-slate-200">{category}</span>
            ))}
          </div>
        </div>
      </section>

      <section className="container px-4 py-10 md:px-8">
        <div className="mb-6 flex items-center gap-2">
          <CalendarDays className="h-6 w-6 text-primary" />
          <h2 className="text-2xl font-black text-slate-900">Upcoming Events</h2>
        </div>
        <div className="grid gap-5 lg:grid-cols-2">
          {events.length === 0 ? (
            <p className="rounded-lg border border-dashed border-slate-300 bg-white p-6 text-sm text-slate-600">No upcoming events have been published.</p>
          ) : events.map((event) => (
            <article key={event.title} className="overflow-hidden rounded-lg border bg-white shadow-sm">
              <div className="relative h-48 w-full">
                <Image src={event.image} alt={event.title} fill className="object-cover" />
                <span className="absolute left-4 top-4 rounded-md bg-amber-400 px-3 py-1 text-xs font-black text-slate-950">{event.category}</span>
              </div>
              <div className="space-y-4 p-5">
                <h3 className="text-xl font-black text-slate-900">{event.title}</h3>
                <p className="text-sm leading-6 text-slate-600">{event.description}</p>
                <div className="grid gap-2 text-sm text-slate-700 sm:grid-cols-2">
                  <p className="flex items-center gap-2"><CalendarDays className="h-4 w-4 text-primary" /> {event.date}</p>
                  <p className="flex items-center gap-2"><Clock className="h-4 w-4 text-primary" /> {event.start || event.time ? `${formatEventTime(event.start || event.time)}${event.end ? ` - ${formatEventTime(event.end)}` : ""}` : "Time to be announced"}</p>
                  <p className="flex items-center gap-2"><MapPin className="h-4 w-4 text-primary" /> {event.location}</p>
                  <p className="flex items-center gap-2"><Mic className="h-4 w-4 text-primary" /> {event.speaker}</p>
                  <p className="flex items-center gap-2 sm:col-span-2"><Users className="h-4 w-4 text-primary" /> Organizer: {event.organizer} </p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="container grid gap-6 px-4 pb-12 md:px-8 lg:grid-cols-2">
        <div className="rounded-lg border bg-white p-5 shadow-sm">
          <h2 className="mb-4 text-xl font-black text-slate-900">Monthly Calendar - {calendarLabel}</h2>
          <div className="grid grid-cols-7 gap-1 text-center text-xs">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => <div key={day} className="font-bold text-slate-500">{day}</div>)}
            {Array.from({ length: calendarCells }, (_, index) => {
              const day = index - firstDayOfMonth + 1
              const hasEvent = day > 0 && day <= daysInMonth && eventDays.has(day)
              return (
                <div key={index} className={`min-h-12 rounded-md border p-1 ${day > 0 && day <= daysInMonth ? "bg-slate-50 text-slate-700" : "bg-white text-transparent"}`}>
                  {day > 0 && day <= daysInMonth ? day : ""}
                  {hasEvent && <span className="mx-auto mt-1 block h-1.5 w-1.5 rounded-full bg-amber-500" />}
                </div>
              )
            })}
          </div>
        </div>
        <div className="rounded-lg border bg-white p-5 shadow-sm">
          <h2 className="mb-4 text-xl font-black text-slate-900">Past Events</h2>
          <p className="text-sm text-slate-600">No past events have been published.</p>
        </div>
      </section>
    </main>
  )
}
