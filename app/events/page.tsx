import Image from "next/image"
import { CalendarDays, Clock, MapPin, Mic, Users } from "lucide-react"

const events = [
  { title: "Sabbath Worship Service", date: "Every Saturday", start: "9:00 AM", end: "12:00 PM", location: "Main Sanctuary", category: "Worship", speaker: "Church Pastor", organizer: "Church Board", image: "/photo1.jpg", description: "Bible study, worship, music, prayer, and preaching for the whole church family." },
  { title: "Youth Fellowship", date: "September 17, 2026", start: "5:00 PM", end: "7:00 PM", location: "Church Hall", category: "Youth", speaker: "Youth Leader", organizer: "Youth Ministry", image: "/photo2.jpg", description: "A Christ-centered evening of Bible discussion, prayer, music, and friendship." },
  { title: "Community Outreach", date: "September 20, 2026", start: "8:00 AM", end: "12:00 PM", location: "Ngoma Community", category: "Community Outreach", speaker: "Outreach Team", organizer: "Community Outreach", image: "/photo3.jpg", description: "Service, evangelism, charity support, and practical care for our neighbors." },
  { title: "Family Worship Sabbath", date: "September 27, 2026", start: "9:00 AM", end: "12:00 PM", location: "Main Sanctuary", category: "Family", speaker: "Guest Speaker", organizer: "Family Life Ministry", image: "/photo4.jpg", description: "A special Sabbath focused on Christian homes, unity, discipleship, and hope." },
]

const categories = ["Worship", "Prayer", "Youth", "Bible Study", "Evangelism", "Community Outreach", "Family", "Special Programs"]
const pastEvents = ["Baptism Sabbath", "Choir Concert", "Health Program"]

export default function EventsPage() {
  return (
    <main className="bg-slate-50">
      <section className="bg-slate-950 text-white">
        <div className="container grid gap-8 px-4 py-12 md:px-8 lg:grid-cols-2 lg:py-16">
          <div className="space-y-4">
            <p className="text-xs font-bold uppercase tracking-widest text-amber-300">Church Activities</p>
            <h1 className="text-3xl font-black leading-tight sm:text-4xl">Events at ASA UNIK-RP NGOMA</h1>
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
          {events.map((event) => (
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
                  <p className="flex items-center gap-2"><Clock className="h-4 w-4 text-primary" /> {event.start} - {event.end}</p>
                  <p className="flex items-center gap-2"><MapPin className="h-4 w-4 text-primary" /> {event.location}</p>
                  <p className="flex items-center gap-2"><Mic className="h-4 w-4 text-primary" /> {event.speaker}</p>
                  <p className="flex items-center gap-2 sm:col-span-2"><Users className="h-4 w-4 text-primary" /> Organizer: {event.organizer} | Contact: +250 780 000 000</p>
                </div>
                <button className="w-full rounded-md bg-slate-900 px-4 py-2 text-sm font-bold text-white">Register / Join Event</button>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="container grid gap-6 px-4 pb-12 md:px-8 lg:grid-cols-2">
        <div className="rounded-lg border bg-white p-5 shadow-sm">
          <h2 className="mb-4 text-xl font-black text-slate-900">Monthly Calendar</h2>
          <div className="grid grid-cols-7 gap-1 text-center text-xs">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => <div key={day} className="font-bold text-slate-500">{day}</div>)}
            {Array.from({ length: 35 }, (_, index) => (
              <div key={index} className="min-h-12 rounded-md border bg-slate-50 p-1 text-slate-700">
                {index + 1 <= 30 ? index + 1 : ""}
                {[5, 13, 17, 20, 27].includes(index + 1) && <span className="mx-auto mt-1 block h-1.5 w-1.5 rounded-full bg-amber-500" />}
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-lg border bg-white p-5 shadow-sm">
          <h2 className="mb-4 text-xl font-black text-slate-900">Past Events</h2>
          <div className="space-y-3">
            {pastEvents.map((event) => (
              <div key={event} className="rounded-md border border-slate-200 p-3">
                <h3 className="font-bold text-slate-900">{event}</h3>
                <p className="text-sm text-slate-600">Photos, videos, summaries, and ministry highlights from the program.</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
