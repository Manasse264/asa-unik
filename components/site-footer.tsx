import Image from "next/image"
import Link from "next/link"
import { Mail, MapPin, Phone } from "lucide-react"

const quickLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About Us" },
  { href: "/ministries", label: "Ministries" },
  { href: "/sermons", label: "Sermons" },
  { href: "/events", label: "Events" },
  { href: "/gallery", label: "Gallery" },
  { href: "/updates", label: "Updates" },
  { href: "/contact", label: "Contact" },
]

export function SiteFooter() {
  return (
    <footer className="bg-slate-950 text-slate-200">
      <div className="container grid gap-8 px-4 py-10 sm:grid-cols-2 lg:grid-cols-4 md:px-8">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <Image src="/logo.jpeg" alt="ASA UNIK-RP NGOMA logo" width={48} height={48} className="h-12 w-12 rounded-full object-cover" />
            <div>
              <p className="font-black leading-tight text-white">ASA UNIK-RP NGOMA</p>
              <p className="text-xs text-slate-400">Seventh-day Adventist Church</p>
            </div>
          </div>
          <p className="text-sm leading-6 text-slate-400">
            A Christ-centered church family at RP Ngoma serving students, members, and the surrounding community.
          </p>
        </div>

        <div>
          <h2 className="mb-3 text-sm font-bold uppercase tracking-wider text-white">Quick Links</h2>
          <div className="grid grid-cols-2 gap-2 text-sm">
            {quickLinks.map((link) => (
              <Link key={link.href} href={link.href} className="text-slate-400 transition-colors hover:text-amber-300">
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        <div>
          <h2 className="mb-3 text-sm font-bold uppercase tracking-wider text-white">Contact</h2>
          <div className="space-y-3 text-sm text-slate-400">
            <p className="flex gap-2"><MapPin className="mt-0.5 h-4 w-4 shrink-0 text-amber-300" /> RP Ngoma Campus, Kibungo, Eastern Province, Rwanda</p>
            <p className="flex items-center gap-2"><Phone className="h-4 w-4 text-amber-300" /> +250 780 000 000</p>
            <p className="flex items-center gap-2"><Mail className="h-4 w-4 text-amber-300" /> info@asaunikrpngoma.org</p>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-white">Social Media</h2>
          <div className="flex flex-wrap gap-2">
            {["Facebook", "YouTube", "Instagram", "X"].map((name) => (
              <a key={name} href="#" aria-label={name} className="inline-flex h-10 min-w-10 items-center justify-center rounded-full bg-white/10 px-3 text-xs font-black text-white transition-colors hover:bg-amber-500 hover:text-slate-950">
                {name === "Facebook" ? "F" : name === "YouTube" ? "YT" : name === "Instagram" ? "IG" : "X"}
              </a>
            ))}
          </div>
          <div className="overflow-hidden rounded-lg border border-white/10">
            <iframe
              title="ASA UNIK-RP NGOMA map"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15948.33783777551!2d30.54013!3d-2.15833!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x19c52224c6dd06b9%3A0x6fb837bbfae69e4a!2sRP%20IPRC%20Ngoma!5e0!3m2!1sen!2srw!4v1700000000000!5m2!1sen!2srw"
              className="h-28 w-full border-0"
              loading="lazy"
            />
          </div>
        </div>
      </div>
      <div className="border-t border-white/10 px-4 py-4 text-center text-xs text-slate-500">
        <Link href="#" className="hover:text-slate-300">Privacy Policy</Link>
        <span className="mx-2">|</span>
        <Link href="#" className="hover:text-slate-300">Terms & Conditions</Link>
        <span className="mx-2">|</span>
        &copy; 2026 ASA UNIK-RP NGOMA. All Rights Reserved.
      </div>
    </footer>
  )
}
