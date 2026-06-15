"use client"

import * as React from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function AboutPage() {
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
      <div className="absolute inset-0 z-10 bg-black/75" />

      {/* Page Content */}
      <div className="relative z-20 container mx-auto px-4 py-12 md:py-24 text-white">
        <div className="max-w-4xl mx-auto space-y-12">
          <div className="space-y-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tighter">About Us</h1>
           
          </div>

          <div className="space-y-6 text-lg text-gray-200 leading-relaxed">
            <p>
              The Adventist Students Association (ASA) RP is a faith-based student organization dedicated to promoting spiritual growth, academic excellence, leadership development, and community service among students.
            </p>
            <p>
              Established to unite Adventist students and friends of the Adventist faith, ASA RP provides a supportive environment where students can strengthen their relationship with God while pursuing their educational goals.
            </p>
            <p>
              Our association organizes worship services, Bible studies, prayer meetings, community outreach programs, leadership training, and various social activities that help students develop spiritually, intellectually, and socially.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 pt-8">
            <div className="space-y-4 p-6 bg-white/5 rounded-2xl backdrop-blur-sm border border-white/10">
              <h2 className="text-2xl font-bold text-primary">Our Mission</h2>
              <p className="text-gray-200">
                To nurture students in their relationship with Jesus Christ, encourage academic excellence, and inspire a life of service to God and humanity.
              </p>
            </div>
            <div className="space-y-4 p-6 bg-white/5 rounded-2xl backdrop-blur-sm border border-white/10">
              <h2 className="text-2xl font-bold text-primary">Our Vision</h2>
              <p className="text-gray-200">
                To build a vibrant community of students who reflect Christ's character, uphold Christian values, and positively impact their campus and society.
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-primary border-b border-primary/30 pb-2">Our Core Values</h2>
              <ul className="grid grid-cols-1 gap-2 text-gray-200">
                {[
                  "Faith in God",
                  "Integrity and Honesty",
                  "Academic Excellence",
                  "Leadership and Responsibility",
                  "Unity and Fellowship",
                  "Service to Others",
                  "Respect and Compassion"
                ].map((value, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                    {value}
                  </li>
                ))}
              </ul>
            </div>
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-primary border-b border-primary/30 pb-2">What We Do</h2>
              <ul className="grid grid-cols-1 gap-2 text-gray-200">
                {[
                  "Organize weekly worship and fellowship programs.",
                  "Conduct Bible study and prayer sessions.",
                  "Promote spiritual and personal development.",
                  "Engage in community service and outreach activities.",
                  "Support students academically and socially.",
                  "Develop leadership skills among members."
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="mt-2 w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="space-y-6 pt-8 text-center border-t border-white/10">
            <h2 className="text-2xl font-bold text-primary">Our Commitment</h2>
            <p className="text-gray-200 max-w-2xl mx-auto leading-relaxed italic">
              ASA RP is committed to creating an environment where every student feels welcomed, valued, and empowered to grow spiritually, academically, and socially. Through faith, fellowship, and service, we strive to make a positive difference within our institution and the wider community.
            </p>
            <div className="pt-4">
              <p className="text-xl font-medium text-white italic font-serif">
                "I can do all things through Christ who strengthens me."
              </p>
              <p className="text-gray-400 mt-1">– Philippians 4:13</p>
            </div>
          </div>

          <div className="flex justify-center pt-8">
            <Button asChild size="lg" className="px-8">
              <Link href="/register">Join Us Today</Link>
            </Button>
          </div>
        </div>
      </div>
    </main>
  )
}
