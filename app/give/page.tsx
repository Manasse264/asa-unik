import { Banknote, Heart, Landmark, Smartphone } from "lucide-react"

const givingOptions = ["Tithe", "Offering", "Development fund", "Youth ministry", "Community outreach", "Other donations"]

export default function GivePage() {
  return (
    <main className="bg-slate-50">
      <section className="bg-slate-950 text-white">
        <div className="container px-4 py-12 md:px-8 lg:py-16">
          <div className="max-w-3xl space-y-4">
            <p className="text-xs font-bold uppercase tracking-widest text-amber-300">Give</p>
            <h1 className="text-3xl font-black leading-tight sm:text-4xl">Support God's Work</h1>
            <p className="text-sm leading-7 text-slate-300 sm:text-base">
              Your contributions support church ministry, evangelism, youth programs, community outreach, church development, and mission activities through ASA UNIK-RP NGOMA.
            </p>
          </div>
        </div>
      </section>

      <section className="container grid gap-6 px-4 py-10 md:px-8 lg:grid-cols-3">
        <div className="rounded-lg border bg-white p-5 shadow-sm lg:col-span-2">
          <div className="mb-5 flex items-center gap-2">
            <Heart className="h-6 w-6 text-amber-600" />
            <h2 className="text-2xl font-black text-slate-900">Giving Options</h2>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {givingOptions.map((option) => (
              <div key={option} className="rounded-md border border-slate-200 bg-slate-50 p-4">
                <h3 className="font-bold text-slate-900">{option}</h3>
                <p className="text-sm text-slate-600">Support this area through the church's official verified payment channels.</p>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4 rounded-lg border bg-white p-5 shadow-sm">
          <h2 className="text-xl font-black text-slate-900">Payment Information</h2>
          <div className="rounded-md border bg-slate-50 p-4 text-sm text-slate-700">
            <p className="mb-2 flex items-center gap-2 font-bold text-slate-900"><Landmark className="h-4 w-4 text-primary" /> Bank details</p>
            <p>Use only the church's official and verified bank account before sending funds.</p>
          </div>
          <div className="rounded-md border bg-slate-50 p-4 text-sm text-slate-700">
            <p className="mb-2 flex items-center gap-2 font-bold text-slate-900"><Smartphone className="h-4 w-4 text-primary" /> Mobile money</p>
            <p>Confirm the official church MoMo number with treasury leadership.</p>
          </div>
          <div className="rounded-md border bg-slate-50 p-4 text-sm text-slate-700">
            <p className="mb-2 flex items-center gap-2 font-bold text-slate-900"><Banknote className="h-4 w-4 text-primary" /> Instructions</p>
            <p>Include your name and giving purpose, then keep your payment confirmation.</p>
          </div>
        </div>
      </section>

      <section className="container px-4 pb-12 md:px-8">
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-5 text-emerald-900">
          <h2 className="font-black">Giving Confirmation</h2>
          <p className="text-sm">Thank you for supporting the ministry of ASA UNIK-RP NGOMA.</p>
        </div>
      </section>
    </main>
  )
}
