"use client"

import * as React from "react"
import { 
  CheckCircle2, 
  Send, 
  Save, 
  Printer, 
  Info, 
  Sparkles,
  AlertTriangle,
  RotateCcw
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export interface FamilyMemberItem {
  id: string
  name: string
  role?: string | null
}

export interface AttendanceFormData {
  id?: string
  familyId: string
  year: string
  quarter: string
  attendanceGrid: Record<string, Record<number, "P" | "A" | "S" | "">>
  summaryData: Record<string, Record<number, number | string>>
  isPublished: boolean
  publishedAt?: string | null
  publishedBy?: string | null
}

interface FamilyAttendanceFormProps {
  family: {
    id: string
    name: string
    pere: string
    mere: string
    year: string
  }
  members: FamilyMemberItem[]
  initialData?: AttendanceFormData | null
  onSave: (data: AttendanceFormData, isPublish: boolean) => Promise<{ success: boolean; error?: string }>
  readOnly?: boolean
  isLeaderView?: boolean
}

const WEEKS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14]
const QUARTERS = ["Q1", "Q2", "Q3", "Q4"]

const SUMMARY_ROWS = [
  { key: "presents", label: "Presents", autoCalc: true, targetKey: "P" },
  { key: "absents", label: "Absents", autoCalc: true, targetKey: "A" },
  { key: "sevenStudy", label: "Seven study", autoCalc: false, hint: "Daily 7-day Bible study guide" },
  { key: "visitors", label: "Visitors", autoCalc: false, hint: "Number of visitors" },
  { key: "givingTithe", label: "Giving 1/10", autoCalc: false, hint: "Giving tithe / 1/10" },
  { key: "beginningSabbath", label: "Beginning Sabbath", autoCalc: false, hint: "Attendance at Sabbath opening" },
  { key: "visitedPeople", label: "Visited People", autoCalc: false, hint: "People visited this week" },
  { key: "peopleWhoHelped", label: "People who helped", autoCalc: false, hint: "Benevolence recipients" },
  { key: "peopleWhoHelps", label: "People who helps", autoCalc: false, hint: "Members who offered help" },
]

export function FamilyAttendanceForm({
  family,
  members,
  initialData,
  onSave,
  readOnly = false,
  isLeaderView = false,
}: FamilyAttendanceFormProps) {
  const [selectedQuarter, setSelectedQuarter] = React.useState(initialData?.quarter || "Q1")
  const [attendanceGrid, setAttendanceGrid] = React.useState<Record<string, Record<number, "P" | "A" | "S" | "">>>(
    initialData?.attendanceGrid || {}
  )
  const [summaryData, setSummaryData] = React.useState<Record<string, Record<number, number | string>>>(
    initialData?.summaryData || {}
  )
  const [isPublished, setIsPublished] = React.useState(initialData?.isPublished ?? false)
  const [publishedAt, setPublishedAt] = React.useState(initialData?.publishedAt || null)
  const [saving, setSaving] = React.useState(false)
  const [publishing, setPublishing] = React.useState(false)
  const [statusFeedback, setStatusFeedback] = React.useState<{ type: "success" | "error"; message: string } | null>(null)

  // Update state when initialData changes
  React.useEffect(() => {
    if (initialData) {
      setSelectedQuarter(initialData.quarter || "Q1")
      setAttendanceGrid(initialData.attendanceGrid || {})
      setSummaryData(initialData.summaryData || {})
      setIsPublished(initialData.isPublished ?? false)
      setPublishedAt(initialData.publishedAt || null)
    }
  }, [initialData])

  // Toggle or cycle attendance for member on specific week
  const handleCellClick = (memberId: string, week: number) => {
    if (readOnly) return
    const current = attendanceGrid[memberId]?.[week] || ""
    let next: "P" | "A" | "S" | "" = "P"
    if (current === "P") next = "A"
    else if (current === "A") next = "S"
    else if (current === "S") next = ""

    setAttendanceGrid(prev => {
      const updatedMemberGrid = { ...(prev[memberId] || {}) }
      if (next === "") {
        delete updatedMemberGrid[week]
      } else {
        updatedMemberGrid[week] = next
      }
      return {
        ...prev,
        [memberId]: updatedMemberGrid,
      }
    })
  }

  // Quick set for a member on a week directly
  const setMemberStatus = (memberId: string, week: number, status: "P" | "A" | "S" | "") => {
    if (readOnly) return
    setAttendanceGrid(prev => {
      const updatedMemberGrid = { ...(prev[memberId] || {}) }
      if (status === "") {
        delete updatedMemberGrid[week]
      } else {
        updatedMemberGrid[week] = status
      }
      return {
        ...prev,
        [memberId]: updatedMemberGrid,
      }
    })
  }

  // Calculate auto presents / absents for a week
  const calculateAutoCount = (target: "P" | "A", week: number): number => {
    let count = 0
    for (const m of members) {
      if (attendanceGrid[m.id]?.[week] === target) {
        count++
      }
    }
    return count
  }

  // Handle manual summary number change
  const handleSummaryChange = (rowKey: string, week: number, value: string) => {
    if (readOnly) return
    setSummaryData(prev => {
      const row = { ...(prev[rowKey] || {}) }
      if (value === "") {
        delete row[week]
      } else {
        row[week] = Number(value) || 0
      }
      return {
        ...prev,
        [rowKey]: row,
      }
    })
  }

  // Get display value for summary row
  const getSummaryValue = (rowKey: string, week: number, autoCalc?: boolean, targetKey?: string) => {
    if (autoCalc && targetKey) {
      const manualVal = summaryData[rowKey]?.[week]
      if (manualVal !== undefined && manualVal !== "") {
        return manualVal
      }
      return calculateAutoCount(targetKey as "P" | "A", week)
    }
    return summaryData[rowKey]?.[week] ?? ""
  }

  const handleSaveDraft = async () => {
    setSaving(true)
    setStatusFeedback(null)
    try {
      const payload: AttendanceFormData = {
        familyId: family.id,
        year: family.year,
        quarter: selectedQuarter,
        attendanceGrid,
        summaryData,
        isPublished: false,
      }
      const res = await onSave(payload, false)
      if (res.success) {
        setStatusFeedback({ type: "success", message: "Draft saved successfully!" })
        setIsPublished(false)
      } else {
        setStatusFeedback({ type: "error", message: res.error || "Failed to save draft." })
      }
    } catch (e: any) {
      setStatusFeedback({ type: "error", message: e.message || "Failed to save." })
    } finally {
      setSaving(false)
    }
  }

  const handlePublish = async () => {
    setPublishing(true)
    setStatusFeedback(null)
    try {
      const payload: AttendanceFormData = {
        familyId: family.id,
        year: family.year,
        quarter: selectedQuarter,
        attendanceGrid,
        summaryData,
        isPublished: true,
        publishedAt: new Date().toISOString(),
        publishedBy: isLeaderView ? "Sabbath School Leader" : `${family.pere} / ${family.mere}`,
      }
      const res = await onSave(payload, true)
      if (res.success) {
        setStatusFeedback({ 
          type: "success", 
          message: isLeaderView 
            ? "Attendance list successfully updated by Sabbath School Leader!" 
            : "Attendance list successfully published to Sabbath School Leader!" 
        })
        setIsPublished(true)
        setPublishedAt(new Date().toISOString())
      } else {
        setStatusFeedback({ type: "error", message: res.error || "Failed to publish." })
      }
    } catch (e: any) {
      setStatusFeedback({ type: "error", message: e.message || "Failed to publish." })
    } finally {
      setPublishing(false)
    }
  }

  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden print:border-none print:shadow-none">
      {/* Top Action Toolbar */}
      <div className="bg-slate-50 border-b border-slate-200 p-4 sm:p-5 flex flex-wrap items-center justify-between gap-4 print:hidden">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-sm">
            <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">Quarter:</span>
            <div className="flex gap-1">
              {QUARTERS.map((q) => (
                <button
                  type="button"
                  key={q}
                  onClick={() => setSelectedQuarter(q)}
                  className={cn(
                    "px-2.5 py-1 text-xs font-bold rounded-lg transition-all",
                    selectedQuarter === q
                      ? "bg-indigo-600 text-white shadow-sm"
                      : "text-slate-600 hover:bg-slate-100"
                  )}
                >
                  {q}
                </button>
              ))}
            </div>
          </div>

          {isPublished ? (
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold rounded-xl">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Published {publishedAt ? `(${new Date(publishedAt).toLocaleDateString()})` : ""}</span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 border border-amber-200 text-amber-800 text-xs font-semibold rounded-xl">
              <Info className="w-4 h-4 text-amber-600" />
              <span>Draft (Not Published Yet)</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          

          {!readOnly && (
            <>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleSaveDraft}
                disabled={saving || publishing}
                className="rounded-xl border-slate-300 text-slate-700 hover:bg-slate-100 gap-1.5"
              >
                <Save className="w-3.5 h-3.5" />
                <span>{saving ? "Saving..." : "Save Draft"}</span>
              </Button>

              <Button
                type="button"
                size="sm"
                onClick={handlePublish}
                disabled={saving || publishing}
                className={cn(
                  "rounded-xl font-bold shadow-md transition-all gap-1.5",
                  isLeaderView 
                    ? "bg-indigo-600 hover:bg-indigo-700 text-white" 
                    : "bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/20"
                )}
              >
                <Send className="w-3.5 h-3.5" />
                <span>
                  {publishing 
                    ? "Publishing..." 
                    : isLeaderView 
                      ? "Save & Publish Changes" 
                      : "Publish to Sabbath School Leader"}
                </span>
              </Button>
            </>
          )}
        </div>
      </div>

      {statusFeedback && (
        <div
          className={cn(
            "p-3.5 mx-4 sm:mx-6 mt-4 rounded-xl text-sm font-medium flex items-center gap-2 animate-in fade-in print:hidden",
            statusFeedback.type === "success"
              ? "bg-emerald-50 border border-emerald-200 text-emerald-800"
              : "bg-red-50 border border-red-200 text-red-700"
          )}
        >
          {statusFeedback.type === "success" ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          ) : (
            <AlertTriangle className="w-4 h-4 text-red-500 shrink-0" />
          )}
          <span>{statusFeedback.message}</span>
        </div>
      )}

      {/* DOCUMENT BODY (EXACT FORMAT FROM D:\JACKSON DOC_100100.docx) */}
      <div className="p-6 sm:p-8 space-y-6 text-slate-800 font-sans">
        {/* Document Header */}
        <div className="border-b border-slate-300 pb-5 text-center space-y-1">
          <h1 className="text-base sm:text-lg font-black tracking-wider text-slate-900 uppercase">
            SEVENTH DAY ADVENTIST CHURCH
          </h1>
          <h2 className="text-xs sm:text-sm font-bold tracking-widest text-slate-700 uppercase">
            RWANDA UNION MISSION • SOUTH EAST RWANDA FIELD
          </h2>
          <h3 className="text-xs sm:text-sm font-extrabold text-indigo-700 tracking-wider uppercase">
            ASA UNIK-RP NGOMA
          </h3>
          <div className="pt-2">
            <span className="inline-block bg-slate-900 text-white text-xs sm:text-sm font-black px-4 py-1 tracking-widest uppercase rounded">
              SABBATH SCHOOL ATTENDANCE LIST
            </span>
          </div>
        </div>

        {/* Metadata Details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm border-b border-slate-200 pb-4">
          <div className="space-y-1">
            
          </div>
          <div className="sm:text-right space-y-1">         
          </div>
        </div>

        {/* 5 Things to Consider Section */}
        <div className="bg-slate-50/80 rounded-xl p-4 border border-slate-200/80">
          <p className="text-xs font-black text-slate-800 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            FIVE THINGS TO CONSIDER BEFORE REVISING BIBLE STUDY GUIDE:
          </p>
          <ol className="list-decimal list-inside text-xs sm:text-[13px] text-slate-700 space-y-1 font-medium leading-relaxed">
            <li>To welcome visitors</li>
            <li>To thank and encourage daily bible study</li>
            <li>Attendance report</li>
            <li>To advice for visiting absents</li>
            <li>To explain the purpose of offering of 13th Sabbath</li>
          </ol>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-600 bg-indigo-50/40 p-2.5 rounded-lg border border-indigo-100 print:hidden">
          <div className="flex items-center gap-4">
            <span className="font-bold text-slate-700">Legend:</span>
            <span className="flex items-center gap-1">
              <span className="w-5 h-5 rounded bg-emerald-600 text-white font-bold inline-flex items-center justify-center text-[10px]">
                P
              </span>
              <span>= Present</span>
            </span>
            <span className="flex items-center gap-1">
              <span className="w-5 h-5 rounded bg-red-600 text-white font-bold inline-flex items-center justify-center text-[10px]">
                A
              </span>
              <span>= Absent</span>
            </span>
            <span className="flex items-center gap-1">
              <span className="w-5 h-5 rounded bg-amber-500 text-white font-bold inline-flex items-center justify-center text-[10px]">
                S
              </span>
              <span>= Sick</span>
            </span>
          </div>
          <span className="text-[11px] text-slate-500 italic">
            💡 Click on cell to cycle: P → A → S → Clear
          </span>
        </div>

        {/* ATTENDANCE TABLE */}
        <div className="overflow-x-auto border border-slate-300 rounded-xl shadow-xs">
          <table className="w-full text-xs text-left border-collapse min-w-[760px]">
            <thead>
              <tr className="bg-slate-100 border-b border-slate-300 text-slate-900 font-extrabold text-[11px]">
                <th className="py-2.5 px-2 border-r border-slate-300 w-10 text-center uppercase">N0</th>
                <th className="py-2.5 px-3 border-r border-slate-300 min-w-[160px] uppercase">NAMES</th>
                {WEEKS.map((w) => (
                  <th key={w} className="py-2.5 px-1 border-r border-slate-300 text-center w-10 uppercase font-black">
                    {w}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {/* Member Rows */}
              {members.length === 0 ? (
                <tr>
                  <td colSpan={16} className="text-center py-6 text-slate-500 italic">
                    No family members registered yet. Please add family members above.
                  </td>
                </tr>
              ) : (
                members.map((member, index) => (
                  <tr
                    key={member.id}
                    className={cn(
                      "border-b border-slate-200 transition-colors hover:bg-slate-50/80",
                      index % 2 === 1 ? "bg-slate-50/40" : "bg-white"
                    )}
                  >
                    <td className="py-2 px-2 border-r border-slate-200 text-center font-bold text-slate-600">
                      {index + 1}
                    </td>
                    <td className="py-2 px-3 border-r border-slate-200 font-semibold text-slate-800 truncate max-w-[200px]">
                      {member.name}
                      {member.role && member.role !== "Member" && (
                        <span className="ml-1 text-[10px] text-indigo-600 font-normal">
                          ({member.role})
                        </span>
                      )}
                    </td>
                    {WEEKS.map((week) => {
                      const status = attendanceGrid[member.id]?.[week] || ""
                      return (
                        <td
                          key={week}
                          onClick={() => handleCellClick(member.id, week)}
                          className={cn(
                            "py-1 px-1 border-r border-slate-200 text-center cursor-pointer select-none transition-all",
                            !readOnly && "hover:ring-2 hover:ring-indigo-400 hover:ring-inset",
                            status === "P" && "bg-emerald-50/70 font-bold",
                            status === "A" && "bg-red-50/70 font-bold",
                            status === "S" && "bg-amber-50/70 font-bold"
                          )}
                          title={`Week ${week} - ${member.name}: Click to change`}
                        >
                          <div className="flex items-center justify-center h-6 w-full">
                            {status === "P" && (
                              <span className="w-5 h-5 rounded bg-emerald-600 text-white font-extrabold flex items-center justify-center text-[10px] shadow-xs">
                                P
                              </span>
                            )}
                            {status === "A" && (
                              <span className="w-5 h-5 rounded bg-red-600 text-white font-extrabold flex items-center justify-center text-[10px] shadow-xs">
                                A
                              </span>
                            )}
                            {status === "S" && (
                              <span className="w-5 h-5 rounded bg-amber-500 text-white font-extrabold flex items-center justify-center text-[10px] shadow-xs">
                                S
                              </span>
                            )}
                            {status === "" && (
                              <span className="w-5 h-5 rounded border border-dashed border-slate-200 text-transparent text-[10px] flex items-center justify-center">
                                -
                              </span>
                            )}
                          </div>
                        </td>
                      )
                    })}
                  </tr>
                ))
              )}

              {/* SUMMARY ROWS (MANUAL NUMBERS / AUTO COUNTS FROM DOCX) */}
              <tr className="bg-slate-200/80 border-t-2 border-b border-slate-300 font-extrabold text-slate-800 text-[11px]">
                <td colSpan={2} className="py-2 px-3 border-r border-slate-300 uppercase">
                  INDICATORS
                </td>
                {WEEKS.map((w) => (
                  <td key={w} className="py-2 px-1 border-r border-slate-300 text-center font-black">
                    S{w}
                  </td>
                ))}
              </tr>

              {SUMMARY_ROWS.map((row) => (
                <tr key={row.key} className="border-b border-slate-200 bg-slate-50/60 hover:bg-slate-100/70 transition-colors">
                  <td className="py-2 px-2 border-r border-slate-200 text-center font-bold text-slate-400">
                    •
                  </td>
                  <td className="py-2 px-3 border-r border-slate-200 font-bold text-slate-800">
                    <span>{row.label}</span>
                    {row.autoCalc && (
                      <span className="ml-1 text-[9px] font-normal text-slate-500">(auto)</span>
                    )}
                  </td>
                  {WEEKS.map((week) => {
                    const value = getSummaryValue(row.key, week, row.autoCalc, row.targetKey)
                    return (
                      <td key={week} className="py-1 px-1 border-r border-slate-200 text-center">
                        {readOnly ? (
                          <span className="font-bold text-slate-800">{value !== "" ? value : "-"}</span>
                        ) : (
                          <input
                            type="number"
                            min="0"
                            value={value}
                            onChange={(e) => handleSummaryChange(row.key, week, e.target.value)}
                            placeholder={row.autoCalc ? String(calculateAutoCount(row.targetKey as "P" | "A", week)) : "0"}
                            className="w-full text-center text-xs font-bold bg-white rounded border border-slate-200 py-1 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all text-slate-800"
                          />
                        )}
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer info from docx */}
        <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500">
          <p>ASA UNIK-RP NGOMA • Official Sabbath School Quarter Record Sheet</p>
          
        </div>
      </div>
    </div>
  )
}
