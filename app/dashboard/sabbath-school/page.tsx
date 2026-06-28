"use client"

import * as React from "react"
import { Plus, Search, Pencil, Trash2, Check, X, Users2, Music, Send, Download, FileText, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { YearSelector } from "@/components/year-selector"
import { cn } from "@/lib/utils"
import { getAttendance } from "@/lib/actions"
import { saveAttendanceRecord } from "@/lib/actions"
import { saveReport } from "@/lib/actions"
import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"
import {
  getAttendance,
  saveAttendanceRecord,
  deleteAttendance,
  getLetters,
  saveLetter,
} from "@/lib/actions"
import {
  getFamilies,
  saveFamily,
  deleteFamily,
} from "@/lib/actions"
const sslTranslations = {
  en: {
    title: "Sabbath School Leader", subtitle: "Attendance Officer", addFamily: "Register Family",
    genPDF: "Generate Daily Report", tabFamily: "Family Management", tabAtt: "Record Attendance", tabRep: "weekly Report",
    selDate: "Select Date", total: "Total", families: "Families", choirs: "Choirs",
    famName: "Family Name", pere: "Pere (Father)", mere: "Mere (Mother)", maxMem: "Members",
    att: "Attended", summary: "Attendance Summary", actions: "Actions",
    save: "Save", cancel: "Cancel", name: "Name", type: "Type", count: "Count",
    confirmDel: "Are you sure you want to delete this", update: "Update Family",
    sentMsg: "Daily Report has been generated and sent to the Secretary.",
    noData: "No attendance data recorded for this date.",
    dateLabel: "Date",
    tabLetter: "Sabbath Letters", addLetter: "Register Letter",
    origin: "Origin Church", district: "District", field: "Field", upload: "Upload Letter",
    status: "Status", received: "Received", rejected: "Rejected", files: "Files"
  },
  fr: {
    title: "Responsable École du Sabbat", subtitle: "Officier de Présence", addFamily: "Enregistrer Famille",
    genPDF: "Générer Rapport Journalier", tabFamily: "Gestion des Familles", tabAtt: "Noter la Présence", tabRep: "Enregistrer",
    selDate: "Choisir Date", total: "Total", families: "Familles", choirs: "Chorales",
    famName: "Nom Famille", pere: "Père", mere: "Mère", maxMem: "Membres Max",
    att: "Présents", summary: "Résumé des Présences", actions: "Actions",
    save: "Enregistrer", cancel: "Annuler", name: "Nom", type: "Type", count: "Nombre",
    confirmDel: "Êtes-vous sûr de vouloir supprimer ce", update: "Mettre à jour la famille",
    sentMsg: "Le rapport journalier a été généré et envoyé au secrétaire.",
    noData: "Aucune donnée de présence enregistrée pour cette date.",
    dateLabel: "Date",
    tabLetter: "Lettres de Sabbat", addLetter: "Enregistrer Lettre",
    origin: "Église d'Origine", district: "District", field: "Champ", upload: "Télécharger Lettre",
    status: "Statut", received: "Reçu", rejected: "Rejeté", files: "Fichiers"
  }
}

interface Family { id: string; name: string; pere: string; mere: string; memberCount: number; }
interface SabbathLetter { id: string; name: string; originChurch: string; district: string; field: string; fileName: string; fileData?: string; status: 'received' | 'rejected'; }
interface AttendanceRecord { id: string; date: string; type: 'family' | 'choir'; targetId: string; targetName: string; count: number; }

export default function SabbathSchoolDashboard() {
  const [lang, setLang] = React.useState<"en" | "rw" | "fr">("en")
  const [activeTab, setActiveTab] = React.useState<"families" | "attendance" | "reports" | "letters">("families")
  const [families, setFamilies] = React.useState<Family[]>([])
  const [choirs, setChoirs] = React.useState<any[]>([])
  const [attendance, setAttendance] = React.useState<AttendanceRecord[]>([])
  const [letters, setLetters] = React.useState<SabbathLetter[]>([])
  const [selectedDate, setSelectedDate] = React.useState(new Date().toISOString().split('T')[0])

  const [editingFamily, setEditingFamily] = React.useState<Family | null>(null)
  const [isFamilyModalOpen, setIsFamilyModalOpen] = React.useState(false)
  const [familyFormData, setFamilyFormData] = React.useState({ name: "", pere: "", mere: "", memberCount: 2 })

  const [editingLetter, setEditingLetter] = React.useState<SabbathLetter | null>(null)
  const [isLetterModalOpen, setIsLetterModalOpen] = React.useState(false)
  const [letterFormData, setLetterFormData] = React.useState<Partial<SabbathLetter>>({ name: "", originChurch: "", district: "", field: "", fileName: "", status: "received" })

const loadData = async () => {
  const year = getYear()

  try {
    const dbFamilies = await getFamilies(year)
    setFamilies(dbFamilies || [])

    const dbAttendance = await getAttendance(year)
    setAttendance(dbAttendance || [])

    const dbLetters = await getLetters(year)
    setLetters(dbLetters || [])

    const dbChoirs = await getChoirs(year)
    setChoirs(
      dbChoirs?.length
        ? dbChoirs
        : [
            { id: "c1", name: "Calvary Memory" },
            { id: "c2", name: "New heritage" },
            { id: "c3", name: "Morning stars" },
            { id: "c4", name: "Sauti ya huruma" },
          ]
    )
  } catch (err) {
    console.error("DB load error:", err)
  }
}

  React.useEffect(() => {
    const updateLang = () => setLang((localStorage.getItem("app_lang") || "en") as "en" | "rw" | "fr")
    updateLang()
    loadData()

    window.addEventListener("lang-change", updateLang)
    window.addEventListener("year-changed", loadData)
    window.addEventListener("storage", loadData)

    return () => {
      window.removeEventListener("lang-change", updateLang)
      window.removeEventListener("year-changed", loadData)
      window.removeEventListener("storage", loadData)
    }
  }, [])


const saveAttendance = async (newAttendance: AttendanceRecord[]) => {
  setAttendance(newAttendance)

  try {
    for (const record of newAttendance) {
      await saveAttendanceRecord({
        ...record,
        year: getYear(),
      })
    }
  } catch (err) {
    console.error("Failed saving attendance:", err)
  }
}
const updateAttendance = async (
  type: "family" | "choir",
  id: string,
  name: string,
  count: number
) => {
  const year = getYear()

  const existing = attendance.find(
    a =>
      a.date === selectedDate &&
      a.targetId === id &&
      a.type === type
  )

  const updated: AttendanceRecord[] = existing
    ? attendance.map(a =>
        a.id === existing.id ? { ...a, count } : a
      )
    : [
        ...attendance,
        {
          id: generateId(),
          date: selectedDate,
          type,
          targetId: id,
          targetName: name,
          count,
        },
      ]

  setAttendance(updated)

  // sync DB
  try {
    const record = updated.find(
      a => a.targetId === id && a.date === selectedDate && a.type === type
    )

    if (record) {
      await saveAttendanceRecord({
        ...record,
        year,
      })
    }
  } catch (err) {
    console.error(err)
  }
}

  const saveLetters = async (newLetters: SabbathLetter[]) => {
  setLetters(newLetters)

  try {
    for (const letter of newLetters) {
      await saveLetter({
        ...letter,
        year: getYear(),
      })
    }
  } catch (err) {
    console.error("Failed saving letters:", err)
  }
}
const pdfBlob = doc.output("datauristring")

const newReport = {
  id: generateId(),
  title: "Sabbath Service Attendance",
  date,
  type: "attendance",
  total,
  pdfData: pdfBlob,
  status: "submitted",
  year: getYear(),
}

const generateDailyPDF = async (date: string) => {
  const newReport = {
    id: Math.random().toString(36).substr(2, 9),
    title: "Sabbath Service",
    date,
    attendance: 20,
    status: "Submitted",
    type: "Attendance",
  }

  try {
    await saveReport(newReport)
  } catch (err) {
    console.error("Failed to sync report:", err)
  }

  // rest of your PDF code continues here...
}
  const t = sslTranslations[lang === "rw" ? "en" : lang]


  const handleSaveLetter = () => {
    if (!letterFormData.name || !letterFormData.originChurch) {
      alert("Please fill in Member Name and Origin Church.")
      return
    }
    const newLetter = {
      id: editingLetter ? editingLetter.id : Math.random().toString(36).substr(2, 9),
      name: letterFormData.name!,
      originChurch: letterFormData.originChurch!,
      district: letterFormData.district || "",
      field: letterFormData.field || "",
      fileName: letterFormData.fileName || "letter.pdf",
      fileData: letterFormData.fileData,
      status: letterFormData.status || "received"
    } as SabbathLetter

    if (editingLetter) saveLetters(letters.map(l => l.id === editingLetter.id ? newLetter : l))
    else saveLetters([...letters, newLetter])
    
    setIsLetterModalOpen(false); setLetterFormData({ name: "", originChurch: "", district: "", field: "", fileName: "", fileData: "", status: "received" }); setEditingLetter(null)
  }

  const downloadFile = (letter: SabbathLetter) => {
    if (!letter.fileData) {
      alert("No file data found for this letter.")
      return
    }
    const link = document.createElement("a")
    link.href = letter.fileData
    link.download = letter.fileName
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const deleteLetter = (id: string) => {
    if (confirm(`${t.confirmDel} letter?`)) saveLetters(letters.filter(l => l.id !== id))
  }

  const openEditLetter = (letter: SabbathLetter) => {
    setEditingLetter(letter); setLetterFormData(letter); setIsLetterModalOpen(true)
  }
const generateDailyPDF = async (date: string) => {
  if (!selectedYear) {
    alert(lang === 'fr'
      ? "Veuillez sélectionner une année d'église !"
      : "Please select a church year!"
    )
    return
  }
  const newReport = {
    id: Math.random().toString(36).substr(2, 9),
    title: "Sabbath Service",
    date: date,
    attendance: 20,
    status: "Submitted",
    type: "Attendance",
  }

  try {
    await saveReport(newReport)
  } catch (err) {
    console.error("Failed to sync report:", err)
  }

  // continue PDF logic...
}


    const dayAtt = attendance.filter(a => a.date === date)
    if (dayAtt.length === 0) {
      alert(t.noData)
      return
    }

    const doc = new jsPDF()
    const fTotal = dayAtt.filter(a => a.type === 'family').reduce((acc, curr) => acc + curr.count, 0)
    const cTotal = dayAtt.filter(a => a.type === 'choir').reduce((acc, curr) => acc + curr.count, 0)
    const total = fTotal + cTotal

    doc.setFontSize(20)
    doc.setTextColor(79, 70, 229)
    doc.text("ASA-UNIK Attendance Report", 105, 20, { align: "center" })
    
    doc.setFontSize(14)
    doc.setTextColor(0, 0, 0)
    doc.setFont("helvetica", "bold")
    doc.text(`${t.dateLabel}: ${date}`, 15, 40)
    
    doc.setFontSize(11)
    doc.setFont("helvetica", "normal")
    doc.text(`${t.families}: ${fTotal}`, 15, 50)
    doc.text(`${t.choirs}: ${cTotal}`, 75, 50)
    doc.setFont("helvetica", "bold")
    doc.text(`${t.total}: ${total}`, 140, 50)

    autoTable(doc, { 
      startY: 60, 
      head: [[t.name, t.type, t.count]], 
      body: dayAtt.map(a => [a.targetName, a.type.charAt(0).toUpperCase() + a.type.slice(1), a.count.toString()]),
      headStyles: { fillColor: [79, 70, 229] }
    })

    doc.save(`Attendance_Report_at_${date}.pdf`)

    // Synchronize with Elder
    const newReport = {
      id: Math.random().toString(36).substr(2, 9),
      title: "Sabbath Service",
      date: date,
      attendance: total,
      status: "Submitted",
      type: "Attendance",
      pdfUrl: "#" // Placeholder since we can't store real PDF in localStorage
    }

const generateDailyPDF = async (date: string) => {
  const newReport = {
    id: Math.random().toString(36).substr(2, 9),
    title: "Sabbath Service",
    date: date,
    attendance: 20,
    status: "Submitted",
    type: "Attendance",
  }

  try {
    await saveReport(newReport)
  } catch (err) {
    console.error("Failed to sync report:", err)
  }

  // continue PDF generation here...
}
  const generatePDF = () => {
    const selectedYear = localStorage.getItem("selected_year")
    if (!selectedYear) {
      alert(lang === 'fr' ? 'Veuillez sélectionner une année d\'église !' : 'Please select a church year!')
      return
    }
    const allDates = Array.from(new Set(attendance.map(a => a.date))).sort()
    if (allDates.length === 0) {
      alert(t.noData)
      return
    }

    const doc = new jsPDF()
    let currentY = 20

    // 1. Daily Attendance Details (Listed first)
    doc.setFontSize(20)
    doc.setTextColor(79, 70, 229)
    doc.text("ASA-RP Ngoma College Attendance Report", 105, currentY, { align: "center" })
    currentY += 15

    allDates.forEach((date, index) => {
      const dayAtt = attendance.filter(a => a.date === date)
      const fTotal = dayAtt.filter(a => a.type === 'family').reduce((acc, curr) => acc + curr.count, 0)
      const cTotal = dayAtt.filter(a => a.type === 'choir').reduce((acc, curr) => acc + curr.count, 0)
      const total = fTotal + cTotal

      // Check for page overflow
      if (currentY > 230) {
        doc.addPage()
        currentY = 20
      }

      doc.setFontSize(14)
      doc.setTextColor(0, 0, 0)
      doc.setFont("helvetica", "bold")
      doc.text(`${t.dateLabel}: ${date}`, 15, currentY)
      currentY += 8
      
      doc.setFontSize(10)
      doc.setFont("helvetica", "normal")
      doc.text(`${t.families}: ${fTotal}  |  ${t.choirs}: ${cTotal}  |  ${t.total}: ${total}`, 15, currentY)
      currentY += 5

      autoTable(doc, { 
        startY: currentY, 
        head: [[t.name, t.type, t.count]], 
        body: dayAtt.map(a => [a.targetName, a.type.charAt(0).toUpperCase() + a.type.slice(1), a.count.toString()]),
        headStyles: { fillColor: [79, 70, 229] },
        margin: { left: 15 },
        theme: 'striped'
      })
      
      currentY = (doc as any).lastAutoTable.finalY + 15
    })

    // 2. Global Summary Page (Last Page)
    doc.addPage()
    let totalFamiliesSum = 0
    let totalChoirsSum = 0
    
    allDates.forEach(date => {
      const dayAtt = attendance.filter(a => a.date === date)
      totalFamiliesSum += dayAtt.filter(a => a.type === 'family').reduce((acc, curr) => acc + curr.count, 0)
      totalChoirsSum += dayAtt.filter(a => a.type === 'choir').reduce((acc, curr) => acc + curr.count, 0)
    })
    
    const avgFamilies = (totalFamiliesSum / allDates.length).toFixed(1)
    const avgChoirs = (totalChoirsSum / allDates.length).toFixed(1)
    const avgTotal = ((totalFamiliesSum + totalChoirsSum) / allDates.length).toFixed(1)

    doc.setFontSize(22)
    doc.setTextColor(79, 70, 229)
    doc.text("ASA RP Ngoma College Attendance Report", 105, 20, { align: "center" })
    
    doc.setFontSize(16)
    doc.setTextColor(0, 0, 0)
    doc.text("Global Average Participation", 15, 40)
    
    doc.setFontSize(12)
    doc.text(`Total Number of Days Recorded: ${allDates.length}`, 15, 50)
    
    autoTable(doc, {
      startY: 55,
      head: [['Category', 'Average Presence']],
      body: [
        ['Family Members', avgFamilies],
        ['Choir Members', avgChoirs],
        ['Overall Average', avgTotal]
      ],
      headStyles: { fillColor: [79, 70, 229] },
      theme: 'grid'
    })

    doc.save(`Attendance_Report_${new Date().toISOString().split('T')[0]}.pdf`)
    alert(t.sentMsg)
  }

const handleSaveFamily = async () => {
  if (!familyFormData.name || !familyFormData.pere || !familyFormData.mere) {
    alert("Please fill in Family Name, Pere, and Mere.")
    return
  }

  const year =
    localStorage.getItem("selected_year") ||
    new Date().getFullYear().toString()

  const result = await saveFamily({
    id: editingFamily?.id,
    name: familyFormData.name,
    pere: familyFormData.pere,
    mere: familyFormData.mere,
    memberCount: familyFormData.memberCount,
    year,
  })

  if (!result.success) {
    alert(result.error)
    return
  }

  await loadData()

  setIsFamilyModalOpen(false)

  setFamilyFormData({
    name: "",
    pere: "",
    mere: "",
    memberCount: 2,
  })

  setEditingFamily(null)
}

  const deleteFamilyHandler = async (id: string) => {
  if (!confirm(`${t.confirmDel} family?`)) return

  await deleteFamily(id)

  await loadData()
}
  const openEditFamily = (family: Family) => {
    setEditingFamily(family); setFamilyFormData({ name: family.name, pere: family.pere, mere: family.mere, memberCount: family.memberCount }); setIsFamilyModalOpen(true)
  }

  const currentDayAttendance = attendance.filter(a => a.date === selectedDate)

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <YearSelector />
      <div className="flex justify-between items-center">
        <div><h2 className="text-3xl font-bold">{t.title}</h2><p className="text-muted-foreground">{t.subtitle}</p></div>
        <div className="flex gap-2">
          {activeTab === 'families' && <Button onClick={() => { setEditingFamily(null); setFamilyFormData({ name: "", pere: "", mere: "", memberCount: 2 }); setIsFamilyModalOpen(true) }}>{t.addFamily}</Button>}
          {activeTab === 'letters' && <Button onClick={() => { setEditingLetter(null); setLetterFormData({ name: "", originChurch: "", district: "", field: "", fileName: "", status: "received" }); setIsLetterModalOpen(true) }} className="gap-2"><Plus className="h-4 w-4" /> {t.addLetter}</Button>}
          {activeTab === 'attendance' && <Button variant="outline" className="border-primary text-primary" onClick={() => setActiveTab("reports")}>{t.tabRep}</Button>}
        </div>
      </div>

      <div className="flex border-b overflow-x-auto">
        {["families", "attendance", "reports", "letters"].map(tab => (
          <button key={tab} className={cn("px-4 py-2 text-sm font-medium border-b-2 transition-colors whitespace-nowrap", activeTab === tab ? "border-primary text-primary" : "border-transparent text-muted-foreground")} onClick={() => setActiveTab(tab as any)}>
            {tab === "families" ? t.tabFamily : tab === "attendance" ? t.tabAtt : tab === "reports" ? t.tabRep : t.tabLetter}
          </button>
        ))}
      </div>

      {activeTab === 'families' && (
        <div className="rounded-md border bg-card overflow-auto">
          <table className="w-full text-sm">
            <thead className="border-b bg-muted/50">
              <tr>
                <th className="h-12 px-4 text-left font-medium">{t.famName}</th>
                <th className="h-12 px-4 text-left font-medium">{t.pere}</th>
                <th className="h-12 px-4 text-left font-medium">{t.mere}</th>
                <th className="h-12 px-4 text-left font-medium">{t.maxMem}</th>
                <th className="h-12 px-4 text-right font-medium">{t.actions}</th>
              </tr>
            </thead>
            <tbody>
              {families.map(family => (
                <tr key={family.id} className="border-b hover:bg-muted/50 transition-colors">
                  <td className="p-4 font-medium">{family.name}</td><td className="p-4">{family.pere}</td><td className="p-4">{family.mere}</td><td className="p-4">{family.memberCount}</td>
                  <td className="p-4 text-right space-x-1">
                    <Button variant="ghost" size="icon" onClick={() => openEditFamily(family)}><Pencil className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" className="text-destructive"onClick={() => deleteFamilyHandler(family.id)}><Trash2 className="h-4 w-4" /></Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'attendance' && (
        <div className="space-y-4">
          <div className="bg-muted/50 p-4 rounded-lg flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex gap-4 items-center">
              <Label>{t.selDate}</Label>
              <Input type="date" className="w-40" value={selectedDate} onChange={e => setSelectedDate(e.target.value)} />
            </div>
            <div className="flex items-center gap-4">
              <div className="font-bold">{t.total}: {currentDayAttendance.reduce((acc, c) => acc + c.count, 0)}</div>
              <Button 
                variant="outline" 
                size="sm" 
                className="gap-2 border-primary text-primary hover:bg-primary hover:text-white"
                onClick={() => generateDailyPDF(selectedDate)}
              >
                <FileText className="h-4 w-4" /> {t.genPDF}
              </Button>
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h3 className="font-bold flex items-center gap-2"><Users2 className="h-5 w-5" /> {t.families}</h3>
              <div className="border rounded-lg divide-y bg-card">
                {families.map(f => (
                  <div key={f.id} className="p-3 flex justify-between items-center">
                    <div><p className="text-sm font-medium">{f.name}</p><p className="text-xs text-muted-foreground">Max: {f.memberCount}</p></div>
                    <div className="flex gap-2 items-center"><span className="text-xs">{t.att}:</span><Input type="number" className="w-16 h-8" value={attendance.find(a => a.targetId === f.id && a.date === selectedDate)?.count || 0} onChange={e => updateAttendance('family', f.id, f.name, parseInt(e.target.value) || 0)} /></div>
                  </div>
                ))}
              </div>
            </div>
            <div className="space-y-3">
              <h3 className="font-bold flex items-center gap-2"><Music className="h-5 w-5" /> {t.choirs}</h3>
              <div className="border rounded-lg divide-y bg-card">
                {choirs.map(c => (
                  <div key={c.id} className="p-3 flex justify-between items-center">
                    <p className="text-sm font-medium">{c.name}</p>
                    <div className="flex gap-2 items-center"><span className="text-xs">{t.att}:</span><Input type="number" className="w-16 h-8" value={attendance.find(a => a.targetId === c.id && a.date === selectedDate)?.count || 0} onChange={e => updateAttendance('choir', c.id, c.name, parseInt(e.target.value) || 0)} /></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'reports' && (
        <div className="space-y-6">
          <div className="bg-muted/50 p-6 rounded-xl border flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-primary font-semibold"><Calendar className="h-5 w-5" /> {t.summary}</div>
              <div className="flex items-center gap-4">
                <Label>{t.selDate}:</Label>
                <Input type="date" className="w-40 h-9" value={selectedDate} onChange={e => setSelectedDate(e.target.value)} />
              </div>
            </div>
            <Button size="lg" className="gap-2 px-8 shadow-lg shadow-primary/20" onClick={generatePDF}>
              <Download className="h-5 w-5" /> {t.genPDF}
            </Button>
          </div>

          {currentDayAttendance.length > 0 ? (
            <div className="grid gap-6">
              <div className="grid md:grid-cols-3 gap-4">
                <div className="p-4 border rounded-lg bg-card text-center">
                  <p className="text-sm text-muted-foreground">{t.families}</p>
                  <p className="text-2xl font-bold">{currentDayAttendance.filter(a => a.type === 'family').reduce((acc, c) => acc + c.count, 0)}</p>
                </div>
                <div className="p-4 border rounded-lg bg-card text-center">
                  <p className="text-sm text-muted-foreground">{t.choirs}</p>
                  <p className="text-2xl font-bold">{currentDayAttendance.filter(a => a.type === 'choir').reduce((acc, c) => acc + c.count, 0)}</p>
                </div>
                <div className="p-4 border rounded-lg bg-primary text-primary-foreground text-center">
                  <p className="text-sm opacity-90">{t.total}</p>
                  <p className="text-2xl font-bold">{currentDayAttendance.reduce((acc, c) => acc + c.count, 0)}</p>
                </div>
              </div>

              <div className="rounded-md border bg-card">
                <table className="w-full text-sm">
                  <thead className="border-b bg-muted/50">
                    <tr><th className="p-3 text-left">{t.name}</th><th className="p-3 text-left">{t.type}</th><th className="p-3 text-right">{t.count}</th></tr>
                  </thead>
                  <tbody>
                    {currentDayAttendance.map(a => (
                      <tr key={a.id} className="border-b transition-colors hover:bg-muted/30">
                        <td className="p-3">{a.targetName}</td>
                        <td className="p-3 uppercase text-[10px] font-bold tracking-wider">{a.type === 'family' ? t.families : t.choirs}</td>
                        <td className="p-3 text-right font-medium">{a.count}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="h-40 flex flex-col items-center justify-center border-2 border-dashed rounded-xl text-muted-foreground">
              <FileText className="h-10 w-10 mb-2 opacity-20" />
              <p>{t.noData}</p>
            </div>
          )}
        </div>
      )}

      {activeTab === 'letters' && (
        <div className="rounded-md border bg-card overflow-auto">
          <table className="w-full text-sm">
            <thead className="border-b bg-muted/50">
              <tr>
                <th className="h-12 px-4 text-left font-medium">No.</th>
                <th className="h-12 px-4 text-left font-medium">{t.name}</th>
                <th className="h-12 px-4 text-left font-medium">{t.origin}</th>
                <th className="h-12 px-4 text-left font-medium">{t.district} / {t.field}</th>
                <th className="h-12 px-4 text-left font-medium">{t.files}</th>
                <th className="h-12 px-4 text-left font-medium">{t.status}</th>
                <th className="h-12 px-4 text-right font-medium">{t.actions}</th>
              </tr>
            </thead>
            <tbody>
              {letters.map((letter, index) => (
                <tr key={letter.id} className="border-b hover:bg-muted/50 transition-colors">
                  <td className="p-4">{index + 1}</td>
                  <td className="p-4 font-medium">{letter.name}</td>
                  <td className="p-4">{letter.originChurch}</td>
                  <td className="p-4">{letter.district} / {letter.field}</td>
                  <td className="p-4">
                    <div 
                      className="flex items-center gap-1 text-xs text-primary cursor-pointer hover:underline" 
                      onClick={() => downloadFile(letter)}
                    >
                      <FileText className="h-3 w-3" /> {letter.fileName}
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={cn("px-2 py-1 rounded-full text-[10px] font-bold uppercase", letter.status === 'received' ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700")}>
                      {letter.status === 'received' ? t.received : t.rejected}
                    </span>
                  </td>
                  <td className="p-4 text-right space-x-1">
                    <Button variant="ghost" size="icon" onClick={() => openEditLetter(letter)}><Pencil className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" className="text-destructive" onClick={() => deleteLetter(letter.id)}><Trash2 className="h-4 w-4" /></Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {isFamilyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md bg-background p-6 rounded-lg shadow-xl space-y-4">
            <div className="flex justify-between items-center border-b pb-2"><h3 className="text-lg font-bold">{editingFamily ? t.update : t.addFamily}</h3><Button variant="ghost" size="sm" onClick={() => setIsFamilyModalOpen(false)}><X className="h-4 w-4" /></Button></div>
            <div className="grid gap-4">
              <div className="grid gap-2"><Label>{t.famName}</Label><Input value={familyFormData.name} onChange={e => setFamilyFormData({...familyFormData, name: e.target.value})} /></div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2"><Label>{t.pere}</Label><Input value={familyFormData.pere} onChange={e => setFamilyFormData({...familyFormData, pere: e.target.value})} /></div>
                <div className="grid gap-2"><Label>{t.mere}</Label><Input value={familyFormData.mere} onChange={e => setFamilyFormData({...familyFormData, mere: e.target.value})} /></div>
              </div>
              <div className="grid gap-2"><Label>{t.maxMem}</Label><Input type="number" value={familyFormData.memberCount} onChange={e => setFamilyFormData({...familyFormData, memberCount: parseInt(e.target.value) || 2})} /></div>
              <Button className="w-full" onClick={handleSaveFamily}>{editingFamily ? t.update : t.save}</Button>
            </div>
          </div>
        </div>
      )}

      {isLetterModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md bg-background p-6 rounded-lg shadow-xl space-y-4">
            <div className="flex justify-between items-center border-b pb-2"><h3 className="text-lg font-bold">{editingLetter ? t.update : t.addLetter}</h3><Button variant="ghost" size="sm" onClick={() => setIsLetterModalOpen(false)}><X className="h-4 w-4" /></Button></div>
            <div className="grid gap-4">
              <div className="grid gap-2"><Label>{t.name}</Label><Input value={letterFormData.name} onChange={e => setLetterFormData({...letterFormData, name: e.target.value})} /></div>
              <div className="grid gap-2"><Label>{t.origin}</Label><Input value={letterFormData.originChurch} onChange={e => setLetterFormData({...letterFormData, originChurch: e.target.value})} /></div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2"><Label>{t.district}</Label><Input value={letterFormData.district} onChange={e => setLetterFormData({...letterFormData, district: e.target.value})} /></div>
                <div className="grid gap-2"><Label>{t.field}</Label><Input value={letterFormData.field} onChange={e => setLetterFormData({...letterFormData, field: e.target.value})} /></div>
              </div>
              <div className="grid gap-2">
                <Label>{t.upload}</Label>
                <div className="flex items-center gap-2">
                  <Input 
                    type="file" 
                    className="text-xs" 
                    onChange={e => {
                      const file = e.target.files?.[0]
                      if (file) {
                        const reader = new FileReader()
                        reader.onload = (event) => {
                          setLetterFormData({
                            ...letterFormData, 
                            fileName: file.name, 
                            fileData: event.target?.result as string
                          })
                        }
                        reader.readAsDataURL(file)
                      }
                    }} 
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label>{t.status}</Label>
                <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={letterFormData.status} onChange={e => setLetterFormData({...letterFormData, status: e.target.value as any})}>
                  <option value="received">{t.received}</option>
                  <option value="rejected">{t.rejected}</option>
                </select>
              </div>
              <Button className="w-full" onClick={handleSaveLetter}>{editingLetter ? t.update : t.save}</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
