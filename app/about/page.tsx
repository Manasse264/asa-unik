"use client"

import * as React from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { 
  BookOpen, 
  Heart, 
  ShieldCheck, 
  Users, 
  Compass, 
  MapPin, 
  Phone, 
  Mail, 
  Sparkles, 
  Calendar,
  Cross,
  Sun,
  Flame,
  UserCheck,
  Building,
  Navigation
} from "lucide-react"

export default function AboutPage() {
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

      {/* Main Page Content */}
      <div className="relative z-20 container mx-auto px-4 py-12 md:py-20 text-white">
        <div className="max-w-5xl mx-auto space-y-16">
          
          {/* 1. HERO / INTRODUCTION */}
          <div className="space-y-4 text-center max-w-3xl mx-auto">
           
            <p className="text-lg md:text-xl text-slate-300 leading-relaxed font-medium">
              <strong className="text-amber-400">ASA UNIK-RP NGOMA</strong> (Adventist Students Association) is a vibrant Seventh-day Adventist campus church and fellowship based at the Rwanda Polytechnic (RP) Ngoma Campus in Kibungo, Eastern Province, Rwanda.
            </p>
          </div>

          {/* 2. HISTORY & MILESTONES */}
          <div className="p-8 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md space-y-6">
            <h2 className="text-2xl font-extrabold text-amber-400 flex items-center gap-2">
              <Building className="w-6 h-6" />
              Our History & Journey
            </h2>
            <div className="space-y-4 text-slate-200 leading-relaxed">
              <p>
                <strong>Establishment:</strong> Founded to unite Seventh-day Adventist students, faculty, and local community members, ASA UNIK-RP NGOMA began as a small Sabbath fellowship group dedicated to preserving Christian values in higher education.
              </p>
              <p>
                <strong>Important Milestones:</strong> Over the years, our fellowship expanded into a fully organized campus church, creating active ministries in music, evangelism, youth empowerment, and community care across Ngoma District.
              </p>
              <p>
                <strong>Development:</strong> Today, ASA UNIK-RP NGOMA serves as a spiritual home for hundreds of students, nurturing future leaders through biblical teaching, active leadership roles, and dedicated outreach projects.
              </p>
            </div>
          </div>

          {/* 3. VISION & MISSION */}
          <div className="grid md:grid-cols-2 gap-8">
            <div className="p-6 bg-white/5 rounded-2xl backdrop-blur-md border border-white/10 space-y-3">
              <h2 className="text-2xl font-bold text-amber-400 flex items-center gap-2">
                <Compass className="w-6 h-6" />
                Our Vision
              </h2>
              <p className="text-slate-200 leading-relaxed">
                To be a Christ-centered church that prepares people for the coming of Jesus Christ by fostering holistic spiritual growth, academic integrity, and selfless community service.
              </p>
            </div>

            <div className="p-6 bg-white/5 rounded-2xl backdrop-blur-md border border-white/10 space-y-3">
              <h2 className="text-2xl font-bold text-amber-400 flex items-center gap-2">
                <Sparkles className="w-6 h-6" />
                Our Mission
              </h2>
              <ul className="space-y-2 text-slate-200">
                <li className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-amber-400" /> <strong>Worship God</strong> in truth and spirit</li>
                <li className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-amber-400" /> <strong>Preach the Gospel</strong> of Jesus Christ</li>
                <li className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-amber-400" /> <strong>Disciple believers</strong> for spiritual maturity</li>
                <li className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-amber-400" /> <strong>Serve the community</strong> with compassion</li>
                <li className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-amber-400" /> <strong>Support young people</strong> in faith and academics</li>
              </ul>
            </div>
          </div>

          {/* 4. OUR CORE VALUES */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-center text-amber-400">Our Core Values</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-4 text-center">
              {[
                { name: "Faith", icon: Sun },
                { name: "Love", icon: Heart },
                { name: "Integrity", icon: ShieldCheck },
                { name: "Service", icon: UserCheck },
                { name: "Unity", icon: Users },
                { name: "Compassion", icon: Flame },
                { name: "Hope", icon: Cross },
              ].map((val, idx) => {
                const Icon = val.icon
                return (
                  <div key={idx} className="p-4 bg-white/5 border border-white/10 rounded-xl backdrop-blur-sm flex flex-col items-center justify-center space-y-2 hover:bg-white/10 transition-colors">
                    <Icon className="w-6 h-6 text-amber-400" />
                    <span className="text-sm font-bold text-slate-200">{val.name}</span>
                  </div>
                )
              })}
            </div>
          </div>

          {/* 5. OUR BELIEFS */}
          <div className="p-8 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md space-y-6">
            <h2 className="text-2xl font-bold text-amber-400 text-center">Our Fundamental Beliefs</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-sm text-slate-200">
              <div className="p-4 bg-slate-900/60 rounded-xl border border-white/5">
                <strong className="block text-white mb-1">The Bible</strong>
                God's inspired Word and the sole foundation for our faith and practice.
              </div>
              <div className="p-4 bg-slate-900/60 rounded-xl border border-white/5">
                <strong className="block text-white mb-1">Jesus Christ</strong>
                Our Savior, divine Son of God, who died for our sins and rose again.
              </div>
              <div className="p-4 bg-slate-900/60 rounded-xl border border-white/5">
                <strong className="block text-white mb-1">Salvation</strong>
                Received by grace through faith in Jesus Christ alone.
              </div>
              <div className="p-4 bg-slate-900/60 rounded-xl border border-white/5">
                <strong className="block text-white mb-1">The Sabbath</strong>
                Observing the 7th-day Sabbath (Saturday) from sunset Friday to sunset Saturday.
              </div>
              <div className="p-4 bg-slate-900/60 rounded-xl border border-white/5">
                <strong className="block text-white mb-1">Second Coming</strong>
                The literal, visible return of Jesus Christ in glory.
              </div>
              <div className="p-4 bg-slate-900/60 rounded-xl border border-white/5">
                <strong className="block text-white mb-1">Christian Living</strong>
                Living healthy, moral, and purposeful lives to honor God.
              </div>
              <div className="p-4 bg-slate-900/60 rounded-xl border border-white/5">
                <strong className="block text-white mb-1">Baptism</strong>
                By full immersion as a public declaration of faith in Christ.
              </div>
              <div className="p-4 bg-slate-900/60 rounded-xl border border-white/5">
                <strong className="block text-white mb-1">Prayer</strong>
                Direct communion with God to seek guidance, strength, and blessing.
              </div>
            </div>
          </div>

          {/* 6. CHURCH LEADERSHIP */}
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-amber-400">Church Leadership</h2>
              <p className="text-sm text-slate-300 mt-1">Guiding our community in spiritual growth and administration.</p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { title: "Church Pastor", desc: "Spiritual leader and minister overseeing pastoral care." },
                { title: "First Elder", desc: "Assists pastoral duties and leads local church administration." },
                { title: "Church Board", desc: "Elected council managing strategic planning and church operations." },
                { title: "Department Leaders", desc: "Directing Youth, Choir, Welfare, Evangelism, and Prayer Ministries." },
              ].map((lead, i) => (
                <div key={i} className="p-5 bg-white/5 border border-white/10 rounded-xl text-center space-y-2">
                  <div className="w-10 h-10 mx-auto rounded-full bg-amber-500/20 flex items-center justify-center text-amber-400 font-bold">
                    {i + 1}
                  </div>
                  <h3 className="font-bold text-white text-base">{lead.title}</h3>
                  <p className="text-xs text-slate-300">{lead.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* 7. LOCATION & MAP */}
          <div className="p-8 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md grid lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-6 space-y-4">
              <h2 className="text-2xl font-bold text-amber-400 flex items-center gap-2">
                <MapPin className="w-6 h-6" />
                Church Location & Directions
              </h2>
              <div className="space-y-3 text-sm text-slate-200">
                <p>
                  <strong>Physical Address:</strong> RP Ngoma Campus (IPRC Ngoma), Kibungo, Ngoma District, Eastern Province, Rwanda.
                </p>
                <p>
                  <strong>Directions:</strong> From Kibungo town center, follow the main road towards RP Ngoma Campus. The ASA sanctuary is located within the campus grounds.
                </p>
                <div className="pt-2 space-y-1">
                  <p className="flex items-center gap-2"><Phone className="w-4 h-4 text-amber-400" /> +250 780 000 000</p>
                  <p className="flex items-center gap-2"><Mail className="w-4 h-4 text-amber-400" /> info@asaunikrpngoma.org</p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-6 h-60 rounded-xl overflow-hidden border border-white/20 shadow-lg">
              <iframe 
                title="ASA UNIK-RP NGOMA Location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15948.33783777551!2d30.54013!3d-2.15833!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x19c52224c6dd06b9%3A0x6fb837bbfae69e4a!2sRP%20IPRC%20Ngoma!5e0!3m2!1sen!2srw!4v1700000000000!5m2!1sen!2srw"
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen={false} 
                loading="lazy"
                className="filter contrast-125 brightness-90"
              />
            </div>
          </div>

          {/* 8. CALL TO ACTION */}
          <div className="text-center pt-6 space-y-6 border-t border-white/10">
            <p className="text-xl font-serif italic text-amber-300">
              "For where two or three gather in my name, there am I with them."
            </p>
            <p className="text-xs text-slate-400 uppercase tracking-widest">– Matthew 18:20</p>
            <div className="flex justify-center gap-4 pt-2">
              <Button asChild size="lg" className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-8 rounded-full">
                <Link href="/register">Join Us Today</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-white/40 text-white hover:bg-white/10 rounded-full">
                <Link href="/events">View Sabbath Schedule</Link>
              </Button>
            </div>
          </div>

        </div>
      </div>
    </main>
  )
}