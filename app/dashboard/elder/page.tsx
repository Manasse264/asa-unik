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
  Key,
  Ban,
  Eye
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { 
  getWeeklyPrograms, saveWeeklyProgram, deleteWeeklyProgram,
  getChoirs, saveChoir, deleteChoir 
} from "@/lib/actions"
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

import { 
  getMembers, saveMember, deleteMember,
  getAnnouncements, saveAnnouncement, deleteAnnouncement,
  getSystemConfig, updateSystemConfig,
  getUsers, updateUser, deleteUser,
  getReports,
  getWeekOfPrayers, saveWeekOfPrayer, deleteWeekOfPrayer,
  getWeeklyChoirs, saveWeeklyChoir, deleteWeeklyChoir
} from "@/lib/actions"

interface Member {
  id: string
  firstName: string
  lastName: string
  email: string | null
  address: string | null
  phone: string | null
  baptismDate: string | null
  pastor: string | null
  churchElder: string | null
}

interface UserAccount {
  id: string
  firstName: string
  lastName: string
  role: string
  email: string
  allowedYears?: string[]
}

interface WeekOfPrayer {
  id: string
  title: string
  content: string | null
  date: string
}

interface WeeklyProgram {
  id: string
  day: string
  preacherName: string
  prayer: string | null     
  coordinator: string | null 
  year: string
}

interface WeeklyChoir {
  id: string
  name: string        
  leaderName: string  
  memberNames: string[]
  year: string
  createdAt: Date
  updatedAt: Date
}

interface Announcement {
  id: string
  title: string
  description: string
  type: string
  date: string
  published: boolean
  fileName?: string | null
  fileData?: string | null
}

export default function ElderDashboardClient() {
  const [members, setMembers] = React.useState<Member[]>([])
  const [councilMembers, setCouncilMembers] = React.useState<any[]>([])
  const [reports, setReports] = React.useState<any[]>([])
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
  const [wopFormData, setWopFormData] = React.useState({ title: "", content: "", date: "" })

  const [weeklyPrograms, setWeeklyPrograms] = React.useState<WeeklyProgram[]>([])
  const [isAddingProgram, setIsAddingProgram] = React.useState(false)
  const [programFormData, setProgramFormData] = React.useState({ day: "", preacherName: "", prayer: "", coordinator: "" })

  const [weeklyChoirs, setWeeklyChoirs] = React.useState<WeeklyChoir[]>([])
  const [isAddingChoir, setIsAddingChoir] = React.useState(false)
  const [choirFormData, setChoirFormData] = React.useState({ name: "", leaderName: "" })

  const [generatedResetLink, setGeneratedResetLink] = React.useState<string | null>(null)

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
    description: "",
    type: "Announcement" as "Announcement" | "Event" | "News",
    date: new Date().toISOString().split('T')[0],
    published: false,
    fileName: "",
    fileData: ""
  })

  const loadData = async () => {
    const year = localStorage.getItem('selected_year') || new Date().getFullYear().toString()

    const reportsData = await getReports(year)
    setReports(reportsData || [])

    const dbMembers = await getMembers(year)
    setMembers(
      dbMembers.filter(
        (m: any) =>
          m.isBaptized === true &&
          !m.isCouncil &&
          !m.isDeacon &&
          !m.isDeaconess
      )
    )
    setCouncilMembers(dbMembers.filter((m: any) => m.isCouncil))
    
    const dbAnnouncements = await getAnnouncements(year)
    const mappedAnnouncements = dbAnnouncements.map((a: any) => ({
      ...a,
      description: a.description || a.content || ""
    }))
    setAnnouncements(mappedAnnouncements)
    
    setUsers(await getUsers())
    const wops = await getWeekOfPrayers(year)
    setWeekOfPrayers(wops)
    
    setWeeklyPrograms(await getWeeklyPrograms(year))
    setWeeklyChoirs(await getWeeklyChoirs(year))

    const config = await getSystemConfig()
    if (config) {
      setBlockLogin(!!config.blockLogin)
      setBlockRegister(!!config.blockRegister)
      setRestrictNewAccounts(!!config.restrictNewAccounts)
      setRestrictOldAccounts(!!config.restrictOldAccounts)
      setAvailableYears(config.availableYears || ["2024-2025"])
      setBlockedYears(config.blockedYears || [])
    }
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

  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault()
    const year = localStorage.getItem("selected_year") || new Date().getFullYear().toString()
    
    const nameParts = formData.name.trim().split(" ")
    const firstName = nameParts[0] || ""
    const lastName = nameParts.slice(1).join(" ") || ""

    await saveMember({
      firstName,
      lastName,
      email: formData.email,
      address: formData.address,
      phone: formData.telephone,
      baptismDate: formData.baptismDate,
      pastor: formData.pastor,
      churchElder: formData.churchElder,
      year,
      isBaptized: true
    })
    
    setIsAddingMember(false)
    setFormData({ name: "", email: "", address: "", telephone: "", baptismDate: "", pastor: "", churchElder: "" })
    loadData()
  }

  const handleUpdateMember = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingMember) return
    
    const nameParts = formData.name.trim().split(" ")
    const firstName = nameParts[0] || ""
    const lastName = nameParts.slice(1).join(" ") || ""

    await saveMember({
      id: editingMember.id,
      firstName,
      lastName,
      email: formData.email,
      address: formData.address,
      phone: formData.telephone,
      baptismDate: formData.baptismDate,
      pastor: formData.pastor,
      churchElder: formData.churchElder,
      year: localStorage.getItem("selected_year") || new Date().getFullYear().toString()
    })
    
    setEditingMember(null)
    setFormData({ name: "", email: "", address: "", telephone: "", baptismDate: "", pastor: "", churchElder: "" })
    loadData()
  }

  const handleDeleteMember = async (id: string) => {
    if (confirm("Are you sure you want to delete this member?")) {
      await deleteMember(id)
      loadData()
    }
  }

  const handleAddAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault()
    const year = localStorage.getItem("selected_year") || new Date().getFullYear().toString()
    
    await saveAnnouncement({
      title: announcementFormData.title,
      description: announcementFormData.description,
      type: announcementFormData.type,
      date: announcementFormData.date,
      published: announcementFormData.published,
      fileName: announcementFormData.fileName,
      fileData: announcementFormData.fileData,
      year
    })
    
    setIsAddingAnnouncement(false)
    setAnnouncementFormData({
      title: "",
      description: "",
      type: "Announcement",
      date: new Date().toISOString().split('T')[0],
      published: false,
      fileName: "",
      fileData: ""
    })
    loadData()
  }

  const handleUpdateAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingAnnouncement) return
    
    await saveAnnouncement({
      id: editingAnnouncement.id,
      title: announcementFormData.title,
      description: announcementFormData.description,
      type: announcementFormData.type,
      date: announcementFormData.date,
      published: announcementFormData.published,
      fileName: announcementFormData.fileName,
      fileData: announcementFormData.fileData,
      year: localStorage.getItem("selected_year") || new Date().getFullYear().toString()
    })
    
    setEditingAnnouncement(null)
    setAnnouncementFormData({
      title: "",
      description: "",
      type: "Announcement",
      date: new Date().toISOString().split('T')[0],
      published: false,
      fileName: "",
      fileData: ""
    })
    loadData()
  }

  const handleDeleteAnnouncement = async (id: string) => {
    if (confirm("Are you sure you want to delete this announcement?")) {
      await deleteAnnouncement(id)
      loadData()
    }
  }

  const togglePublish = async (id: string) => {
    const a = announcements.find(x => x.id === id)
    if (a) {
      await saveAnnouncement({
        ...a,
        published: !a.published
      })
      loadData()
    }
  }

  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingUser) return
    await updateUser(editingUser.id, userFormData)
    setEditingUser(null)
    setUserFormData({ firstName: "", lastName: "", role: "", email: "", allowedYears: [] })
    loadData()
  }

  const handleDeleteUserAccount = async (id: string) => {
    if (confirm("Delete this user account?")) {
      await deleteUser(id)
      loadData()
    }
  }

  const generateResetLink = (email: string) => {
    const link = `${window.location.origin}/reset-password?email=${encodeURIComponent(email)}`
    setGeneratedResetLink(link)
  }

  const handleAddWOP = async (e: React.FormEvent) => {
    e.preventDefault()
    const year = localStorage.getItem("selected_year") || new Date().getFullYear().toString()
    await saveWeekOfPrayer({
      ...wopFormData,
      year
    })
    setIsAddingWOP(false)
    setWopFormData({ title: "", content: "", date: "" })
    loadData()
  }

  const handleDeleteWOP = async (id: string) => {
    if (confirm("Are you sure you want to delete this context?")) {
      await deleteWeekOfPrayer(id)
      loadData()
    }
  }

  const handleAddProgram = async (e: React.FormEvent) => {
    e.preventDefault()
    const year = localStorage.getItem("selected_year") || new Date().getFullYear().toString()
    await saveWeeklyProgram({
      ...programFormData,
      year
    })
    setIsAddingProgram(false)
    setProgramFormData({ day: "", preacherName: "", prayer: "", coordinator: "" })
    loadData()
  }

  const handleDeleteProgram = async (id: string) => {
    if (confirm("Are you sure you want to delete this weekly program?")) {
      await deleteWeeklyProgram(id)
      loadData()
    }
  }

  const handleAddChoir = async (e: React.FormEvent) => {
    e.preventDefault()
    const year = localStorage.getItem("selected_year") || new Date().getFullYear().toString()
    await saveWeeklyChoir({
      ...choirFormData,
      year
    })
    setIsAddingChoir(false)
    setChoirFormData({ name: "", leaderName: "" })
    loadData()
  }

  const handleDeleteChoir = async (id: string) => {
    if (confirm("Are you sure you want to delete this choir schedule?")) {
      await deleteWeeklyChoir(id)
      loadData()
    }
  }

  const generateChoirPDF = () => {
    const doc = new jsPDF()
    doc.text("Weekly Choir Schedule", 14, 15)
    
    const tableData = weeklyChoirs.map(c => [c.name, c.leaderName])
    
    autoTable(doc, {
      head: [['Choir Name', 'Leader Name']],
      body: tableData,
      startY: 20,
    })
    
    doc.save("weekly_choir_schedule.pdf")
  }

  const filteredMembers = members.filter(m => 
    `${m.firstName} ${m.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (m.email && m.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (m.pastor && m.pastor.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (m.churchElder && m.churchElder.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  const filteredCouncilMembers = councilMembers.filter(m => 
    `${m.firstName} ${m.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (m.email && m.email.toLowerCase().includes(searchQuery.toLowerCase()))
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
          <TabsTrigger value="council">Church Council</TabsTrigger>
          <TabsTrigger value="users">User Accounts</TabsTrigger>
          <TabsTrigger value="evangelism">Evangelism Dept</TabsTrigger>
          <TabsTrigger value="announcements">Announcements</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
          <TabsTrigger value="system">System Config</TabsTrigger>
        </TabsList>

        <TabsContent value="members" className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="relative w-72">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search members..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            <Button onClick={() => setIsAddingMember(true)}>
              <Plus className="mr-2 h-4 w-4" /> Add Baptized Member
            </Button>
          </div>

          {(isAddingMember || editingMember) && (
            <div className="p-6 border rounded-xl bg-muted/30 space-y-4">
              <h3 className="text-lg font-bold">{editingMember ? "Edit Member" : "Add New Baptized Member"}</h3>
              <form onSubmit={editingMember ? handleUpdateMember : handleAddMember} className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  <div className="grid gap-2">
                    <Label>Full Name</Label>
                    <Input 
                      value={formData.name} 
                      onChange={(e) => setFormData({...formData, name: e.target.value})} 
                      required 
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label>Email</Label>
                    <Input 
                      type="email" 
                      value={formData.email} 
                      onChange={(e) => setFormData({...formData, email: e.target.value})} 
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label>Address</Label>
                    <Input 
                      value={formData.address} 
                      onChange={(e) => setFormData({...formData, address: e.target.value})} 
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label>Telephone</Label>
                    <Input 
                      value={formData.telephone} 
                      onChange={(e) => setFormData({...formData, telephone: e.target.value})} 
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label>Baptism Date</Label>
                    <Input 
                      type="date" 
                      value={formData.baptismDate} 
                      onChange={(e) => setFormData({...formData, baptismDate: e.target.value})} 
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label>Pastor</Label>
                    <Input 
                      value={formData.pastor} 
                      onChange={(e) => setFormData({...formData, pastor: e.target.value})} 
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label>Church Elder</Label>
                    <Input 
                      value={formData.churchElder} 
                      onChange={(e) => setFormData({...formData, churchElder: e.target.value})} 
                    />
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button type="submit">Save Member</Button>
                  <Button variant="outline" type="button" onClick={() => { 
                    setIsAddingMember(false); 
                    setEditingMember(null); 
                    setFormData({ name: "", email: "", address: "", telephone: "", baptismDate: "", pastor: "", churchElder: "" });
                  }}>Cancel</Button>
                </div>
              </form>
            </div>
          )}

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Full Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Telephone</TableHead>
                  <TableHead>Address</TableHead>
                  <TableHead>Baptism Date</TableHead>
                  <TableHead>Pastor</TableHead>
                  <TableHead>Church Elder</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredMembers.map((m) => (
                  <TableRow key={m.id}>
                    <TableCell className="font-medium">{m.firstName} {m.lastName}</TableCell>
                    <TableCell>{m.email || "-"}</TableCell>
                    <TableCell>{m.phone || "-"}</TableCell>
                    <TableCell>{m.address || "-"}</TableCell>
                    <TableCell>{m.baptismDate || "-"}</TableCell>
                    <TableCell>{m.pastor || "-"}</TableCell>
                    <TableCell>{m.churchElder || "-"}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" onClick={() => { 
                        setEditingMember(m); 
                        setFormData({
                          name: `${m.firstName} ${m.lastName}`.trim(),
                          email: m.email || "",
                          address: m.address || "",
                          telephone: m.phone || "",
                          baptismDate: m.baptismDate || "",
                          pastor: m.pastor || "",
                          churchElder: m.churchElder || ""
                        }); 
                      }}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleDeleteMember(m.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="council" className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="relative w-72">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search council members..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Full Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Telephone</TableHead>
                  <TableHead>Address</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCouncilMembers.map((m) => (
                  <TableRow key={m.id}>
                    <TableCell className="font-medium">{m.firstName} {m.lastName}</TableCell>
                    <TableCell>{m.email || "-"}</TableCell>
                    <TableCell>{m.phone || "-"}</TableCell>
                    <TableCell>{m.address || "-"}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {reports.map((r) => (
              <div key={r.id} className="border p-4 rounded-xl space-y-2 bg-background shadow-sm">
                <h3 className="font-bold text-lg">{r.title}</h3>
                <p className="text-sm text-muted-foreground">Date: {r.date}</p>
                <p className="text-sm font-medium">Total Attendance: {r.total}</p>
                <Button
                  size="sm"
                  variant="outline"
                  className="w-full mt-2"
                  onClick={() => {
                    const link = document.createElement("a")
                    link.href = r.pdfData
                    link.download = `${r.title}.pdf`
                    link.click()
                  }}
                >
                  <Download className="h-4 w-4 mr-1" /> Download PDF
                </Button>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="announcements" className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold">Manage Church Announcements</h3>
            <Button onClick={() => setIsAddingAnnouncement(true)}>
              <Plus className="mr-2 h-4 w-4" /> Add Announcement
            </Button>
          </div>

          {(isAddingAnnouncement || editingAnnouncement) && (
            <div className="p-6 border rounded-xl bg-muted/30 space-y-4">
              <h3 className="text-lg font-bold">{editingAnnouncement ? "Edit Announcement" : "Create New Announcement"}</h3>
              <form onSubmit={editingAnnouncement ? handleUpdateAnnouncement : handleAddAnnouncement} className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="grid gap-2">
                    <Label>Title</Label>
                    <Input 
                      value={announcementFormData.title} 
                      onChange={(e) => setAnnouncementFormData({...announcementFormData, title: e.target.value})} 
                      required 
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label>Type</Label>
                    <select 
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                      value={announcementFormData.type}
                      onChange={(e) => setAnnouncementFormData({...announcementFormData, type: e.target.value as any})}
                    >
                      <option value="Announcement">Announcement</option>
                      <option value="Event">Event</option>
                      <option value="News">News</option>
                    </select>
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label>Description</Label>
                  <textarea 
                    className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                    value={announcementFormData.description} 
                    onChange={(e) => setAnnouncementFormData({...announcementFormData, description: e.target.value})} 
                    required 
                  />
                </div>

                <div className="grid gap-2 border p-4 rounded-lg bg-background">
                  <Label className="flex items-center gap-2">
                    <Upload className="h-4 w-4 text-muted-foreground" /> Attachment (PDF, Image, Document)
                  </Label>
                  <Input 
                    type="file" 
                    accept=".pdf,image/*,.doc,.docx"
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (file) {
                        const reader = new FileReader()
                        reader.onloadend = () => {
                          setAnnouncementFormData({
                            ...announcementFormData,
                            fileName: file.name,
                            fileData: reader.result as string
                          })
                        }
                        reader.readAsDataURL(file)
                      }
                    }} 
                  />
                  {announcementFormData.fileName && (
                    <p className="text-xs text-green-600 font-medium mt-1">
                      Selected: {announcementFormData.fileName}
                    </p>
                  )}
                </div>

                <div className="flex gap-2">
                  <Button type="submit">Save Announcement</Button>
                  <Button variant="outline" type="button" onClick={() => { 
                    setIsAddingAnnouncement(false); 
                    setEditingAnnouncement(null); 
                    setAnnouncementFormData({
                      title: "", description: "", type: "Announcement", 
                      date: new Date().toISOString().split('T')[0], 
                      published: false, fileName: "", fileData: ""
                    });
                  }}>Cancel</Button>
                </div>
              </form>
            </div>
          )}

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Attachment</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {announcements.map((a) => (
                  <TableRow key={a.id}>
                    <TableCell className="font-medium">{a.title}</TableCell>
                    <TableCell>{a.type}</TableCell>
                    <TableCell>
                      {a.fileData ? (
                        <Button 
                          variant="link" 
                          size="sm" 
                          className="h-auto p-0 flex items-center gap-1 text-primary"
                          onClick={() => {
                            const link = document.createElement("a")
                            link.href = a.fileData!
                            link.download = a.fileName || "attachment"
                            link.click()
                          }}
                        >
                          <FileText className="h-4 w-4" /> Download File
                        </Button>
                      ) : (
                        <span className="text-xs text-muted-foreground">None</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => togglePublish(a.id)}
                        className={a.published ? "text-green-600" : "text-muted-foreground"}
                      >
                        {a.published ? "Published" : "Draft"}
                      </Button>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" onClick={() => { 
                        setEditingAnnouncement(a); 
                        setAnnouncementFormData({
                          title: a.title,
                          description: a.description || "",
                          type: a.type as any,
                          date: a.date,
                          published: a.published,
                          fileName: a.fileName || "",
                          fileData: a.fileData || ""
                        }); 
                      }}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleDeleteAnnouncement(a.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

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
                    <Input value={userFormData.role} onChange={(e) => setUserFormData({...userFormData, role: e.target.value})} required />
                  </div>
                  <div className="grid gap-2">
                    <Label>Email</Label>
                    <Input type="email" value={userFormData.email} onChange={(e) => setUserFormData({...userFormData, email: e.target.value})} required />
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button type="submit">Save Account</Button>
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
                {users.map((u) => (
                  <TableRow key={u.id}>
                    <TableCell className="font-medium">{u.firstName} {u.lastName}</TableCell>
                    <TableCell>{u.role}</TableCell>
                    <TableCell>{u.email}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" onClick={() => generateResetLink(u.email)}>
                        <Key className="h-4 w-4 text-primary" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => { setEditingUser(u); setUserFormData(u); }}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleDeleteUserAccount(u.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="evangelism" className="space-y-6">
          <div className="grid gap-6">
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
                    <Label>Title</Label>
                    <Input value={wopFormData.title} onChange={(e) => setWopFormData({...wopFormData, title: e.target.value})} required />
                  </div>
                  <div className="grid gap-1.5">
                    <Label>Content</Label>
                    <Input value={wopFormData.content || ""} onChange={(e) => setWopFormData({...wopFormData, content: e.target.value})} required />
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
                      <TableHead>Title</TableHead>
                      <TableHead>Content</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {weekOfPrayers.map((w) => (
                      <TableRow key={w.id}>
                        <TableCell>{w.title}</TableCell>
                        <TableCell>{w.content}</TableCell>
                        <TableCell>{w.date}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleDeleteWOP(w.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>

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
                      <Label>Preacher</Label>
                      <Input value={programFormData.preacherName} onChange={(e) => setProgramFormData({...programFormData, preacherName: e.target.value})} required />
                    </div>
                    <div className="grid gap-1.5">
                      <Label>Prayer Leader</Label>
                      <Input value={programFormData.prayer || ""} onChange={(e) => setProgramFormData({...programFormData, prayer: e.target.value})} />
                    </div>
                    <div className="grid gap-1.5">
                      <Label>Coordinator</Label>
                      <Input value={programFormData.coordinator || ""} onChange={(e) => setProgramFormData({...programFormData, coordinator: e.target.value})} />
                    </div>
                    <div className="flex gap-2">
                      <Button type="submit" size="sm">Save Program</Button>
                      <Button variant="ghost" size="sm" onClick={() => setIsAddingProgram(false)}>Cancel</Button>
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
                          <TableCell className="font-medium">{p.day}</TableCell>
                          <TableCell>{p.preacherName}</TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleDeleteProgram(p.id)}>
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
                    <Button size="sm" variant="outline" onClick={generateChoirPDF}>
                      <Download className="h-4 w-4 mr-1" /> PDF
                    </Button>
                    <Button size="sm" onClick={() => setIsAddingChoir(true)}>
                      <Plus className="h-4 w-4 mr-1" /> Add
                    </Button>
                  </div>
                </div>

                {isAddingChoir && (
                  <form onSubmit={handleAddChoir} className="grid gap-3 p-4 bg-muted/50 rounded-lg">
                    <div className="grid gap-1.5">
                      <Label>Choir Name</Label>
                      <Input value={choirFormData.name} onChange={(e) => setChoirFormData({...choirFormData, name: e.target.value})} required />
                    </div>
                    <div className="grid gap-1.5">
                      <Label>Leader Name</Label>
                      <Input value={choirFormData.leaderName} onChange={(e) => setChoirFormData({...choirFormData, leaderName: e.target.value})} required />
                    </div>
                    <div className="flex gap-2">
                      <Button type="submit" size="sm">Save Choir</Button>
                      <Button variant="ghost" size="sm" onClick={() => setIsAddingChoir(false)}>Cancel</Button>
                    </div>
                  </form>
                )}

                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Leader</TableHead>
                        <TableHead className="text-right">Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {weeklyChoirs.map((c) => (
                        <TableRow key={c.id}>
                          <TableCell className="font-medium">{c.name}</TableCell>
                          <TableCell>{c.leaderName}</TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleDeleteChoir(c.id)}>
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

        <TabsContent value="system" className="space-y-4">
          <div className="p-6 border rounded-xl space-y-6">
            <h3 className="text-xl font-bold flex items-center gap-2">
              <Settings className="h-5 w-5" /> System Controls
            </h3>
            
            <div className="grid gap-4 md:grid-cols-2">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <p className="font-semibold">Block Member Login</p>
                  <p className="text-sm text-muted-foreground">Prevent non-admin users from signing in</p>
                </div>
                <Button 
                  variant={blockLogin ? "destructive" : "outline"}
                  onClick={async () => {
                    const newValue = !blockLogin
                    setBlockLogin(newValue)
                    await updateSystemConfig({ blockLogin: newValue })
                  }}
                >
                  {blockLogin ? "Blocked" : "Allowed"}
                </Button>
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <p className="font-semibold">Block Registration</p>
                  <p className="text-sm text-muted-foreground">Disable new account creation</p>
                </div>
                <Button 
                  variant={blockRegister ? "destructive" : "outline"}
                  onClick={async () => {
                    const newValue = !blockRegister
                    setBlockRegister(newValue)
                    await updateSystemConfig({ blockRegister: newValue })
                  }}
                >
                  {blockRegister ? "Blocked" : "Allowed"}
                </Button>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}