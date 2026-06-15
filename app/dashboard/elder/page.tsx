"use client"

import * as React from "react"
import { 
  ShieldCheck, 
  Users, 
  Search, 
  Plus, 
  Edit, 
  Trash2, 
  FileText, 
  Settings,
  Calendar,
  TrendingUp,
  Lock,
  Unlock,
  CheckCircle2,
  XCircle,
  Megaphone,
  Bell,
  Upload,
  Globe,
  UserPlus,
  Church,
  Download,
  Key
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { YearSelector } from "@/components/year-selector"
import { cn } from "@/lib/utils"
import { jsPDF } from "jspdf"
import autoTable from "jspdf-autotable"

interface Member {
  id: string
  name: string
  email: string
  address: string
  telephone: string
  baptismDate: string
  pastor: string
  churchElder: string
}

interface UserAccount {
  id: string
  firstName: string
  lastName: string
  role: string
  email: string
  allowedYears: string[]
}

interface WeekOfPrayer {
  id: string
  preacher: string
  choirInvited: string
  date: string
}

interface WeeklyProgram {
  id: string
  day: string
  preacherName: string
  prayer: string
  coordinator: string
}

interface WeeklyChoir {
  id: string
  day: string
  choirName: string
}

interface Announcement {
  id: string
  title: string
  content: string
  type: "Announcement" | "Event" | "News"
  date: string
  published: boolean
  fileName?: string
  fileData?: string
}

export default function ElderDashboard() {
  const [members, setMembers] = React.useState<Member[]>([])
  const [councilMembers, setCouncilMembers] = React.useState<any[]>([])
  const [syncedReports, setSyncedReports] = React.useState<any[]>([])
  const [announcements, setAnnouncements] = React.useState<Announcement[]>([])
  const [searchQuery, setSearchQuery] = React.useState("")
  const [isAddingMember, setIsAddingMember] = React.useState(false)
  const [editingMember, setEditingMember] = React.useState<Member | null>(null)
  const [isAddingAnnouncement, setIsAddingAnnouncement] = React.useState(false)
  const [editingAnnouncement, setEditingAnnouncement] = React.useState<Announcement | null>(null)
  const [blockLogin, setBlockLogin] = React.useState(false)
  const [blockRegister, setBlockRegister] = React.useState(false)
  const [restrictNewAccounts, setRestrictNewAccounts] = React.useState(false)
  const [restrictOldAccounts, setRestrictOldAccounts] = React.useState(false)
  const [availableYears, setAvailableYears] = React.useState<string[]>(["2024-2025"])
  const [blockedYears, setBlockedYears] = React.useState<string[]>([])
  const [newYear, setNewYear] = React.useState("")
  const [selectedReport, setSelectedReport] = React.useState<any>(null)

  const [users, setUsers] = React.useState<UserAccount[]>([])
  const [editingUser, setEditingUser] = React.useState<UserAccount | null>(null)
  const [userFormData, setUserFormData] = React.useState<{
    firstName: string;
    lastName: string;
    role: string;
    email: string;
    allowedYears?: string[];
  }>({ firstName: "", lastName: "", role: "", email: "", allowedYears: [] })

  const [weekOfPrayers, setWeekOfPrayers] = React.useState<WeekOfPrayer[]>([])
  const [isAddingWOP, setIsAddingWOP] = React.useState(false)
  const [wopFormData, setWopFormData] = React.useState({ preacher: "", choirInvited: "", date: "" })

  const [weeklyPrograms, setWeeklyPrograms] = React.useState<WeeklyProgram[]>([])
  const [isAddingProgram, setIsAddingProgram] = React.useState(false)
  const [programFormData, setProgramFormData] = React.useState({ day: "", preacherName: "", prayer: "", coordinator: "" })

  const [weeklyChoirs, setWeeklyChoirs] = React.useState<WeeklyChoir[]>([])
  const [isAddingChoir, setIsAddingChoir] = React.useState(false)
  const [choirFormData, setChoirFormData] = React.useState({ day: "", choirName: "" })

  const [generatedResetLink, setGeneratedResetLink] = React.useState<string | null>(null)

  const loadData = async () => {
    const year = localStorage.getItem('selected_year') || new Date().getFullYear().toString()

    try {
      const membersRes = await fetch(`/api/members?year=${year}`)
      if (membersRes.ok) {
        const data = await membersRes.json()
        setMembers(data.filter((m: any) => !m.isCouncil && !m.isDeacon && !m.isDeaconess))
        setCouncilMembers(data.filter((m: any) => m.isCouncil))
      }

      const announcementsRes = await fetch(`/api/announcements?year=${year}`)
      if (announcementsRes.ok) setAnnouncements(await announcementsRes.json())
    } catch (error) {
      console.error("Failed to load data:", error)
    }

    // Load synchronized reports (year-specific)
    const reports = localStorage.getItem(`church_reports_${year}`)
    setSyncedReports(reports ? JSON.parse(reports) : [])

    // Global config
    const config = localStorage.getItem("system_config")
    if (config) {
      try {
        const parsed = JSON.parse(config)
        setBlockLogin(!!parsed.blockLogin)
        setBlockRegister(!!parsed.blockRegister)
        setRestrictNewAccounts(!!parsed.restrictNewAccounts)
        setRestrictOldAccounts(!!parsed.restrictOldAccounts)
        if (parsed.availableYears) setAvailableYears(parsed.availableYears)
        if (parsed.blockedYears) setBlockedYears(parsed.blockedYears)
      } catch (e) {
        console.error("Error loading config", e)
      }
    }

    // Load year-specific feature data
    const savedUsers = localStorage.getItem("app_users")
    if (savedUsers) setUsers(JSON.parse(savedUsers))

    const savedWOP = localStorage.getItem(`week_of_prayers_${year}`)
    setWeekOfPrayers(savedWOP ? JSON.parse(savedWOP) : [])

    const savedPrograms = localStorage.getItem(`weekly_programs_${year}`)
    setWeeklyPrograms(savedPrograms ? JSON.parse(savedPrograms) : [])

    const savedChoirs = localStorage.getItem(`weekly_choirs_${year}`)
    setWeeklyChoirs(savedChoirs ? JSON.parse(savedChoirs) : [])
  }

  React.useEffect(() => {
    loadData()
    window.addEventListener("storage", loadData)
    window.addEventListener("year-changed", loadData)
    return () => {
      window.removeEventListener("storage", loadData)
      window.removeEventListener("year-changed", loadData)
    }
  }, [])

  const saveMembers = (newMembers: Member[]) => {
    const year = localStorage.getItem('selected_year') || new Date().getFullYear().toString()
    setMembers(newMembers)
    localStorage.setItem(`church_members_${year}`, JSON.stringify(newMembers))
  }

  const saveAnnouncements = (newAnnouncements: Announcement[]) => {
    const year = localStorage.getItem('selected_year') || new Date().getFullYear().toString()
    setAnnouncements(newAnnouncements)
    localStorage.setItem(`church_announcements_${year}`, JSON.stringify(newAnnouncements))
    // Trigger an event for other pages to update
    window.dispatchEvent(new Event("announcements-updated"))
  }

  const saveConfig = (login: boolean, register: boolean, years: string[], rna: boolean, roa: boolean, blocked: string[]) => {
    setBlockLogin(login)
    setBlockRegister(register)
    setAvailableYears(years)
    setRestrictNewAccounts(rna)
    setRestrictOldAccounts(roa)
    setBlockedYears(blocked)
    localStorage.setItem("system_config", JSON.stringify({ 
      blockLogin: login, 
      blockRegister: register,
      availableYears: years,
      restrictNewAccounts: rna,
      restrictOldAccounts: roa,
      blockedYears: blocked
    }))
    localStorage.setItem("block_login", login.toString())
    localStorage.setItem("block_register", register.toString())
    // Trigger event for navbar to update years
    window.dispatchEvent(new Event("storage"))
  }

  // --- User Accounts Logic ---
  const saveUsers = (newUsers: UserAccount[]) => {
    setUsers(newUsers)
    localStorage.setItem("app_users", JSON.stringify(newUsers))
  }

  const handleUpdateUser = (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingUser) return
    const updated = users.map(u => u.id === editingUser.id ? { ...u, ...userFormData } : u)
    saveUsers(updated)
    setEditingUser(null)
    setUserFormData({ firstName: "", lastName: "", role: "", email: "", allowedYears: [] })
  }

  const deleteUser = (id: string) => {
    if (confirm("Delete this user account?")) {
      saveUsers(users.filter(u => u.id !== id))
    }
  }

  const generateResetLink = (email: string) => {
    const link = `${window.location.origin}/reset-password?email=${encodeURIComponent(email)}`
    setGeneratedResetLink(link)
  }

  // --- Evangelism Logic ---
  const saveWOP = (data: WeekOfPrayer[]) => {
    setWeekOfPrayers(data)
    localStorage.setItem("week_of_prayers", JSON.stringify(data))
  }

  const handleAddWOP = (e: React.FormEvent) => {
    e.preventDefault()
    const newWOP: WeekOfPrayer = {
      id: Math.random().toString(36).substr(2, 9),
      ...wopFormData
    }
    saveWOP([...weekOfPrayers, newWOP])
    setIsAddingWOP(false)
    setWopFormData({ preacher: "", choirInvited: "", date: "" })
  }

  const savePrograms = (data: WeeklyProgram[]) => {
    setWeeklyPrograms(data)
    localStorage.setItem("weekly_programs", JSON.stringify(data))
  }

  const handleAddProgram = (e: React.FormEvent) => {
    e.preventDefault()
    const newProgram: WeeklyProgram = {
      id: Math.random().toString(36).substr(2, 9),
      ...programFormData
    }
    savePrograms([...weeklyPrograms, newProgram])
    setIsAddingProgram(false)
    setProgramFormData({ day: "", preacherName: "", prayer: "", coordinator: "" })
  }

  const saveChoirs = (data: WeeklyChoir[]) => {
    setWeeklyChoirs(data)
    localStorage.setItem("weekly_choirs", JSON.stringify(data))
  }

  const handleAddChoir = (e: React.FormEvent) => {
    e.preventDefault()
    const newChoir: WeeklyChoir = {
      id: Math.random().toString(36).substr(2, 9),
      ...choirFormData
    }
    saveChoirs([...weeklyChoirs, newChoir])
    setIsAddingChoir(false)
    setChoirFormData({ day: "", choirName: "" })
  }

  const generateChoirPDF = () => {
    const doc = new jsPDF()
    doc.text("Weekly Choir Schedule", 14, 15)
    
    const tableData = weeklyChoirs.map(c => [c.day, c.choirName])
    
    autoTable(doc, {
      head: [['Day', 'Choir Name']],
      body: tableData,
      startY: 20,
    })
    
    doc.save("weekly_choir_schedule.pdf")
  }

  const toggleBlockYear = (year: string) => {
    const isBlocked = blockedYears.includes(year)
    const updatedBlocked = isBlocked 
      ? blockedYears.filter(y => y !== year)
      : [...blockedYears, year]
    saveConfig(blockLogin, blockRegister, availableYears, restrictNewAccounts, restrictOldAccounts, updatedBlocked)
  }

  const handleAddYear = () => {
    if (newYear && !availableYears.includes(newYear)) {
      const updatedYears = [...availableYears, newYear]
      saveConfig(blockLogin, blockRegister, updatedYears, restrictNewAccounts, restrictOldAccounts, blockedYears)
      setNewYear("")
    }
  }

  const handleRemoveYear = (year: string) => {
    const updatedYears = availableYears.filter(y => y !== year)
    const updatedBlocked = blockedYears.filter(y => y !== year)
    saveConfig(blockLogin, blockRegister, updatedYears, restrictNewAccounts, restrictOldAccounts, updatedBlocked)
  }

  // --- Existing Logic ---
  const [formData, setFormData] = React.useState({
    name: "",
    email: "",
    address: "",
    telephone: "",
    baptismDate: "",
    pastor: "",
    churchElder: ""
  })

  const [announcementFormData, setAnnouncementFormData] = React.useState({
    title: "",
    content: "",
    type: "Announcement" as "Announcement" | "Event" | "News",
    date: new Date().toISOString().split('T')[0],
    published: false,
    fileName: "",
    fileData: ""
  })

  const handleAddMember = (e: React.FormEvent) => {
    e.preventDefault()
    const selectedYear = localStorage.getItem("selected_year")
    if (!selectedYear) {
      alert("Please select a church year in the navbar before adding members.")
      return
    }
    const newMember: Member = {
      id: Math.random().toString(36).substr(2, 9),
      ...formData
    }
    saveMembers([...members, newMember])
    setIsAddingMember(false)
    setFormData({ name: "", email: "", address: "", telephone: "", baptismDate: "", pastor: "", churchElder: "" })
  }

  const handleUpdateMember = (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingMember) return
    const updatedMembers = members.map(m => m.id === editingMember.id ? { ...editingMember, ...formData } : m)
    saveMembers(updatedMembers)
    setEditingMember(null)
    setFormData({ name: "", email: "", address: "", telephone: "", baptismDate: "", pastor: "", churchElder: "" })
  }

  const deleteMember = (id: string) => {
    if (confirm("Are you sure you want to delete this member?")) {
      saveMembers(members.filter(m => m.id !== id))
    }
  }

  const handleAddAnnouncement = (e: React.FormEvent) => {
    e.preventDefault()
    const selectedYear = localStorage.getItem("selected_year")
    if (!selectedYear) {
      alert("Please select a church year in the navbar before creating announcements.")
      return
    }
    const newAnnouncement: Announcement = {
      id: Math.random().toString(36).substr(2, 9),
      ...announcementFormData
    }
    saveAnnouncements([...announcements, newAnnouncement])
    setIsAddingAnnouncement(false)
    setAnnouncementFormData({
      title: "",
      content: "",
      type: "Announcement",
      date: new Date().toISOString().split('T')[0],
      published: false,
      fileName: "",
      fileData: ""
    })
  }

  const handleUpdateAnnouncement = (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingAnnouncement) return
    const updated = announcements.map(a => a.id === editingAnnouncement.id ? { ...editingAnnouncement, ...announcementFormData } : a)
    saveAnnouncements(updated)
    setEditingAnnouncement(null)
    setAnnouncementFormData({
      title: "",
      content: "",
      type: "Announcement",
      date: new Date().toISOString().split('T')[0],
      published: false,
      fileName: "",
      fileData: ""
    })
  }

  const deleteAnnouncement = (id: string) => {
    if (confirm("Are you sure you want to delete this announcement?")) {
      saveAnnouncements(announcements.filter(a => a.id !== id))
    }
  }

  const togglePublish = (id: string) => {
    const updated = announcements.map(a => a.id === id ? { ...a, published: !a.published } : a)
    saveAnnouncements(updated)
  }

  const startEditAnnouncement = (a: Announcement) => {
    setEditingAnnouncement(a)
    setAnnouncementFormData({
      title: a.title,
      content: a.content,
      type: a.type,
      date: a.date,
      published: a.published,
      fileName: a.fileName || "",
      fileData: a.fileData || ""
    })
  }

  const startEdit = (member: Member) => {
    setEditingMember(member)
    setFormData({
      name: member.name,
      email: member.email,
      address: member.address,
      telephone: member.telephone,
      baptismDate: member.baptismDate,
      pastor: member.pastor,
      churchElder: member.churchElder
    })
  }

  const filteredMembers = members.filter(m => 
    m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (m.pastor && m.pastor.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (m.churchElder && m.churchElder.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <YearSelector />
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Church Elder Dashboard</h2>
      </div>

      <Tabs defaultValue="members" className="space-y-4">
        <TabsList>
          <TabsTrigger value="members">Baptized Members</TabsTrigger>
          <TabsTrigger value="users">User Accounts</TabsTrigger>
          <TabsTrigger value="evangelism">Evangelism Dept</TabsTrigger>
          <TabsTrigger value="announcements">Announcements</TabsTrigger>
          <TabsTrigger value="council">Council</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
          <TabsTrigger value="config">System</TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold">Manage All User Accounts</h3>
          </div>

          {generatedResetLink && (
            <div className="p-4 bg-primary/10 border border-primary/20 rounded-lg space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium">Generated Reset Link:</p>
                <Button variant="ghost" size="sm" onClick={() => setGeneratedResetLink(null)}>
                  <XCircle className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex gap-2">
                <Input value={generatedResetLink} readOnly />
                <Button onClick={() => {
                  navigator.clipboard.writeText(generatedResetLink)
                  alert("Link copied to clipboard!")
                }}>Copy</Button>
              </div>
              <p className="text-xs text-muted-foreground">Give this link to the user to reset their password.</p>
            </div>
          )}

          {editingUser && (
            <div className="p-6 border rounded-xl bg-muted/30 space-y-4">
              <h3 className="text-lg font-bold">Edit User</h3>
              <form onSubmit={handleUpdateUser} className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                  <div className="grid gap-2">
                    <Label>First Name</Label>
                    <Input value={userFormData.firstName} onChange={(e) => setUserFormData({...userFormData, firstName: e.target.value})} required />
                  </div>
                  <div className="grid gap-2">
                    <Label>Last Name</Label>
                    <Input value={userFormData.lastName} onChange={(e) => setUserFormData({...userFormData, lastName: e.target.value})} required />
                  </div>
                  <div className="grid gap-2">
                    <Label>Role</Label>
                    <Input value={userFormData.role} onChange={(e) => setUserFormData({...userFormData, role: e.target.value})} placeholder="e.g. Secretary, Treasurer" required />
                  </div>
                  <div className="grid gap-2">
                    <Label>Email</Label>
                    <Input type="email" value={userFormData.email} onChange={(e) => setUserFormData({...userFormData, email: e.target.value})} required />
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button type="submit" className="px-8">Save Account</Button>
                  <Button variant="outline" type="button" onClick={() => { setEditingUser(null); setUserFormData({ firstName: "", lastName: "", role: "", email: "" }); }}>Cancel</Button>
                </div>
              </form>
            </div>
          )}

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Full Name</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.length > 0 ? (
                  users.map((u) => (
                    <TableRow key={u.id}>
                      <TableCell className="font-medium">{u.firstName} {u.lastName}</TableCell>
                      <TableCell>{u.role}</TableCell>
                      <TableCell>{u.email}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon" title="Generate Reset Link" onClick={() => generateResetLink(u.email)}>
                          <Key className="h-4 w-4 text-primary" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => { setEditingUser(u); setUserFormData(u); }}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="text-destructive" onClick={() => deleteUser(u.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow><TableCell colSpan={4} className="text-center py-4">No user accounts found.</TableCell></TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="evangelism" className="space-y-6">
          <div className="grid gap-6">
            {/* Week of Prayers */}
            <div className="space-y-4 p-6 border rounded-xl">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold flex items-center gap-2">
                  <Church className="h-5 w-5" /> Week of Prayers
                </h3>
                <Button size="sm" onClick={() => setIsAddingWOP(true)}>
                  <Plus className="h-4 w-4 mr-1" /> Add Program
                </Button>
              </div>
              
              {isAddingWOP && (
                <form onSubmit={handleAddWOP} className="grid gap-4 md:grid-cols-4 p-4 bg-muted/50 rounded-lg">
                  <div className="grid gap-1.5">
                    <Label>Preacher</Label>
                    <Input size={30} value={wopFormData.preacher} onChange={(e) => setWopFormData({...wopFormData, preacher: e.target.value})} required />
                  </div>
                  <div className="grid gap-1.5">
                    <Label>Choir Invited</Label>
                    <Input value={wopFormData.choirInvited} onChange={(e) => setWopFormData({...wopFormData, choirInvited: e.target.value})} required />
                  </div>
                  <div className="grid gap-1.5">
                    <Label>Date</Label>
                    <Input type="date" value={wopFormData.date} onChange={(e) => setWopFormData({...wopFormData, date: e.target.value})} required />
                  </div>
                  <div className="flex items-end gap-2">
                    <Button type="submit">Save</Button>
                    <Button variant="ghost" onClick={() => setIsAddingWOP(false)}>Cancel</Button>
                  </div>
                </form>
              )}

              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Preacher</TableHead>
                      <TableHead>Choir Invited</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {weekOfPrayers.map((w) => (
                      <TableRow key={w.id}>
                        <TableCell>{w.preacher}</TableCell>
                        <TableCell>{w.choirInvited}</TableCell>
                        <TableCell>{w.date}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="icon" className="text-destructive" onClick={() => saveWOP(weekOfPrayers.filter(x => x.id !== w.id))}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>

            {/* Weekly Schedules */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4 p-6 border rounded-xl">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold">Weekly Program Schedule</h3>
                  <Button size="sm" variant="outline" onClick={() => setIsAddingProgram(true)}>
                    <Plus className="h-4 w-4 mr-1" /> Add
                  </Button>
                </div>

                {isAddingProgram && (
                  <form onSubmit={handleAddProgram} className="grid gap-3 p-4 bg-muted/50 rounded-lg">
                    <div className="grid gap-1.5">
                      <Label>Day</Label>
                      <Input placeholder="e.g. Wednesday" value={programFormData.day} onChange={(e) => setProgramFormData({...programFormData, day: e.target.value})} required />
                    </div>
                    <div className="grid gap-1.5">
                      <Label>Preacher Name</Label>
                      <Input value={programFormData.preacherName} onChange={(e) => setProgramFormData({...programFormData, preacherName: e.target.value})} required />
                    </div>
                    <div className="grid gap-1.5">
                      <Label>Prayer</Label>
                      <Input value={programFormData.prayer} onChange={(e) => setProgramFormData({...programFormData, prayer: e.target.value})} required />
                    </div>
                    <div className="grid gap-1.5">
                      <Label>Coordinator</Label>
                      <Input value={programFormData.coordinator} onChange={(e) => setProgramFormData({...programFormData, coordinator: e.target.value})} required />
                    </div>
                    <div className="flex gap-2">
                      <Button type="submit" className="flex-1">Save</Button>
                      <Button variant="ghost" onClick={() => setIsAddingProgram(false)}>Cancel</Button>
                    </div>
                  </form>
                )}

                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Day</TableHead>
                        <TableHead>Preacher</TableHead>
                        <TableHead className="text-right">Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {weeklyPrograms.map((p) => (
                        <TableRow key={p.id}>
                          <TableCell>{p.day}</TableCell>
                          <TableCell>{p.preacherName}</TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="icon" className="text-destructive" onClick={() => savePrograms(weeklyPrograms.filter(x => x.id !== p.id))}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>

              <div className="space-y-4 p-6 border rounded-xl">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold">Weekly Choir Schedule</h3>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => setIsAddingChoir(true)}>
                      <Plus className="h-4 w-4 mr-1" /> Add
                    </Button>
                    <Button size="sm" variant="secondary" onClick={generateChoirPDF}>
                      <Download className="h-4 w-4 mr-1" /> PDF
                    </Button>
                  </div>
                </div>

                {isAddingChoir && (
                  <form onSubmit={handleAddChoir} className="grid gap-3 p-4 bg-muted/50 rounded-lg">
                    <div className="grid gap-1.5">
                      <Label>Day</Label>
                      <Input placeholder="e.g. Sabbath" value={choirFormData.day} onChange={(e) => setChoirFormData({...choirFormData, day: e.target.value})} required />
                    </div>
                    <div className="grid gap-1.5">
                      <Label>Choir Name</Label>
                      <Input value={choirFormData.choirName} onChange={(e) => setChoirFormData({...choirFormData, choirName: e.target.value})} required />
                    </div>
                    <div className="flex gap-2">
                      <Button type="submit" className="flex-1">Save</Button>
                      <Button variant="ghost" onClick={() => setIsAddingChoir(false)}>Cancel</Button>
                    </div>
                  </form>
                )}

                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Day</TableHead>
                        <TableHead>Choir</TableHead>
                        <TableHead className="text-right">Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {weeklyChoirs.map((c) => (
                        <TableRow key={c.id}>
                          <TableCell>{c.day}</TableCell>
                          <TableCell>{c.choirName}</TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="icon" className="text-destructive" onClick={() => saveChoirs(weeklyChoirs.filter(x => x.id !== c.id))}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="members" className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="relative w-72">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search members..." 
                className="pl-8" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button onClick={() => setIsAddingMember(true)}>
              <Plus className="mr-2 h-4 w-4" /> Add Member
            </Button>
          </div>

          {(isAddingMember || editingMember) && (
            <div className="p-6 border rounded-xl bg-muted/30 space-y-4">
              <h3 className="text-lg font-bold">{editingMember ? "Edit Member" : "Add New Baptized Member"}</h3>
              <form onSubmit={editingMember ? handleUpdateMember : handleAddMember} className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <div className="grid gap-2">
                  <Label htmlFor="name">Full Names</Label>
                  <Input id="name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} required />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="address">Address</Label>
                  <Input id="address" value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} required />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="telephone">Telephone</Label>
                  <Input id="telephone" value={formData.telephone} onChange={(e) => setFormData({...formData, telephone: e.target.value})} required />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="baptismDate">Baptism Date</Label>
                  <Input id="baptismDate" type="date" value={formData.baptismDate} onChange={(e) => setFormData({...formData, baptismDate: e.target.value})} required />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="pastor">Pastor</Label>
                  <Input id="pastor" value={formData.pastor} onChange={(e) => setFormData({...formData, pastor: e.target.value})} required />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="churchElder">Church Elder</Label>
                  <Input id="churchElder" value={formData.churchElder} onChange={(e) => setFormData({...formData, churchElder: e.target.value})} required />
                </div>
                <div className="flex items-end gap-2">
                  <Button type="submit">{editingMember ? "Update" : "Save"} Member</Button>
                  <Button variant="outline" type="button" onClick={() => {
                    setIsAddingMember(false)
                    setEditingMember(null)
                    setFormData({ name: "", email: "", address: "", telephone: "", baptismDate: "", pastor: "", churchElder: "" })
                  }}>Cancel</Button>
                </div>
              </form>
            </div>
          )}

          <div className="rounded-md border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Names</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Address</TableHead>
                  <TableHead>Telephone</TableHead>
                  <TableHead>Baptism Date</TableHead>
                  <TableHead>Pastor</TableHead>
                  <TableHead>Church Elder</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredMembers.length > 0 ? (
                  filteredMembers.map((member) => (
                    <TableRow key={member.id}>
                      <TableCell className="font-medium">{member.name}</TableCell>
                      <TableCell>{member.email}</TableCell>
                      <TableCell>{member.address}</TableCell>
                      <TableCell>{member.telephone}</TableCell>
                      <TableCell>{member.baptismDate}</TableCell>
                      <TableCell>{member.pastor}</TableCell>
                      <TableCell>{member.churchElder}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon" onClick={() => startEdit(member)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="text-destructive" onClick={() => deleteMember(member.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} className="h-24 text-center">
                      No members found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="announcements" className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold">Manage Announcements & Events</h3>
            <Button onClick={() => setIsAddingAnnouncement(true)}>
              <Plus className="mr-2 h-4 w-4" /> Create New
            </Button>
          </div>

          {(isAddingAnnouncement || editingAnnouncement) && (
            <div className="p-6 border rounded-xl bg-muted/30 space-y-4">
              <h3 className="text-lg font-bold">{editingAnnouncement ? "Edit" : "Create"} Announcement/Event</h3>
              <form onSubmit={editingAnnouncement ? handleUpdateAnnouncement : handleAddAnnouncement} className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="grid gap-2">
                    <Label htmlFor="atitle">Title</Label>
                    <Input 
                      id="atitle" 
                      value={announcementFormData.title} 
                      onChange={(e) => setAnnouncementFormData({...announcementFormData, title: e.target.value})} 
                      required 
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="type">Type</Label>
                    <select 
                      id="type"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      value={announcementFormData.type}
                      onChange={(e) => setAnnouncementFormData({...announcementFormData, type: e.target.value as any})}
                    >
                      <option value="Announcement">Announcement</option>
                      <option value="News">News</option>
                      <option value="Event">Event</option>
                    </select>
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="content">Content/Description</Label>
                  <textarea 
                    id="content"
                    className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    value={announcementFormData.content}
                    onChange={(e) => setAnnouncementFormData({...announcementFormData, content: e.target.value})}
                    required
                  />
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="grid gap-2">
                    <Label htmlFor="adate">Date</Label>
                    <Input 
                      id="adate" 
                      type="date"
                      value={announcementFormData.date} 
                      onChange={(e) => setAnnouncementFormData({...announcementFormData, date: e.target.value})} 
                      required 
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="file">Attach File (PDF/Image)</Label>
                    <div className="flex gap-2">
                      <Input 
                        id="file" 
                        type="file"
                        onChange={(e) => {
                          const file = e.target.files?.[0]
                          if (file) {
                            const reader = new FileReader()
                            reader.onload = (event) => {
                              setAnnouncementFormData({
                                ...announcementFormData, 
                                fileName: file.name,
                                fileData: event.target?.result as string
                              })
                            }
                            reader.readAsDataURL(file)
                          }
                        }}
                      />
                      {announcementFormData.fileName && (
                        <p className="text-xs text-muted-foreground self-center">Selected: {announcementFormData.fileName}</p>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button type="submit">{editingAnnouncement ? "Update" : "Publish"}</Button>
                  <Button variant="outline" type="button" onClick={() => {
                    setIsAddingAnnouncement(false)
                    setEditingAnnouncement(null)
                    setAnnouncementFormData({
                      title: "",
                      content: "",
                      type: "Announcement",
                      date: new Date().toISOString().split('T')[0],
                      published: false,
                      fileName: "",
                      fileData: ""
                    })
                  }}>Cancel</Button>
                </div>
              </form>
            </div>
          )}

          <div className="rounded-md border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Type</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>File</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {announcements.length > 0 ? (
                  announcements.map((a) => (
                    <TableRow key={a.id}>
                      <TableCell>
                        <span className={cn(
                          "px-2 py-1 rounded-full text-[10px] font-bold uppercase",
                          a.type === "Event" ? "bg-purple-100 text-purple-700" : 
                          a.type === "News" ? "bg-emerald-100 text-emerald-700" : 
                          "bg-blue-100 text-blue-700"
                        )}>
                          {a.type}
                        </span>
                      </TableCell>
                      <TableCell className="font-medium">{a.title}</TableCell>
                      <TableCell>{a.date}</TableCell>
                      <TableCell>
                        {a.fileName ? (
                          <div className="flex items-center text-xs text-muted-foreground">
                            <FileText className="mr-1 h-3 w-3" /> {a.fileName}
                          </div>
                        ) : "-"}
                      </TableCell>
                      <TableCell>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className={cn(
                            "h-7 px-2",
                            a.published ? "text-green-600 hover:text-green-700" : "text-amber-600 hover:text-amber-700"
                          )}
                          onClick={() => togglePublish(a.id)}
                        >
                          {a.published ? (
                            <><CheckCircle2 className="mr-1 h-3 w-3" /> Published</>
                          ) : (
                            <><Globe className="mr-1 h-3 w-3" /> Draft</>
                          )}
                        </Button>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon" onClick={() => startEditAnnouncement(a)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="text-destructive" onClick={() => deleteAnnouncement(a.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                      No announcements or events yet. Click "Create New" to get started.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="council" className="space-y-4">
          <div className="space-y-4">
            <h3 className="text-xl font-bold flex items-center">
              <Users className="mr-2 h-5 w-5" /> Church Council Members
            </h3>
            <p className="text-sm text-muted-foreground">Official leadership and department heads.</p>
            <div className="rounded-md border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Names</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Telephone</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {councilMembers.length > 0 ? (
                    councilMembers.map((member, i) => (
                      <TableRow key={member.id || i}>
                        <TableCell className="font-medium">{member.firstName} {member.lastName}</TableCell>
                        <TableCell>{member.position}</TableCell>
                        <TableCell>{member.email}</TableCell>
                        <TableCell>{member.phone}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4} className="h-24 text-center">
                        No council members found. They should be added by the Church Secretary.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          {selectedReport && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4">
              <div className="w-full max-w-lg bg-background rounded-xl shadow-2xl overflow-hidden border">
                <div className="p-6 border-b flex items-center justify-between">
                  <h3 className="text-xl font-bold">Report Details</h3>
                  <Button variant="ghost" size="icon" onClick={() => setSelectedReport(null)}>
                    <XCircle className="h-5 w-5" />
                  </Button>
                </div>
                <div className="p-6 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <Label className="text-xs text-muted-foreground uppercase">Title</Label>
                      <p className="font-medium">{selectedReport.title}</p>
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs text-muted-foreground uppercase">Date/Period</Label>
                      <p className="font-medium">{selectedReport.date || selectedReport.month}</p>
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs text-muted-foreground uppercase">Type</Label>
                      <p className="font-medium">{selectedReport.type}</p>
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs text-muted-foreground uppercase">Status</Label>
                      <p className="font-medium text-green-600">{selectedReport.status}</p>
                    </div>
                  </div>
                  <div className="pt-4 border-t">
                    <Label className="text-xs text-muted-foreground uppercase">Summary Information</Label>
                    <p className="mt-2 text-sm leading-relaxed">
                      {selectedReport.type === "Attendance" 
                        ? `A total of ${selectedReport.attendance} members attended the service. The program included Bible study, prayer groups, and a special testimonial session. No incidents were reported.` 
                        : `The total collection of ${selectedReport.total} includes Tithes, Local Offerings, and Thanksgiving. All funds have been counted, recorded, and deposited into the church account.`}
                    </p>
                  </div>
                  {selectedReport.pdfUrl && (
                    <div className="p-3 bg-muted rounded-lg flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <FileText className="h-5 w-5 text-primary" />
                        <span className="text-sm font-medium">{selectedReport.type}_Report_{selectedReport.date || selectedReport.month}.pdf</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-bold">PDF READY</span>
                        <Button size="sm" onClick={() => alert("PDF Download started... (Demo Only)")}>
                          View PDF
                        </Button>
                      </div>
                    </div>
                  )}
                  <div className="flex justify-end pt-4">
                    <Button onClick={() => setSelectedReport(null)}>Close</Button>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-4">
              <h3 className="text-lg font-bold flex items-center">
                <Calendar className="mr-2 h-5 w-5" /> Attendance Reports
              </h3>
              <div className="space-y-4">
                {syncedReports.filter(r => r.type === "Attendance").length > 0 ? (
                  syncedReports.filter(r => r.type === "Attendance").map((report, i) => (
                    <div key={report.id || i} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                      <div>
                        <p className="font-medium">{report.title} - {report.date}</p>
                        <p className="text-sm text-muted-foreground">Attendance: {report.attendance}</p>
                      </div>
                      <Button variant="outline" size="sm" onClick={() => setSelectedReport(report)}>View Details</Button>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-4 text-muted-foreground text-sm border rounded-lg border-dashed">No attendance reports yet.</div>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-bold flex items-center">
                <TrendingUp className="mr-2 h-5 w-5" /> Financial Reports
              </h3>
              <div className="space-y-4">
                {syncedReports.filter(r => r.type === "Financial").length > 0 ? (
                  syncedReports.filter(r => r.type === "Financial").map((report, i) => (
                    <div key={report.id || i} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                      <div>
                        <p className="font-medium">{report.title} - {report.month}</p>
                        <p className="text-sm text-muted-foreground">Total: {report.total}</p>
                      </div>
                      <Button variant="outline" size="sm" onClick={() => setSelectedReport(report)}>View Details</Button>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-4 text-muted-foreground text-sm border rounded-lg border-dashed">No financial reports yet.</div>
                )}
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="config" className="space-y-4">
          <div className="space-y-4">
            <h3 className="text-xl font-bold flex items-center">
              <Settings className="mr-2 h-5 w-5" /> System Configuration
            </h3>
            <p className="text-sm text-muted-foreground">Manage global access and system-wide settings.</p>
            
            <div className="grid gap-6">
              <div className="p-6 border rounded-xl space-y-4">
                <div className="space-y-1">
                  <Label className="text-base font-bold">Academic/Church Year Settings</Label>
                  <p className="text-sm text-muted-foreground">Add or remove years available for selection across the system.</p>
                </div>
                
                <div className="flex gap-2">
                  <Input 
                    placeholder="Ex: 2025-2026" 
                    value={newYear}
                    onChange={(e) => setNewYear(e.target.value)}
                    className="max-w-[200px]"
                  />
                  <Button onClick={handleAddYear}>
                    <Plus className="mr-2 h-4 w-4" /> Add Year
                  </Button>
                </div>

                <div className="flex flex-wrap gap-2 pt-2">
                  {availableYears.map((year) => (
                    <div key={year} className={cn(
                      "flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-colors",
                      blockedYears.includes(year) ? "bg-destructive/10 text-destructive border border-destructive/20" : "bg-muted text-muted-foreground"
                    )}>
                      {year}
                      <div className="flex items-center gap-1 ml-1 border-l pl-2 border-current/20">
                        <button 
                          onClick={() => toggleBlockYear(year)}
                          className="hover:text-primary transition-colors"
                          title={blockedYears.includes(year) ? "Unblock year" : "Block year"}
                        >
                          {blockedYears.includes(year) ? <Lock className="h-3.5 w-3.5" /> : <Unlock className="h-3.5 w-3.5" />}
                        </button>
                        <button 
                          onClick={() => handleRemoveYear(year)}
                          className="hover:text-destructive transition-colors"
                          title="Remove year"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                  {availableYears.length === 0 && (
                    <p className="text-sm text-muted-foreground italic">No years established yet.</p>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between p-6 border rounded-xl hover:bg-muted/10 transition-colors">
                <div className="space-y-0.5">
                  <Label className="text-base font-bold">Login Access</Label>
                  <p className="text-sm text-muted-foreground">
                    {blockLogin ? "Login is currently disabled for all users." : "Login is currently active."}
                  </p>
                </div>
                <Button 
                  variant={blockLogin ? "destructive" : "default"}
                  onClick={() => saveConfig(!blockLogin, blockRegister, availableYears, restrictNewAccounts, restrictOldAccounts, blockedYears)}
                  className="w-32"
                >
                  {blockLogin ? (
                    <><Lock className="mr-2 h-4 w-4" /> Blocked</>
                  ) : (
                    <><Unlock className="mr-2 h-4 w-4" /> Active</>
                  )}
                </Button>
              </div>

              <div className="flex items-center justify-between p-6 border rounded-xl hover:bg-muted/10 transition-colors">
                <div className="space-y-0.5">
                  <Label className="text-base font-bold">Registration Access</Label>
                  <p className="text-sm text-muted-foreground">
                    {blockRegister ? "New member registration is disabled." : "Registration is active."}
                  </p>
                </div>
                <Button 
                  variant={blockRegister ? "destructive" : "default"}
                  onClick={() => saveConfig(blockLogin, !blockRegister, availableYears, restrictNewAccounts, restrictOldAccounts, blockedYears)}
                  className="w-32"
                >
                  {blockRegister ? (
                    <><Lock className="mr-2 h-4 w-4" /> Blocked</>
                  ) : (
                    <><Unlock className="mr-2 h-4 w-4" /> Active</>
                  )}
                </Button>
              </div>

              <div className="flex items-center justify-between p-6 border rounded-xl hover:bg-muted/10 transition-colors bg-amber-50/30">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4 text-amber-600" />
                    <Label className="text-base font-bold">Previous Year Access</Label>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Block newly registered accounts from accessing years before their registration.
                  </p>
                </div>
                <Button 
                  variant={restrictNewAccounts ? "destructive" : "outline"}
                  onClick={() => saveConfig(blockLogin, blockRegister, availableYears, !restrictNewAccounts, restrictOldAccounts, blockedYears)}
                  className="w-32"
                >
                  {restrictNewAccounts ? "Restricted" : "Allowed"}
                </Button>
              </div>

              <div className="flex items-center justify-between p-6 border rounded-xl hover:bg-muted/10 transition-colors bg-amber-50/30">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4 text-amber-600" />
                    <Label className="text-base font-bold">Future Year Access</Label>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Block old accounts from accessing newly established years.
                  </p>
                </div>
                <Button 
                  variant={restrictOldAccounts ? "destructive" : "outline"}
                  onClick={() => saveConfig(blockLogin, blockRegister, availableYears, restrictNewAccounts, !restrictOldAccounts, blockedYears)}
                  className="w-32"
                >
                  {restrictOldAccounts ? "Restricted" : "Allowed"}
                </Button>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
