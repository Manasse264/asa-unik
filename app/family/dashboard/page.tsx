"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { 
  Users, 
  UserPlus, 
  Trash2, 
  Pencil, 
  LogOut, 
  CheckCircle2, 
  Home, 
  Calendar, 
  FileSpreadsheet, 
  AlertCircle,
  X,
  Save,
  Clock
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import { 
  getFamilyDetails, 
  addFamilyMember, 
  updateFamilyMember, 
  deleteFamilyMember,
  getAttendanceList,
  saveAttendanceList
} from "@/lib/family-actions"
import { FamilyAttendanceForm, AttendanceFormData, FamilyMemberItem } from "@/components/family-attendance-form"

export default function FamilyDashboardPage() {
  const router = useRouter()
  const [familySession, setFamilySession] = React.useState<any>(null)
  const [familyData, setFamilyData] = React.useState<any>(null)
  const [members, setMembers] = React.useState<FamilyMemberItem[]>([])
  const [selectedQuarter, setSelectedQuarter] = React.useState("Q1")
  const [attendanceData, setAttendanceData] = React.useState<AttendanceFormData | null>(null)
  const [loading, setLoading] = React.useState(true)

  // Member Modal State
  const [isMemberModalOpen, setIsMemberModalOpen] = React.useState(false)
  const [editingMember, setEditingMember] = React.useState<FamilyMemberItem | null>(null)
  const [memberName, setMemberName] = React.useState("")
  const [memberRole, setMemberRole] = React.useState("Member")
  const [memberSaving, setMemberSaving] = React.useState(false)
  const [memberError, setMemberError] = React.useState("")

  // Active view tab
  const [activeTab, setActiveTab] = React.useState<"attendance" | "members">("attendance")

  // Check auth session
  React.useEffect(() => {
    const raw = localStorage.getItem("family_auth")
    if (!raw) {
      router.push("/family/signin")
      return
    }
    try {
      const parsed = JSON.parse(raw)
      setFamilySession(parsed)
      loadFamily(parsed.id, parsed.year, selectedQuarter)
    } catch (e) {
      router.push("/family/signin")
    }
  }, [router])

  // Reload attendance when quarter changes
  React.useEffect(() => {
    if (familySession?.id) {
      loadAttendance(familySession.id, familySession.year, selectedQuarter)
    }
  }, [selectedQuarter, familySession])

  const loadFamily = async (familyId: string, year: string, quarter: string) => {
    setLoading(true)
    try {
      const fam = await getFamilyDetails(familyId)
      if (fam) {
        setFamilyData(fam)
        setMembers(fam.members || [])
      }
      await loadAttendance(familyId, year, quarter)
    } catch (e) {
      console.error("Error loading family:", e)
    } finally {
      setLoading(false)
    }
  }

  const loadAttendance = async (familyId: string, year: string, quarter: string) => {
    try {
      const attRecord = await getAttendanceList(familyId, year, quarter)
      if (attRecord) {
        setAttendanceData({
          id: attRecord.id,
          familyId: attRecord.familyId,
          year: attRecord.year,
          quarter: attRecord.quarter,
          attendanceGrid: JSON.parse(attRecord.attendanceGrid || "{}"),
          summaryData: JSON.parse(attRecord.summaryData || "{}"),
          isPublished: attRecord.isPublished,
          publishedAt: attRecord.publishedAt ? attRecord.publishedAt.toISOString() : null,
          publishedBy: attRecord.publishedBy,
        })
      } else {
        setAttendanceData({
          familyId,
          year,
          quarter,
          attendanceGrid: {},
          summaryData: {},
          isPublished: false,
        })
      }
    } catch (e) {
      console.error("Error loading attendance:", e)
    }
  }

  const handleSaveAttendance = async (data: AttendanceFormData, isPublish: boolean) => {
    if (!familySession) return { success: false, error: "Not authenticated" }
    
    const res = await saveAttendanceList({
      familyId: familySession.id,
      year: familySession.year,
      quarter: data.quarter,
      attendanceGrid: JSON.stringify(data.attendanceGrid || {}),
      summaryData: JSON.stringify(data.summaryData || {}),
      isPublished: isPublish,
      publishedBy: isPublish ? `${familyData?.pere || ""} & ${familyData?.mere || ""}` : undefined,
    })

    if (res.success && res.list) {
      setAttendanceData({
        id: res.list.id,
        familyId: res.list.familyId,
        year: res.list.year,
        quarter: res.list.quarter,
        attendanceGrid: JSON.parse(res.list.attendanceGrid || "{}"),
        summaryData: JSON.parse(res.list.summaryData || "{}"),
        isPublished: res.list.isPublished,
        publishedAt: res.list.publishedAt ? res.list.publishedAt.toISOString() : null,
        publishedBy: res.list.publishedBy,
      })
      return { success: true }
    }
    return { success: false, error: res.error }
  }

  // Add / Edit Member
  const handleOpenAddMember = () => {
    setEditingMember(null)
    setMemberName("")
    setMemberRole("Member")
    setMemberError("")
    setIsMemberModalOpen(true)
  }

  const handleOpenEditMember = (member: FamilyMemberItem) => {
    setEditingMember(member)
    setMemberName(member.name)
    setMemberRole(member.role || "Member")
    setMemberError("")
    setIsMemberModalOpen(true)
  }

  const handleSaveMember = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!memberName.trim()) {
      setMemberError("Please enter member name.")
      return
    }

    setMemberSaving(true)
    setMemberError("")

    try {
      if (editingMember) {
        const res = await updateFamilyMember({
          id: editingMember.id,
          familyId: familySession.id,
          name: memberName,
          role: memberRole,
        })
        if (!res.success) {
          setMemberError(res.error || "Failed to update member.")
          return
        }
      } else {
        const res = await addFamilyMember({
          familyId: familySession.id,
          name: memberName,
          role: memberRole,
          year: familySession.year,
        })
        if (!res.success) {
          setMemberError(res.error || "Failed to add member.")
          return
        }
      }

      setIsMemberModalOpen(false)
      // Reload family members
      const fam = await getFamilyDetails(familySession.id)
      if (fam) {
        setFamilyData(fam)
        setMembers(fam.members || [])
      }
    } catch (e: any) {
      setMemberError(e.message || "An error occurred.")
    } finally {
      setMemberSaving(false)
    }
  }

  const handleDeleteMember = async (memberId: string, memberName: string) => {
    if (!confirm(`Are you sure you want to remove ${memberName} from this family?`)) return
    try {
      const res = await deleteFamilyMember(memberId, familySession.id)
      if (res.success) {
        const fam = await getFamilyDetails(familySession.id)
        if (fam) {
          setFamilyData(fam)
          setMembers(fam.members || [])
        }
      } else {
        alert(res.error || "Failed to delete member.")
      }
    } catch (e: any) {
      alert(e.message)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("family_auth")
    router.push("/family/signin")
  }

  if (loading || !familySession) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm font-semibold text-slate-600">Loading Family Portal...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-100/70 pb-16">
      {/* Top Header Bar */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-600/20">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-slate-900 text-sm sm:text-base leading-tight">
                  {familyData?.name || familySession.name}
                </span>
                <span className="bg-indigo-50 text-indigo-700 text-[10px] font-bold px-2 py-0.5 rounded-full border border-indigo-100">
                  {familySession.year}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 truncate max-w-[280px]">
                Pere: {familyData?.pere} • Mere: {familyData?.mere}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              href="/"
              className="text-xs font-semibold text-slate-600 hover:text-slate-900 px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors hidden sm:inline-flex items-center gap-1.5"
            >
              <Home className="w-3.5 h-3.5" />
              Church Home
            </Link>

            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="rounded-xl border-slate-200 text-red-600 hover:bg-red-50 hover:text-red-700 text-xs font-bold gap-1.5"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-6 max-w-7xl">
        {/* Welcome & Stats Banner */}
        <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-blue-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl shadow-indigo-950/10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <span className="inline-block bg-indigo-500/30 text-indigo-200 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider border border-indigo-400/20">
              SABBATH SCHOOL FAMILY PORTAL
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              {familyData?.name || familySession.name}
            </h1>
            <p className="text-indigo-200 text-sm max-w-2xl leading-relaxed">
              Family leaders: <strong className="text-white">{familyData?.pere}</strong> &amp;{" "}
              <strong className="text-white">{familyData?.mere}</strong>. 
            </p>
          </div>

          <div className="flex items-center gap-4 bg-white/10 backdrop-blur-xs p-4 rounded-2xl border border-white/15">
            <div className="text-center px-3 border-r border-white/15">
              <span className="block text-2xl font-black">{members.length}</span>
              <span className="text-[11px] text-indigo-200 uppercase font-semibold">Members</span>
            </div>
            <div className="text-center px-3">
              <span className="block text-2xl font-black">14</span>
              <span className="text-[11px] text-indigo-200 uppercase font-semibold">Sabbaths</span>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center justify-between border-b border-slate-200 bg-white px-6 rounded-2xl shadow-xs">
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab("attendance")}
              className={cn(
                "py-4 px-4 text-sm font-bold border-b-2 transition-all flex items-center gap-2",
                activeTab === "attendance"
                  ? "border-indigo-600 text-indigo-600"
                  : "border-transparent text-slate-500 hover:text-slate-800"
              )}
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>Sabbath School Attendance Sheet</span>
            </button>
            <button
              onClick={() => setActiveTab("members")}
              className={cn(
                "py-4 px-4 text-sm font-bold border-b-2 transition-all flex items-center gap-2",
                activeTab === "members"
                  ? "border-indigo-600 text-indigo-600"
                  : "border-transparent text-slate-500 hover:text-slate-800"
              )}
            >
              <Users className="w-4 h-4" />
              <span>Manage Family Members ({members.length})</span>
            </button>
          </div>

         
        </div>

        {/* TAB 1: ATTENDANCE SHEET */}
        {activeTab === "attendance" && (
          <div className="space-y-4">
            {members.length === 0 ? (
              <div className="bg-white rounded-2xl p-8 text-center space-y-4 border border-slate-200 shadow-sm">
                <div className="w-12 h-12 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
                  <AlertCircle className="w-6 h-6" />
                </div>
                <div className="space-y-1 max-w-md mx-auto">
                  <h3 className="text-base font-bold text-slate-900">No Family Members Registered Yet</h3>
                  <p className="text-xs text-slate-500">
                    The attendance table rows depend directly on the members you register. Please register the members of your family first.
                  </p>
                </div>
                <Button
                  onClick={() => setActiveTab("members")}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold gap-2"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Go to Member Management</span>
                </Button>
              </div>
            ) : (
              <FamilyAttendanceForm
                family={{
                  id: familySession.id,
                  name: familyData?.name || familySession.name,
                  pere: familyData?.pere || "",
                  mere: familyData?.mere || "",
                  year: familySession.year,
                }}
                members={members}
                initialData={attendanceData}
                onSave={handleSaveAttendance}
                readOnly={false}
                isLeaderView={false}
              />
            )}
          </div>
        )}

        {/* TAB 2: MANAGE MEMBERS */}
        {activeTab === "members" && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <h3 className="font-bold text-slate-900 text-base">Family Members List</h3>
                <p className="text-xs text-slate-500">
                  Pere and Mere can add, edit, or remove members. These members populate the rows in the Sabbath School Attendance sheet.
                </p>
              </div>
              <Button
                size="sm"
                onClick={handleOpenAddMember}
                className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold gap-1.5 shadow-sm shadow-indigo-600/20"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Add Family Member</span>
              </Button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 uppercase font-extrabold text-[11px]">
                  <tr>
                    <th className="py-3 px-4 w-12 text-center">#</th>
                    <th className="py-3 px-4">Member Name</th>
                    <th className="py-3 px-4">Role / Relation</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {members.map((m, idx) => (
                    <tr key={m.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 px-4 text-center font-bold text-slate-500">{idx + 1}</td>
                      <td className="py-3 px-4 font-semibold text-slate-800 text-sm">{m.name}</td>
                      <td className="py-3 px-4">
                        <span className="inline-block bg-slate-100 text-slate-700 font-semibold px-2.5 py-0.5 rounded-full text-[11px] border border-slate-200">
                          {m.role || "Member"}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleOpenEditMember(m)}
                          className="h-8 w-8 p-0 rounded-lg text-slate-600 hover:text-indigo-600 hover:bg-indigo-50"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteMember(m.id, m.name)}
                          className="h-8 w-8 p-0 rounded-lg text-slate-600 hover:text-red-600 hover:bg-red-50"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      {/* Add/Edit Member Modal */}
      {isMemberModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100 space-y-4 animate-in fade-in zoom-in duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-base">
                {editingMember ? "Edit Family Member" : "Add Family Member"}
              </h3>
              <button
                type="button"
                onClick={() => setIsMemberModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {memberError && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{memberError}</span>
              </div>
            )}

            <form onSubmit={handleSaveMember} className="space-y-4">
              <div>
                <Label className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1 block">
                  Member Full Name
                </Label>
                <Input
                  type="text"
                  placeholder="e.g. Samuel Niyonsenga"
                  value={memberName}
                  onChange={(e) => setMemberName(e.target.value)}
                  required
                  className="rounded-xl border-slate-200 text-sm"
                />
              </div>

              <div>
                <Label className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1 block">
                  Family Role
                </Label>
                <select
                  value={memberRole}
                  onChange={(e) => setMemberRole(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm font-medium text-slate-800 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                >
                  <option value="Pere">Pere (Father)</option>
                  <option value="Mere">Mere (Mother)</option>                  
                  <option value="Child">Child</option>                 
                  <option value="Visitor">Regular Visitor</option>
                </select>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsMemberModalOpen(false)}
                  className="rounded-xl text-xs font-semibold"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={memberSaving}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold gap-1.5"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{memberSaving ? "Saving..." : "Save Member"}</span>
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
