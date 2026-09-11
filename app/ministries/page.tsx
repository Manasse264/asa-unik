"use client"

import * as React from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  Users,
  Smile,
  HeartHandshake,
  Shield,
  Music,
  Flame,
  Globe,
  Clock,
  User,
  Phone,
  Mail,
  X,
  Calendar,
  CheckCircle2,
  ArrowRight
} from "lucide-react"

interface Ministry {
  id: string
  name: string
  icon: React.ElementType
  photo: string
  description: string
  objectives: string[]
  activities: string[]
  schedule: string
  leader: string
  contactPhone: string
  contactEmail: string
}

const MINISTRIES_DATA: Ministry[] = [
  {
    id: "youth",
    name: "Youth Ministry",
    icon: Users,
    photo: "/photo1.jpg",
    description: "Empowering young people to deepen their faith, develop leadership skills, and impact the campus community through Christ-centered fellowship.",
    objectives: [
      "Foster spiritual growth among students and youth",
      "Develop servant leaders for the church and society",
      "Provide a safe space for youth fellowship and mentorship"
    ],
    activities: [
      "Youth Sabbath Worship & Discussions",
      "Weekly Campus Bible Studies",
      "Youth Retreats & Camps",
      "Evangelistic Youth Outreach"
    ],
    schedule: "Saturdays at 2:30 PM & Wednesdays at 6:00 PM",
    leader: "Youth Director & Team",
    contactPhone: "+250 780 000 001",
    contactEmail: "youth@asaunikrpngoma.org"
  },
  {
    id: "children",
    name: "Children's Ministry",
    icon: Smile,
    photo: "/photo2.jpg",
    description: "Nurturing children in the knowledge and love of Jesus Christ through engaging Bible lessons, Sabbath School, and creative activities.",
    objectives: [
      "Instill biblical values from an early age",
      "Guide children toward accepting Jesus as their Savior",
      "Support parents in spiritual parenting"
    ],
    activities: [
      "Children's Sabbath School",
      "Vacation Bible School (VBS)",
      "Children's Choir & Recitations",
      "Bible Storytelling & Crafts"
    ],
    schedule: "Saturdays at 9:00 AM",
    leader: "Children's Ministry Coordinator",
    contactPhone: "+250 780 000 002",
    contactEmail: "children@asaunikrpngoma.org"
  },
  {
    id: "women",
    name: "Women's Ministry",
    icon: HeartHandshake,
    photo: "/photo3.jpg",
    description: "Encouraging and equipping women through prayer, biblical study, mutual support, and compassionate outreach to families and campus women.",
    objectives: [
      "Build strong spiritual bonds among women",
      "Promote mental, physical, and spiritual health",
      "Engage in compassionate community support"
    ],
    activities: [
      "Women's Prayer Breakfasts",
      "Bible Study & Mentorship Circles",
      "Campus & Community Charity Initiatives",
      "Family Life & Health Seminars"
    ],
    schedule: "Sundays at 3:00 PM (Bi-weekly)",
    leader: "Women's Ministry Leader",
    contactPhone: "+250 780 000 003",
    contactEmail: "women@asaunikrpngoma.org"
  },
  {
    id: "men",
    name: "Men's Ministry",
    icon: Shield,
    photo: "/photo4.jpg",
    description: "Uniting men in Christian leadership, godly integrity, brotherhood, and service within the family, church, and academic institution.",
    objectives: [
      "Develop godly leadership in men",
      "Encourage spiritual accountability and brotherhood",
      "Lead campus and community outreach efforts"
    ],
    activities: [
      "Men's Prayer & Fellowship Gatherings",
      "Leadership Development Workshops",
      "Practical Community Service Projects",
      "Men's Health & Wellness Discussions"
    ],
    schedule: "Sundays at 4:30 PM (Bi-weekly)",
    leader: "Men's Ministry Leader",
    contactPhone: "+250 780 000 004",
    contactEmail: "men@asaunikrpngoma.org"
  },
  {
    id: "music",
    name: "Choir & Music Ministry",
    icon: Music,
    photo: "/photo1.jpg",
    description: "Leading the congregation into authentic worship, inspiring hope through choral music, praise teams, and special musical programs.",
    objectives: [
      "Exalt God through spirit-filled music",
      "Train singers and instrumentalists for ministry",
      "Proclaim the Gospel message through song"
    ],
    activities: [
      "Sabbath Worship Praise & Choir Performances",
      "Choir Rehearsals & Vocal Training",
      "Campus Music Concerts & Hymn Festivals",
      "Evangelistic Music Outreaches"
    ],
    schedule: "Fridays at 5:00 PM & Saturdays at 1:30 PM",
    leader: "Music Director",
    contactPhone: "+250 780 000 005",
    contactEmail: "music@asaunikrpngoma.org"
  },
  {
    id: "prayer",
    name: "Prayer Ministry",
    icon: Flame,
    photo: "/photo2.jpg",
    description: "Serving as the spiritual engine of the church through intercessory prayer, prayer watches, and dedicated prayer requests support.",
    objectives: [
      "Sustain continuous prayer for the church and campus",
      "Intercede for personal, spiritual, and academic needs",
      "Foster a culture of persistent prayer"
    ],
    activities: [
      "Morning Prayer Watches",
      "Wednesday Evening Prayer Meetings",
      "Sabbath Early Intercession",
      "Confidential Prayer Request Support"
    ],
    schedule: "Daily at 5:30 AM & Wednesdays at 6:30 PM",
    leader: "Prayer Ministry Coordinator",
    contactPhone: "+250 780 000 006",
    contactEmail: "prayer@asaunikrpngoma.org"
  },
  {
    id: "outreach",
    name: "Community Outreach & Evangelism",
    icon: Globe,
    photo: "/photo3.jpg",
    description: "Sharing God's love in action through community service, health expos, charity projects, and public gospel campaigns.",
    objectives: [
      "Meet practical human needs with Christian love",
      "Proclaim the Three Angels' Messages",
      "Promote health, wellness, and temperance"
    ],
    activities: [
      "Community Service & Cleanups (Umuganda support)",
      "Free Health Expos & Medical Clinics",
      "Public Evangelistic Campaigns",
      "Charity Visits to Prisons and Hospitals"
    ],
    schedule: "Saturdays at 4:00 PM & Monthly Outreaches",
    leader: "Outreach & Evangelism Director",
    contactPhone: "+250 780 000 007",
    contactEmail: "outreach@asaunikrpngoma.org"
  }
]

export default function MinistriesPage() {
  const [selectedMinistry, setSelectedMinistry] = React.useState<Ministry | null>(null)

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

      {/* Content Container */}
      <div className="relative z-20 container mx-auto px-4 py-12 md:py-20 text-white">
        <div className="max-w-6xl mx-auto space-y-12">

          {/* Section Introduction */}
          <div className="text-center max-w-3xl mx-auto">
            <p className="text-base md:text-xl text-slate-200 leading-relaxed font-medium">
              Discover where you can grow, connect, and serve. Every ministry at ASA UNIK-RP NGOMA is dedicated to glorifying God and empowering our campus community.
            </p>
          </div>

          {/* Ministry Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {MINISTRIES_DATA.map((ministry) => {
              const IconComponent = ministry.icon
              return (
                <div
                  key={ministry.id}
                  className="flex flex-col rounded-2xl bg-white/5 border border-white/10 overflow-hidden backdrop-blur-md hover:border-amber-400/50 transition-all duration-300 group shadow-lg"
                >
                  {/* Photo Container */}
                  <div className="relative h-48 w-full overflow-hidden">
                    <img
                      src={ministry.photo}
                      alt={ministry.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
                    
                    {/* Floating Icon Badge */}
                    <div className="absolute bottom-3 left-4 p-2.5 rounded-xl bg-amber-500 text-slate-950 font-bold shadow-md flex items-center justify-center">
                      <IconComponent className="w-6 h-6" />
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      <h3 className="text-xl font-bold text-white group-hover:text-amber-400 transition-colors">
                        {ministry.name}
                      </h3>
                      <p className="text-sm text-slate-300 line-clamp-3 leading-relaxed">
                        {ministry.description}
                      </p>
                    </div>

                    <div className="space-y-3 pt-2 border-t border-white/10 text-xs text-slate-300">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-amber-400 shrink-0" />
                        <span>{ministry.schedule}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-amber-400 shrink-0" />
                        <span>{ministry.leader}</span>
                      </div>
                    </div>

                    <Button
                      onClick={() => setSelectedMinistry(ministry)}
                      className="w-full bg-white/10 hover:bg-amber-500 hover:text-slate-950 text-white font-semibold transition-all flex items-center justify-center gap-2 mt-4"
                    >
                      Learn More
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Bottom Banner */}
          <div className="p-8 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md text-center space-y-4">
            <h2 className="text-2xl font-bold text-amber-400">Want to Get Involved?</h2>
            <p className="text-slate-300 max-w-2xl mx-auto text-sm md:text-base">
              Whether you want to sing in the choir, serve in community outreach, or participate in youth leadership, there is a place for you in our church family.
            </p>
            <div className="pt-2">
              <Button asChild size="lg" className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-8 rounded-full">
                <Link href="/register">Join a Ministry Today</Link>
              </Button>
            </div>
          </div>

        </div>
      </div>

      {/* LEARN MORE MODAL */}
      {selectedMinistry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-slate-900 border border-white/20 p-6 md:p-8 text-white space-y-6 shadow-2xl">
            
            {/* Close Button */}
            <button
              onClick={() => setSelectedMinistry(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Header */}
            <div className="flex items-start gap-4 pr-8">
              <div className="p-3 rounded-xl bg-amber-500 text-slate-950 shrink-0">
                {React.createElement(selectedMinistry.icon, { className: "w-8 h-8" })}
              </div>
              <div>
                <h2 className="text-2xl font-black text-white">{selectedMinistry.name}</h2>
                <p className="text-xs text-amber-400 font-semibold mt-0.5">ASA UNIK-RP NGOMA</p>
              </div>
            </div>

            {/* Ministry Image */}
            <div className="h-52 w-full rounded-xl overflow-hidden border border-white/10">
              <img
                src={selectedMinistry.photo}
                alt={selectedMinistry.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Description */}
            <p className="text-slate-200 text-sm leading-relaxed">
              {selectedMinistry.description}
            </p>

            {/* Objectives */}
            <div className="space-y-2">
              <h3 className="text-sm font-bold text-amber-400 uppercase tracking-wider">Objectives</h3>
              <ul className="space-y-1.5 text-sm text-slate-300">
                {selectedMinistry.objectives.map((obj, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <span>{obj}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Activities */}
            <div className="space-y-2">
              <h3 className="text-sm font-bold text-amber-400 uppercase tracking-wider">Key Activities</h3>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-slate-300">
                {selectedMinistry.activities.map((act, i) => (
                  <li key={i} className="p-2.5 rounded-lg bg-white/5 border border-white/5 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                    <span>{act}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Meeting Schedule & Contact Details */}
            <div className="p-4 rounded-xl bg-slate-950/60 border border-white/10 space-y-3 text-xs md:text-sm text-slate-300">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-amber-400 shrink-0" />
                <span><strong>Meeting Schedule:</strong> {selectedMinistry.schedule}</span>
              </div>
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-amber-400 shrink-0" />
                <span><strong>Leader:</strong> {selectedMinistry.leader}</span>
              </div>
              <div className="flex flex-wrap gap-4 pt-1 border-t border-white/10">
                <span className="flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-amber-400" />
                  {selectedMinistry.contactPhone}
                </span>
                <span className="flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-amber-400" />
                  {selectedMinistry.contactEmail}
                </span>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex justify-end gap-3 pt-2">
              <Button
                variant="outline"
                onClick={() => setSelectedMinistry(null)}
                className="border-white/20 text-white hover:bg-white/10"
              >
                Close
              </Button>
              <Button asChild className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold">
                <Link href="/register">Get Involved</Link>
              </Button>
            </div>

          </div>
        </div>
      )}
    </main>
  )
}