"use client"

import * as React from "react"
import { 
  Plus, Search, Pencil, Trash2, Check, X, Briefcase, 
  Users, Building2, Music, UserPlus, ShieldCheck 
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { YearSelector } from "@/components/year-selector"
import { cn } from "@/lib/utils"

import { 
  getMembers, saveMember, deleteMember,
  getChoirs, saveChoir, deleteChoir,
  getDepartments, saveDepartment, deleteDepartment
} from "@/lib/actions"

const secTranslations = {
  en: {
    title: "Church Secretary Dashboard",
    labor: "Church labors",
    addMem: "Add Member",
    addCouncil: "Add Council Member",
    addDept: "Add Department",
    addChoir: "Register Choir",
    addDeacon: "Add Deacon",
    addDeaconess: "Add Deaconess",
    tabMem: "church labors",
    tabCouncil: "Church Council",
    tabDept: "Manage Departments",
    tabChoir: "Manage Choirs",
    tabDeacons: "Deacons",
    tabDeaconesses: "Deaconesses",
    search: "Search",
    searchMembers: "Search members...",
    searchCouncil: "Search council...",
    searchDepts: "Search departments...",
    searchChoirs: "Search choirs...",
    searchDeacons: "Search deacons...",
    searchDeaconesses: "Search deaconesses...",
    registeredMembers: "Registered Members",
    councilList: "Council Members List",
    churchDepts: "Church Departments",
    registeredChoirs: "Registered Choirs",
    deaconsList: "Deacons List",
    deaconessesList: "Deaconesses List",
    name: "Name",
    email: "Email",
    phone: "Phone",
    joinDate: "Join Date",
    position: "Position",
    responsibilities: "Responsibilities",
    deptName: "Department Name",
    leader: "Leader",
    activities: "Activities",
    choirName: "Choir Name",
    memCount: "Members Count",
    actions: "Actions",
    editMem: "Edit Member",
    regNewMem: "Register New Member",
    firstName: "First Name",
    lastName: "Last Name",
    phoneNum: "Phone Number",
    councilMember: "Council Member",
    selectPos: "Select Position",
    listResp: "List responsibilities...",
    regDept: "Register Department",
    editDept: "Edit Department",
    selectDept: "Select Department",
    selectMemAsLeader: "Select Member as Leader",
    manageAct: "Manage Activities",
    descDeptAct: "Describe department activities...",
    regChoir: "Register Choir",
    editChoir: "Edit Choir",
    manageChoirMem: "Manage Choir Members",
    assignLeader: "Assign Leader",
    change: "Change",
    searchLeader: "Search member to assign...",
    searchToAdd: "Search member to add...",
    addSelected: "Add Selected",
    currentMembers: "Current Members",
    noMembersInChoir: "No members added to this choir yet.",
    cancel: "Cancel",
    register: "Register",
    update: "Update",
    save: "Save",
    noMem: "No members found.",
    noDept: "No departments found.",
    noChoir: "No choirs found.",
    confirmDel: "Are you sure you want to delete this",
    choirVal: "Please provide both a choir name and a leader."
  },
  fr: {
    title: "Tableau de Bord du Secrétaire",
    labor: "Travaux de l'église",
    addMem: "Ajouter un Membre",
    addCouncil: "Ajouter un Conseiller",
    addDept: "Ajouter un Département",
    addChoir: "Enregistrer une Chorale",
    addDeacon: "Ajouter un Diacre",
    addDeaconess: "Ajouter une Diaconesse",
    tabMem: "Travaux de l'église",
    tabCouncil: "Conseil de l'Église",
    tabDept: "Gérer les Départements",
    tabChoir: "Gérer les Chorales",
    tabDeacons: "Diacres",
    tabDeaconesses: "Diaconesses",
    search: "Rechercher",
    searchMembers: "Rechercher des membres...",
    searchCouncil: "Rechercher des conseillers...",
    searchDepts: "Rechercher des départements...",
    searchChoirs: "Rechercher des chorales...",
    searchDeacons: "Rechercher des diacres...",
    searchDeaconesses: "Rechercher des diaconesses...",
    registeredMembers: "Membres Enregistrés",
    councilList: "Liste des Membres du Conseil",
    churchDepts: "Départements de l'Église",
    registeredChoirs: "Chorales Enregistrées",
    deaconsList: "Liste des Diacres",
    deaconessesList: "Liste des Diaconesses",
    name: "Nom",
    email: "E-mail",
    phone: "Téléphone",
    joinDate: "Date d'adhésion",
    position: "Position",
    responsibilities: "Responsabilités",
    deptName: "Nom du Département",
    leader: "Leader",
    activities: "Activités",
    choirName: "Nom de la Chorale",
    memCount: "Nombre de Membres",
    actions: "Actions",
    editMem: "Modifier le Membre",
    regNewMem: "Enregistrer un nouveau membre",
    firstName: "Prénom",
    lastName: "Nom",
    phoneNum: "Numéro de téléphone",
    councilMember: "Membre du Conseil",
    selectPos: "Sélectionnez le poste",
    listResp: "Liste des responsabilités...",
    regDept: "Enregistrer un Département",
    editDept: "Modifier le Département",
    selectDept: "Sélectionner le Département",
    selectMemAsLeader: "Sélectionner un membre comme leader",
    manageAct: "Gérer les Activités",
    descDeptAct: "Décrire les activités du département...",
    regChoir: "Enregistrer une Chorale",
    editChoir: "Modifier la Chorale",
    assignLeader: "Assigner un Leader",
    change: "Changer",
    searchLeader: "Rechercher un membre à assigner...",
    manageChoirMem: "Gérer les membres de la chorale",
    searchToAdd: "Rechercher un membre à ajouter...",
    addSelected: "Ajouter la sélection",
    currentMembers: "Membres actuels",
    noMembersInChoir: "Aucun membre n'a encore été ajouté à cette chorale.",
    cancel: "Annuler",
    register: "Enregistrer",
    update: "Modifier",
    save: "Enregistrer",
    noMem: "Aucun membre trouvé.",
    noDept: "Aucun département trouvé.",
    noChoir: "Aucune chorale trouvée.",
    confirmDel: "Êtes-vous sûr de vouloir supprimer ce",
    choirVal: "Veuillez fournir un nom de chorale et un leader."
  }
}

interface Member {
  id: string
  firstName: string
  lastName: string
  email: string | null
  phone: string | null
  joinDate: string | null
  isCouncil: boolean
  isDeacon?: boolean
  isDeaconess?: boolean
  position?: string | null
  responsibilities?: string | null
}

interface Department {
  id: string
  name: string
  leaderName: string
  activities: string | null
}

interface Choir {
  id: string
  name: string
  leaderName: string
  memberIds?: string[] // Optional if not in DB
  memberNames: string[]
}

const initialMembers: Member[] = [
  ]

const initialDepartments: Department[] = [
  
]

const initialChoirs: Choir[] = [

]

const DEPARTMENT_NAMES = [
  "Welfare",
  "Temperance and Family",
  "J.A",
  "MIFEM",
  "Children Department"
]

export default function SecretaryDashboard() {
  const [lang, setLang] = React.useState<"en" | "rw" | "fr">("en")
  const t = secTranslations[lang === "rw" ? "en" : lang]
  const [activeTab, setActiveTab] = React.useState<"members" | "council" | "departments" | "choirs" | "deacons" | "deaconesses">("members")
  const [members, setMembers] = React.useState<Member[]>(initialMembers)
  const [departments, setDepartments] = React.useState<Department[]>(initialDepartments)
  const [choirs, setChoirs] = React.useState<Choir[]>(initialChoirs)
  const [searchQuery, setSearchQuery] = React.useState("")
  
  // Choir Sub-tabs State
  const [activeChoirId, setActiveChoirId] = React.useState<string | null>(null)
  const [newChoirMemberName, setNewChoirMemberName] = React.useState("")

  // Modals
  const [isMemberModalOpen, setIsMemberModalOpen] = React.useState(false)
  const [isDeptModalOpen, setIsDeptModalOpen] = React.useState(false)
  const [isChoirModalOpen, setIsChoirModalOpen] = React.useState(false)
  
  const [editingMember, setEditingMember] = React.useState<Member | null>(null)
  const [editingDept, setEditingDept] = React.useState<Department | null>(null)
  const [editingChoir, setEditingChoir] = React.useState<Choir | null>(null)
  const [leaderSearchQuery, setLeaderSearchQuery] = React.useState("")

  // Member Form State
  const [memberFormData, setMemberFormData] = React.useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    isCouncil: false,
    isDeacon: false,
    isDeaconess: false,
    position: "",
    responsibilities: ""
  })

  // Dept Form State
  const [deptFormData, setDeptFormData] = React.useState({
    name: "",
    leaderName: "",
    activities: ""
  })

  // Choir Form State
  const [choirFormData, setChoirFormData] = React.useState<{
    name: string
    leaderName: string
    memberIds: string[]
  }>({
    name: "",
    leaderName: "",
    memberIds: []
  })

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

  const loadData = async () => {
    const year = localStorage.getItem('selected_year') || new Date().getFullYear().toString()
    
    // Load from Database via Server Actions
    setMembers(await getMembers(year))
    setChoirs(await getChoirs(year))
    setDepartments(await getDepartments(year))
  }

  const openAddMemberModal = () => {
    setEditingMember(null)
    setMemberFormData({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      isCouncil: false,
      isDeacon: false,
      isDeaconess: false,
      position: "",
      responsibilities: ""
    })
    setIsMemberModalOpen(true)
  }

  const openEditMemberModal = (member: Member) => {
    setEditingMember(member)
    setMemberFormData({
      firstName: member.firstName,
      lastName: member.lastName,
      email: member.email || "",
      phone: member.phone || "",
      isCouncil: member.isCouncil,
      isDeacon: member.isDeacon || false,
      isDeaconess: member.isDeaconess || false,
      position: member.position || "",
      responsibilities: member.responsibilities || ""
    })
    setIsMemberModalOpen(true)
  }

  const openAddDeptModal = () => {
    setEditingDept(null)
    setDeptFormData({
      name: "",
      leaderName: "",
      activities: ""
    })
    setIsDeptModalOpen(true)
  }

  const openEditDeptModal = (dept: Department) => {
    setEditingDept(dept)
    setDeptFormData({
      name: dept.name,
      leaderName: dept.leaderName,
      activities: dept.activities || ""
    })
    setIsDeptModalOpen(true)
  }

  const openAddChoirModal = () => {
    setEditingChoir(null)
    setChoirFormData({
      name: "",
      leaderName: "",
      memberIds: []
    })
    setIsChoirModalOpen(true)
  }

  const openEditChoirModal = (choir: Choir) => {
    setEditingChoir(choir)
    setChoirFormData({
      name: choir.name,
      leaderName: choir.leaderName,
      memberIds: choir.memberIds || []
    })
    setIsChoirModalOpen(true)
  }

  const handleSaveMember = async () => {
    const year = localStorage.getItem("selected_year") || new Date().getFullYear().toString()
    
 await saveMember({
  ...memberFormData,
  id: editingMember?.id,
  year,
  isBaptized: false
})
    
    setIsMemberModalOpen(false)
    loadData()
  }

  const handleSaveDept = async () => {
    const year = localStorage.getItem("selected_year") || new Date().getFullYear().toString()
    
    await saveDepartment({
      ...deptFormData,
      id: editingDept?.id,
      year
    })
    
    setIsDeptModalOpen(false)
    loadData()
  }

  const handleSaveChoir = async () => {
    const year = localStorage.getItem("selected_year") || new Date().getFullYear().toString()
    if (!choirFormData.name || !choirFormData.leaderName) {
      alert(t.choirVal)
      return
    }

    await saveChoir({
      ...choirFormData,
      id: editingChoir?.id,
      year
    })
    
    setIsChoirModalOpen(false)
    loadData()
  }

  const deleteItem = async (id: string, type: 'member' | 'dept' | 'choir') => {
    if (confirm(`${t.confirmDel} ${type}?`)) {
      if (type === 'member') await deleteMember(id)
      else if (type === 'dept') await deleteDepartment(id)
      else await deleteChoir(id)
      loadData()
    }
  }

  const addNameToList = async () => {
    if (!activeChoirId || !newChoirMemberName.trim()) return
    const year = localStorage.getItem("selected_year") || new Date().getFullYear().toString()
    
    const choir = choirs.find(c => c.id === activeChoirId)
    if (choir) {
      await saveChoir({
        ...choir,
        memberNames: [...(choir.memberNames || []), newChoirMemberName.trim()]
      })
      setNewChoirMemberName("")
      loadData()
    }
  }

  const removeNameFromList = async (choirId: string, nameToRemove: string) => {
    const choir = choirs.find(c => c.id === choirId)
    if (choir) {
      await saveChoir({
        ...choir,
        memberNames: (choir.memberNames || []).filter((name: string) => name !== nameToRemove)
      })
      loadData()
    }
  }

  const filteredMembers = members.filter(member => {
    // Filter by tab type
    if (activeTab === "members") {
      if (member.isCouncil || member.isDeacon || member.isDeaconess) return false;
    } else if (activeTab === "council") {
      if (!member.isCouncil) return false;
    } else if (activeTab === "deacons") {
      if (!member.isDeacon) return false;
    } else if (activeTab === "deaconesses") {
      if (!member.isDeaconess) return false;
    }
    
    // Filter by search query
    const query = searchQuery.toLowerCase();
    return (
      (member.firstName || "").toLowerCase().includes(query) ||
      (member.lastName || "").toLowerCase().includes(query) ||
      (member.email || "").toLowerCase().includes(query) ||
      (member.phone || "").toLowerCase().includes(query)
    );
  });

  const filteredDepts = departments.filter(dept => {
    const query = searchQuery.toLowerCase();
    return (
      (dept.name || "").toLowerCase().includes(query) ||
      (dept.leaderName || "").toLowerCase().includes(query) ||
      (dept.activities || "").toLowerCase().includes(query)
    );
  });

  const filteredChoirs = choirs.filter(choir => {
    const query = searchQuery.toLowerCase();
    return (
      (choir.name || "").toLowerCase().includes(query) ||
      (choir.leaderName || "").toLowerCase().includes(query)
    );
  });

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <YearSelector />
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">{t.title}</h2>
          <div className="flex items-center text-muted-foreground gap-2 mt-1">
            <Briefcase className="h-4 w-4" />
            <span className="text-sm font-medium">{t.labor}</span>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {activeTab === "departments" ? (
            <Button onClick={openAddDeptModal}>
              <Plus className="mr-2 h-4 w-4" /> {t.addDept}
            </Button>
          ) : activeTab === "choirs" ? (
            <Button onClick={openAddChoirModal}>
              <Plus className="mr-2 h-4 w-4" /> {t.addChoir}
            </Button>
          ) : activeTab === "deacons" ? (
            <Button onClick={openAddMemberModal}>
              <Plus className="mr-2 h-4 w-4" /> {t.addDeacon}
            </Button>
          ) : activeTab === "deaconesses" ? (
            <Button onClick={openAddMemberModal}>
              <Plus className="mr-2 h-4 w-4" /> {t.addDeaconess}
            </Button>
          ) : (
            <Button onClick={openAddMemberModal}>
              <Plus className="mr-2 h-4 w-4" /> 
              {activeTab === "members" ? t.addMem : t.addCouncil}
            </Button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b overflow-x-auto">
        <button
          className={cn(
            "px-4 py-2 text-sm font-medium border-b-2 transition-colors whitespace-nowrap",
            activeTab === "members" ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"
          )}
          onClick={() => setActiveTab("members")}
        >
          {t.tabMem}
        </button>
        <button
          className={cn(
            "px-4 py-2 text-sm font-medium border-b-2 transition-colors whitespace-nowrap",
            activeTab === "council" ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"
          )}
          onClick={() => setActiveTab("council")}
        >
          {t.tabCouncil}
        </button>
        <button
          className={cn(
            "px-4 py-2 text-sm font-medium border-b-2 transition-colors whitespace-nowrap",
            activeTab === "deacons" ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"
          )}
          onClick={() => setActiveTab("deacons")}
        >
          {t.tabDeacons}
        </button>
        <button
          className={cn(
            "px-4 py-2 text-sm font-medium border-b-2 transition-colors whitespace-nowrap",
            activeTab === "deaconesses" ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"
          )}
          onClick={() => setActiveTab("deaconesses")}
        >
          {t.tabDeaconesses}
        </button>
        <button
          className={cn(
            "px-4 py-2 text-sm font-medium border-b-2 transition-colors whitespace-nowrap",
            activeTab === "departments" ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"
          )}
          onClick={() => setActiveTab("departments")}
        >
          {t.tabDept}
        </button>
        <button
          className={cn(
            "px-4 py-2 text-sm font-medium border-b-2 transition-colors whitespace-nowrap",
            activeTab === "choirs" ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"
          )}
          onClick={() => setActiveTab("choirs")}
        >
          {t.tabChoir}
        </button>
      </div>

      <div className="space-y-4">
        {/* Search Bar */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={
                activeTab === "members" ? t.searchMembers : 
                activeTab === "council" ? t.searchCouncil : 
                activeTab === "departments" ? t.searchDepts : t.searchChoirs
              }
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-2">
          <h3 className="text-lg font-semibold px-1">
            {activeTab === "members" ? t.registeredMembers : 
             activeTab === "council" ? t.councilList : 
             activeTab === "deacons" ? t.deaconsList :
             activeTab === "deaconesses" ? t.deaconessesList :
             activeTab === "departments" ? t.churchDepts : t.registeredChoirs}
          </h3>
          
          <div className="rounded-md border bg-card">
            <div className="relative w-full overflow-auto">
              <table className="w-full caption-bottom text-sm">
                <thead className="[&_tr]:border-b">
                  <tr className="border-b transition-colors hover:bg-muted/50">
                    {activeTab === "choirs" ? (
                      <>
                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">{t.choirName}</th>
                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">{t.leader}</th>
                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">{t.memCount}</th>
                      </>
                    ) : activeTab === "departments" ? (
                      <>
                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">{t.deptName}</th>
                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">{t.leader}</th>
                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">{t.activities}</th>
                      </>
                    ) : (
                      <>
                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">{t.name}</th>
                        {(activeTab === "council" || activeTab === "deacons" || activeTab === "deaconesses") && (
                          <>
                            <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">{t.position}</th>
                            <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">{t.responsibilities}</th>
                          </>
                        )}
                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">{t.email}</th>
                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">{t.phone}</th>
                      </>
                    )}
                    <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">{t.actions}</th>
                  </tr>
                </thead>
                <tbody className="[&_tr:last-child]:border-0">
                  {activeTab === "choirs" ? (
                    filteredChoirs.length > 0 ? (
                      filteredChoirs.map((choir) => {
                        return (
                          <tr key={choir.id} className="border-b transition-colors hover:bg-muted/50">
                            <td className="p-4 align-middle font-medium">{choir.name}</td>
                            <td className="p-4 align-middle">
                              {choir.leaderName || <span className="text-muted-foreground italic">No leader assigned</span>}
                            </td>
                            <td className="p-4 align-middle">{(choir.memberIds?.length || 0) + (choir.memberNames?.length || 0)} members</td>
                            <td className="p-4 align-middle text-right space-x-2">
                              <Button variant="ghost" size="icon" onClick={() => openEditChoirModal(choir)}>
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon" className="text-destructive" onClick={() => deleteItem(choir.id, 'choir')}>
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </td>
                          </tr>
                        )
                      })
                    ) : (
                      <tr><td colSpan={4} className="h-24 text-center align-middle">{t.noChoir}</td></tr>
                    )
                  ) : activeTab === "departments" ? (
                    filteredDepts.length > 0 ? (
                      filteredDepts.map((dept) => {
                        return (
                          <tr key={dept.id} className="border-b transition-colors hover:bg-muted/50">
                            <td className="p-4 align-middle font-medium">{dept.name}</td>
                            <td className="p-4 align-middle">
                              {dept.leaderName || <span className="text-muted-foreground italic">No leader assigned</span>}
                            </td>
                            <td className="p-4 align-middle text-xs max-w-[300px] truncate">{dept.activities}</td>
                            <td className="p-4 align-middle text-right space-x-2">
                              <Button variant="ghost" size="icon" onClick={() => openEditDeptModal(dept)}>
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon" className="text-destructive" onClick={() => deleteItem(dept.id, 'dept')}>
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </td>
                          </tr>
                        )
                      })
                    ) : (
                      <tr><td colSpan={4} className="h-24 text-center align-middle">{t.noDept}</td></tr>
                    )
                  ) : (
                    filteredMembers.length > 0 ? (
                      filteredMembers.map((member) => (
                        <tr key={member.id} className="border-b transition-colors hover:bg-muted/50">
                          <td className="p-4 align-middle font-medium">{member.firstName} {member.lastName}</td>
                          {(activeTab === "council" || activeTab === "deacons" || activeTab === "deaconesses") && (
                            <>
                              <td className="p-4 align-middle">{member.position}</td>
                              <td className="p-4 align-middle text-xs max-w-[200px] truncate">{member.responsibilities}</td>
                            </>
                          )}
                          <td className="p-4 align-middle">{member.email}</td>
                          <td className="p-4 align-middle">{member.phone}</td>
                          <td className="p-4 align-middle text-right space-x-2">
                            <Button variant="ghost" size="icon" onClick={() => openEditMemberModal(member)}>
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="text-destructive" onClick={() => deleteItem(member.id, 'member')}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={activeTab === "council" || activeTab === "deacons" || activeTab === "deaconesses" ? 6 : 5} className="h-24 text-center align-middle">{t.noMem}</td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Choir Sub-tabs Section */}
          {activeTab === "choirs" && choirs.length > 0 && (
            <div className="mt-8 space-y-6 pt-6 border-t">
              <div className="flex items-center gap-2">
                <Music className="h-5 w-5 text-primary" />
                <h3 className="text-xl font-bold">Choir Personnel Management</h3>
              </div>
              
              <div className="flex gap-2 border-b overflow-x-auto pb-2">
                {choirs.map(choir => (
                  <button
                    key={choir.id}
                    onClick={() => setActiveChoirId(choir.id)}
                    className={cn(
                      "px-4 py-2 text-sm font-semibold rounded-md transition-all whitespace-nowrap",
                      activeChoirId === choir.id 
                        ? "bg-primary text-primary-foreground shadow-md" 
                        : "bg-muted text-muted-foreground hover:bg-muted/80"
                    )}
                  >
                    {choir.name}
                  </button>
                ))}
              </div>

              {activeChoirId && (
                <div className="bg-muted/30 rounded-xl p-6 space-y-4 border">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <h4 className="text-lg font-bold text-primary">
                        {choirs.find(c => c.id === activeChoirId)?.name} Member List
                      </h4>
                      <p className="text-sm text-muted-foreground">Add new members by name below.</p>
                    </div>
                    <div className="flex gap-2 max-w-md w-full">
                      <Input 
                        placeholder="Enter full name..." 
                        value={newChoirMemberName}
                        onChange={(e) => setNewChoirMemberName(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && addNameToList()}
                      />
                      <Button onClick={addNameToList}>
                        <Plus className="h-4 w-4 mr-2" /> Add
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 pt-4">
                    {(choirs.find(c => c.id === activeChoirId)?.memberNames || []).length > 0 ? (
                      (choirs.find(c => c.id === activeChoirId)?.memberNames || []).map((name, i) => (
                        <div key={i} className="flex items-center justify-between bg-background p-3 rounded-lg border shadow-sm group">
                          <span className="font-medium text-sm">{name}</span>
                          <button 
                            onClick={() => removeNameFromList(activeChoirId, name)}
                            className="text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      ))
                    ) : (
                      <div className="col-span-full py-8 text-center border-2 border-dashed rounded-lg bg-background/50">
                        <p className="text-muted-foreground text-sm italic">No members added to this choir yet.</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Member Modal */}
      {isMemberModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md bg-background rounded-lg shadow-lg p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold">{editingMember ? t.editMem : t.regNewMem}</h3>
              <Button variant="ghost" size="sm" onClick={() => setIsMemberModalOpen(false)}><X className="h-4 w-4" /></Button>
            </div>
            <div className="grid gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label>{t.firstName}</Label>
                  <Input value={memberFormData.firstName} onChange={(e) => setMemberFormData({...memberFormData, firstName: e.target.value})} />
                </div>
                <div className="grid gap-2">
                  <Label>{t.lastName}</Label>
                  <Input value={memberFormData.lastName} onChange={(e) => setMemberFormData({...memberFormData, lastName: e.target.value})} />
                </div>
              </div>
              <div className="grid gap-2">
                <Label>{t.email}</Label>
                <Input value={memberFormData.email} onChange={(e) => setMemberFormData({...memberFormData, email: e.target.value})} />
              </div>
              <div className="grid gap-2">
                <Label>{t.phoneNum}</Label>
                <Input value={memberFormData.phone} onChange={(e) => setMemberFormData({...memberFormData, phone: e.target.value})} />
              </div>
              <div className="grid grid-cols-2 gap-2 pt-2">
                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="is-council" checked={memberFormData.isCouncil} onChange={(e) => setMemberFormData({...memberFormData, isCouncil: e.target.checked})} />
                  <Label htmlFor="is-council" className="text-xs">{t.councilMember}</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="is-deacon" checked={memberFormData.isDeacon} onChange={(e) => setMemberFormData({...memberFormData, isDeacon: e.target.checked, isDeaconess: false})} />
                  <Label htmlFor="is-deacon" className="text-xs">{t.tabDeacons}</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="is-deaconess" checked={memberFormData.isDeaconess} onChange={(e) => setMemberFormData({...memberFormData, isDeaconess: e.target.checked, isDeacon: false})} />
                  <Label htmlFor="is-deaconess" className="text-xs">{t.tabDeaconesses}</Label>
                </div>
              </div>
              {(memberFormData.isCouncil || memberFormData.isDeacon || memberFormData.isDeaconess) && (
                <>
                  <div className="grid gap-2">
                    <Label>{t.position}</Label>
                    <Input value={memberFormData.position} placeholder={t.selectPos} onChange={(e) => setMemberFormData({...memberFormData, position: e.target.value})} />
                  </div>
                  <div className="grid gap-2">
                    <Label>{t.responsibilities}</Label>
                    <textarea className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm" placeholder={t.listResp} value={memberFormData.responsibilities} onChange={(e) => setMemberFormData({...memberFormData, responsibilities: e.target.value})} />
                  </div>
                </>
              )}
              <div className="flex gap-2 pt-2">
                <Button variant="outline" className="flex-1" onClick={() => setIsMemberModalOpen(false)}>{t.cancel}</Button>
                <Button className="flex-1" onClick={handleSaveMember}>{editingMember ? t.update : t.register}</Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Dept Modal */}
      {isDeptModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md bg-background rounded-lg shadow-lg p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold">{editingDept ? t.editDept : t.regDept}</h3>
              <Button variant="ghost" size="sm" onClick={() => setIsDeptModalOpen(false)}><X className="h-4 w-4" /></Button>
            </div>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label>{t.deptName}</Label>
                <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={deptFormData.name} onChange={(e) => setDeptFormData({...deptFormData, name: e.target.value})}>
                  <option value="">{t.selectDept}</option>
                  {DEPARTMENT_NAMES.map(name => <option key={name} value={name}>{name}</option>)}
                </select>
              </div>
              <div className="grid gap-2">
                <Label>{t.leader}</Label>
                <Input value={deptFormData.leaderName} onChange={(e) => setDeptFormData({...deptFormData, leaderName: e.target.value})} placeholder={t.leader} />
              </div>
              <div className="grid gap-2">
                <Label>{t.manageAct}</Label>
                <textarea className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm" placeholder={t.descDeptAct} value={deptFormData.activities} onChange={(e) => setDeptFormData({...deptFormData, activities: e.target.value})} />
              </div>
              <div className="flex gap-2 pt-2">
                <Button variant="outline" className="flex-1" onClick={() => setIsDeptModalOpen(false)}>{t.cancel}</Button>
                <Button className="flex-1" onClick={handleSaveDept}>{editingDept ? t.update : t.save}</Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Choir Modal */}
      {isChoirModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md bg-background rounded-lg shadow-lg p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold">{editingChoir ? t.editChoir : t.regChoir}</h3>
              <Button variant="ghost" size="sm" onClick={() => setIsChoirModalOpen(false)}><X className="h-4 w-4" /></Button>
            </div>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label>{t.choirName}</Label>
                <Input value={choirFormData.name} onChange={(e) => setChoirFormData({...choirFormData, name: e.target.value})} />
              </div>
              <div className="grid gap-2">
                <Label>{t.assignLeader}</Label>
                <Input value={choirFormData.leaderName} onChange={(e) => setChoirFormData({...choirFormData, leaderName: e.target.value})} placeholder={t.assignLeader} />
              </div>
              <div className="flex gap-2 pt-2">
                <Button variant="outline" className="flex-1" onClick={() => setIsChoirModalOpen(false)}>{t.cancel}</Button>
                <Button className="flex-1" onClick={handleSaveChoir}>{editingChoir ? t.update : t.register}</Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
