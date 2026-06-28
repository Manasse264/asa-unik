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

import { 
  getMembers, saveMember, deleteMember,
  getAnnouncements, saveAnnouncement, deleteAnnouncement,
  getSystemConfig, updateSystemConfig,
  getUsers, updateUser, deleteUser,
  getReports,
  getWeekOfPrayers, saveWeekOfPrayer, deleteWeekOfPrayer,
  getWeeklyPrograms, saveWeeklyProgram, deleteWeeklyProgram,
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
  const [wopFormData, setWopFormData] = React.useState({ preacher: "", choirInvited: "", date: "" })

  const [weeklyPrograms, setWeeklyPrograms] = React.useState<WeeklyProgram[]>([])
  const [isAddingProgram, setIsAddingProgram] = React.useState(false)
  const [programFormData, setProgramFormData] = React.useState({ day: "", preacherName: "", prayer: "", coordinator: "" })

  const [weeklyChoirs, setWeeklyChoirs] = React.useState<WeeklyChoir[]>([])
  const [isAddingChoir, setIsAddingChoir] = React.useState(false)
  const [choirFormData, setChoirFormData] = React.useState({ day: "", choirName: "" })

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
    content: "",
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
    setAnnouncements(await getAnnouncements(year))
    setUsers(await getUsers())

    // Load evangelism sections from database instead of localStorage
    setWeekOfPrayers(await getWeekOfPrayers(year))
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
      ...announcementFormData,
      year
    })
    
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
    loadData()
  }

  const handleUpdateAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingAnnouncement) return
    
    await saveAnnouncement({
      ...announcementFormData,
      id: editingAnnouncement.id,
      year: localStorage.getItem("selected_year") || new Date().getFullYear().toString()
    })
    
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
    setWopFormData({ preacher: "", choirInvited: "", date: "" })
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
    setChoirFormData({ day: "", choirName: "" })
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
    
    const tableData = weeklyChoirs.map(c => [c.day, c.choirName])
    
    autoTable(doc, {
      head: [['Day', 'Choir Name']],
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
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

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
                    <Label>Preacher</Label>
                    <Input value={wopFormData.preacher} onChange={(e) => setWopFormData({...wopFormData, preacher: e.target.value})} required />
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
                      <Label>Preacher Name</Label>
                      <Input value={programFormData.preacherName} onChange={(e) => setProgramFormData({...programFormData, preacherName: e.target.value})} required />
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
                  <h3 className="text-lg font-bold">Weekly Program for Choir</h3>
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
                      <Input placeholder="e.g. Sabbath" value={choirFormData.day} onChange={(e) => setQuestion => setChoirFormData({...choirFormData, day: e.target.value})} required />
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
                <div className="flex items-end gap-2">
                  <Button type="submit">{editingMember ? "Update" : "Save"}</Button>
                  <Button variant="outline" type="button" onClick={() => { setIsAddingMember(false); setEditingMember(null); }}>Cancel</Button>
                </div>
              </form>
            </div>
          )}

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredMembers.map((m) => (
                  <TableRow key={m.id}>
                    <TableCell>{m.firstName} {m.lastName}</TableCell>
                    <TableCell>{m.email}</TableCell>
                    <TableCell>{m.phone}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" onClick={() => { setEditingMember(m); setFormData({ name: `${m.firstName} ${m.lastName}`, email: m.email || "", address: m.address || "", telephone: m.phone || "", baptismDate: m.baptismDate || "", pastor: m.pastor || "", churchElder: m.churchElder || "" }); }}>
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
      </Tabs>
    </div>
  )
}