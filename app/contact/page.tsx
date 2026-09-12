import { Clock, Mail, MapPin, Phone, Send } from "lucide-react"

export default function ContactPage() {
  return (
    <main className="bg-slate-50">
      <section className="container px-4 py-12 md:px-8">
        <div className="mb-8 max-w-3xl space-y-3">
          <p className="text-xs font-bold uppercase tracking-widest text-primary">Contact</p>
          <h1 className="text-3xl font-black text-slate-900 sm:text-4xl">Reach ASA UNIK-RP NGOMA</h1>
          <p className="text-sm leading-7 text-slate-600 sm:text-base">Send a message, request prayer, get directions, or connect with the church through official channels.</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="space-y-4 rounded-lg border bg-white p-5 shadow-sm">
            <h2 className="text-xl font-black text-slate-900">Contact Information</h2>
            <p className="flex gap-2 text-sm text-slate-700"><MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" /> RP Ngoma Campus, Kibungo, Eastern Province, Rwanda</p>
            <p className="flex items-center gap-2 text-sm text-slate-700"><Phone className="h-4 w-4 text-primary" /> +250 780 000 000</p>
            <p className="flex items-center gap-2 text-sm text-slate-700"><Mail className="h-4 w-4 text-primary" /> info@asaunikrpngoma.org</p>
            <p className="flex items-center gap-2 text-sm text-slate-700"><Clock className="h-4 w-4 text-primary" /> Office hours: Mon-Fri, 9:00 AM - 5:00 PM</p>
            <p className="text-sm font-semibold text-slate-900">Website: asaunikrpngoma.org</p>
            <div className="flex flex-wrap gap-2 pt-2">
              {["Facebook", "YouTube", "Instagram", "X"].map((name) => (
                <a key={name} href="#" aria-label={name} className="rounded-full bg-slate-900 px-3 py-2 text-xs font-black text-white">
                  {name === "Facebook" ? "F" : name === "YouTube" ? "YT" : name === "Instagram" ? "IG" : "X"}
                </a>
              ))}
            </div>
          </div>

          <form className="space-y-4 rounded-lg border bg-white p-5 shadow-sm lg:col-span-2">
            <h2 className="text-xl font-black text-slate-900">Contact Form</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <input className="rounded-md border px-3 py-2 text-sm" placeholder="Full Name" />
              <input className="rounded-md border px-3 py-2 text-sm" placeholder="Email" type="email" />
              <input className="rounded-md border px-3 py-2 text-sm" placeholder="Phone" />
              <input className="rounded-md border px-3 py-2 text-sm" placeholder="Subject" />
            </div>
            <textarea className="min-h-32 w-full rounded-md border px-3 py-2 text-sm" placeholder="Message" />
            <button className="inline-flex items-center gap-2 rounded-md bg-slate-900 px-4 py-2 text-sm font-bold text-white"><Send className="h-4 w-4" /> Send Message</button>
          </form>
        </div>
      </section>

      <section className="container grid gap-6 px-4 pb-12 md:px-8 lg:grid-cols-2">
        <form className="space-y-4 rounded-lg border bg-white p-5 shadow-sm">
          <h2 className="text-xl font-black text-slate-900">Need Prayer?</h2>
          <p className="text-sm text-slate-600">Share your prayer request with our prayer team.</p>
          <input className="w-full rounded-md border px-3 py-2 text-sm" placeholder="Name" />
          <input className="w-full rounded-md border px-3 py-2 text-sm" placeholder="Email/Phone" />
          <textarea className="min-h-32 w-full rounded-md border px-3 py-2 text-sm" placeholder="Prayer request" />
          <button className="rounded-md bg-amber-500 px-4 py-2 text-sm font-black text-slate-950">Submit Prayer Request</button>
        </form>
        <div className="overflow-hidden rounded-lg border bg-white shadow-sm">
          <iframe
            title="ASA UNIK-RP NGOMA location"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15948.33783777551!2d30.54013!3d-2.15833!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x19c52224c6dd06b9%3A0x6fb837bbfae69e4a!2sRP%20IPRC%20Ngoma!5e0!3m2!1sen!2srw!4v1700000000000!5m2!1sen!2srw"
            className="h-96 w-full border-0"
            loading="lazy"
          />
          <div className="p-4">
            <h2 className="font-black text-slate-900">Church Location and Directions</h2>
            <p className="text-sm text-slate-600">Visit RP Ngoma Campus in Kibungo, Ngoma District. Use the map to get directions.</p>
          </div>
        </div>
      </section>
    </main>
  )
}
