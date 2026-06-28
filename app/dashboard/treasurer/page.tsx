"use client"

import * as React from "react"
import { 
  DollarSign, 
  PieChart, 
  Receipt, 
  Wallet, 
  Plus, 
  ArrowUpCircle, 
  ArrowDownCircle, 
  Calendar,
  Filter,
  Download,
  FileSpreadsheet,
  FileText,
  BookOpen,
  Gift as GiftIcon
} from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select } from "@/components/ui/select"
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { YearSelector } from "@/components/year-selector"

import * as XLSX from 'xlsx'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

import { 
  getFinances, saveFinance, deleteFinance,
  getInventory, saveInventory, deleteInventory
} from "@/lib/actions"

// --- Translations ---

const translations = {
  en: {
    title: "Treasurer Dashboard",
    overview: "Overview",
    income: "Income",
    expenses: "Expenses",
    reports: "Reports",
    properties: "Properties",
    books: "Books",
    gifts: "Gifts",
    totalBalance: "Total Balance",
    totalIncome: "Total Income",
    totalExpenses: "Total Expenses",
    recentTransactions: "Recent Transactions",
    quickAdd: "Quick Add",
    incomeManagement: "Income Management",
    expenseManagement: "Expense Management",
    propertyManagement: "Property Management",
    incomeBreakdown: "Income Breakdown",
    expenseBreakdown: "Expense Breakdown",
    monthlySummary: "Monthly Summary",
    type: "Type",
    category: "Category",
    specifyCategory: "Specify Category",
    amount: "Amount",
    description: "Description",
    date: "Date",
    actions: "Actions",
    addTransaction: "Add Transaction",
    addBook: "Add Book",
    addGift: "Add Gift",
    edit: "Edit",
    delete: "Delete",
    excel: "Excel",
    pdf: "PDF",
    incomeSub: "Track Tithes, Offerings, and Donations",
    expenseSub: "Manage projects, welfare, and utilities",
    propertySub: "Manage books and gifts",
    recentSub: "Latest financial activities",
    quickSub: "Record a new entry",
    other: "Other",
    specifyPlaceholder: "e.g. Special Project",
    descPlaceholder: "Monthly payment...",
    noTransactions: "No transactions found",
    noIncome: "No income recorded yet.",
    noExpenses: "No expenses recorded yet.",
    noProperties: "No properties recorded yet.",
    bookName: "Book Name",
    count: "Count",
    giftName: "Gift Name",
    issuedTo: "Who Issued",
    issuedDate: "Issued Date",
    months: [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ],
    year: "Year",
    month: "Month",
    generateReport: "Generate Monthly Report",
    categories: {
      Tithes: "Tithes",
      Offerings: "Offerings",
      Donations: "Donations",
      Other: "",
      "Church projects": "Church projects",
      Welfare: "Welfare",
      Utilities: "Utilities",
      Salaries: "Salaries",
      Maintenance: "Maintenance"
    }
  },
  fr: {
    title: "Tableau de bord du trésorier",
    overview: "Aperçu",
    income: "Revenus",
    expenses: "Dépenses",
    reports: "Rapports",
    properties: "Propriétés",
    books: "Livres",
    gifts: "Cadeaux",
    totalBalance: "Solde Total",
    totalIncome: "Total des Revenus",
    totalExpenses: "Total des Dépenses",
    recentTransactions: "Transactions Récentes",
    quickAdd: "Ajout Rapide",
    incomeManagement: "Gestion des Revenus",
    expenseManagement: "Gestion des Dépenses",
    propertyManagement: "Gestion des Propriétés",
    incomeBreakdown: "Répartition des Revenus",
    expenseBreakdown: "Répartition des Dépenses",
    monthlySummary: "Résumé Mensuel",
    type: "Type",
    category: "Catégorie",
    specifyCategory: "Spécifier la catégorie",
    amount: "Montant",
    description: "Description",
    date: "Date",
    actions: "Actions",
    addTransaction: "Ajouter",
    addBook: "Ajouter un livre",
    addGift: "Ajouter un cadeau",
    edit: "Modifier",
    delete: "Supprimer",
    excel: "Excel",
    pdf: "PDF",
    incomeSub: "Suivi des dîmes, offrandes et dons",
    expenseSub: "Gérer les projets, le bien-être et les services publics",
    propertySub: "Gérer les livres et les cadeaux de l'église",
    recentSub: "Dernières activités financières",
    quickSub: "Enregistrer une nouvelle entrée",
    other: "Autre",
    specifyPlaceholder: "ex. Projet Spécial",
    descPlaceholder: "Paiement mensuel...",
    noTransactions: "Aucune transaction trouvée",
    noIncome: "Aucun revenu enregistré pour le moment.",
    noExpenses: "Aucune dépense enregistrée.",
    noProperties: "Aucune propriété enregistrée.",
    bookName: "Nom du livre",
    count: "Nombre",
    giftName: "Nom du cadeau",
    issuedTo: "Délivré à",
    issuedDate: "Date d'émission",
    months: [
      "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
      "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"
    ],
    year: "Année",
    month: "Mois",
    generateReport: "Générer le rapport mensuel",
    categories: {
      Tithes: "Dîmes",
      Offerings: "Offrandes",
      Donations: "Dons",
      Other: "Autre",
      "Church projects": "Projets de l'église",
      Welfare: "Bien-être",
      Utilities: "Services publics",
      Salaries: "Salaires",
      Maintenance: "Entretien"
    }
  }
}

// --- Types ---

type TransactionType = 'income' | 'expense'

interface Transaction {
  id: string
  type: string 
  category: string
  amount: number
  date: string
  description: string | null
}

interface Book {
  id: string
  name: string
  date: string
  count: number | null
  description: string | null
}

interface Gift {
  id: string
  name: string
  issuedTo: string | null
  date: string
}

// In-memory runtime cache for synchronizing reports within the app session without LocalStorage
let sessionChurchReports: any[] = []

const STANDARD_INCOME = ['Tithes', 'Offerings', 'Donations']
const INCOME_CATEGORIES = [...STANDARD_INCOME, 'Other']
const STANDARD_EXPENSES = ['Church projects', 'Welfare', 'Utilities', 'Salaries', 'Maintenance']
const EXPENSE_CATEGORIES = [...STANDARD_EXPENSES, 'Other']

export default function TreasurerDashboard() {
  const [transactions, setTransactions] = React.useState<Transaction[]>([])
  const [books, setBooks] = React.useState<Book[]>([])
  const [gifts, setGifts] = React.useState<Gift[]>([])
  const [activeTab, setActiveTab] = React.useState('overview')
  const [lang, setLang] = React.useState<"en" | "rw" | "fr">("en")
  
  const [selectedMonth, setSelectedMonth] = React.useState(new Date().getMonth())
  const [selectedYear, setSelectedYear] = React.useState(new Date().getFullYear())
  const [selectedReportCategory, setSelectedReportCategory] = React.useState<string>("All")

  // Form States
  const [formData, setFormData] = React.useState({
    type: 'income' as TransactionType,
    category: INCOME_CATEGORIES[0],
    customCategory: '',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    description: ''
  })

  const [bookFormData, setBookFormData] = React.useState({
    name: '',
    date: new Date().toISOString().split('T')[0],
    count: '',
    description: ''
  })

  const [giftFormData, setGiftFormData] = React.useState({
    name: '',
    issuedTo: '',
    date: new Date().toISOString().split('T')[0]
  })

  const [editingBookId, setEditingBookId] = React.useState<string | null>(null)
  const [editingGiftId, setEditingGiftId] = React.useState<string | null>(null)

  const loadData = React.useCallback(async (customYear?: string) => {
    const fallbackYear = new Date().getFullYear().toString()
    const targetYear = customYear || selectedYear.toString() || fallbackYear

    setTransactions(await getFinances(targetYear))
    const inventory = await getInventory(targetYear)
    setBooks(inventory.filter((item: any) => item.type === 'book'))
    setGifts(inventory.filter((item: any) => item.type === 'gift'))
  }, [selectedYear])

  // Load data and setup custom state event listeners
  React.useEffect(() => {
    loadData()

    const handleLangChange = (e: Event) => {
      const customEvent = e as CustomEvent
      if (customEvent.detail && ["en", "rw", "fr"].includes(customEvent.detail)) {
        setLang(customEvent.detail)
      }
    }

    const handleYearChange = (e: Event) => {
      const customEvent = e as CustomEvent
      if (customEvent.detail) {
        const newYear = Number(customEvent.detail.toString().split('-')[0])
        setSelectedYear(newYear)
        loadData(customEvent.detail.toString())
      } else {
        loadData()
      }
    }

    window.addEventListener("lang-change", handleLangChange)
    window.addEventListener("year-changed", handleYearChange)
    window.addEventListener("storage", () => loadData())
    
    return () => {
      window.removeEventListener("lang-change", handleLangChange)
      window.removeEventListener("year-changed", handleYearChange)
      window.removeEventListener("storage", () => loadData())
    }
  }, [loadData])

  const t = translations[lang === "rw" ? "en" : lang]

  // --- Calculations ---

  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0)

  const totalExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0)

  const balance = totalIncome - totalExpenses

  const recentTransactions = [...transactions]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5)

  // --- Handlers ---

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value,
      ...(name === 'type' ? { 
        category: value === 'income' ? INCOME_CATEGORIES[0] : EXPENSE_CATEGORIES[0],
        customCategory: ''
      } : {}),
      ...(name === 'category' && value !== 'Other' ? { customCategory: '' } : {})
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.amount || isNaN(Number(formData.amount))) return

    const finalCategory = formData.category === 'Other' && formData.customCategory 
      ? formData.customCategory 
      : formData.category

    await saveFinance({
      type: formData.type,
      category: finalCategory,
      amount: Number(formData.amount),
      date: formData.date,
      description: formData.description,
      year: selectedYear.toString()
    })

    setFormData(prev => ({
      ...prev,
      amount: '',
      description: '',
      customCategory: ''
    }))
    loadData()
  }

  const deleteTransaction = async (id: string) => {
    await deleteFinance(id)
    loadData()
  }

  const handleBookSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!bookFormData.name || !bookFormData.count) return

    await saveInventory({
      id: editingBookId,
      type: 'book',
      name: bookFormData.name,
      date: bookFormData.date,
      count: Number(bookFormData.count),
      description: bookFormData.description,
      year: selectedYear.toString()
    })

    setEditingBookId(null)
    setBookFormData({ name: '', date: new Date().toISOString().split('T')[0], count: '', description: '' })
    loadData()
  }

  const handleGiftSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!giftFormData.name || !giftFormData.issuedTo) return

    await saveInventory({
      id: editingGiftId,
      type: 'gift',
      name: giftFormData.name,
      issuedTo: giftFormData.issuedTo,
      date: giftFormData.date,
      year: selectedYear.toString()
    })

    setEditingGiftId(null)
    setGiftFormData({ name: '', issuedTo: '', date: new Date().toISOString().split('T')[0] })
    loadData()
  }

  const deleteBook = async (id: string) => {
    await deleteInventory(id)
    loadData()
  }

  const deleteGift = async (id: string) => {
    await deleteInventory(id)
    loadData()
  }

  const startEditingBook = (book: Book) => {
    setEditingBookId(book.id)
    setBookFormData({ 
      name: book.name, 
      date: book.date, 
      count: book.count?.toString() || '0', 
      description: book.description || '' 
    })
  }

  const startEditingGift = (gift: Gift) => {
    setEditingGiftId(gift.id)
    setGiftFormData({ name: gift.name, issuedTo: gift.issuedTo || '', date: gift.date })
  }

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(transactions)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, "Finances")
    XLSX.writeFile(workbook, "church_finances.xlsx")
  }

  const exportToPDF = () => {
    const doc = new jsPDF()
    const pageWidth = doc.internal.pageSize.getWidth()
    
    doc.setFontSize(10)
    doc.text(`${t.date}: ${new Date().toLocaleDateString()}`, pageWidth - 14, 10, { align: 'right' })

    doc.setFontSize(22)
    doc.setFont("helvetica", "bold")
    doc.text("Church Treasurer", pageWidth / 2, 25, { align: 'center' })
    
    doc.setFontSize(16)
    doc.text("Financial Report", pageWidth / 2, 35, { align: 'center' })
    
    const tableData = transactions.map(tr => [
      tr.date, 
      tr.type.toUpperCase(), 
      tr.category, 
      formatCurrency(tr.amount), 
      tr.description || '-'
    ])

    autoTable(doc, {
      head: [[t.date, t.type, t.category, t.amount, t.description]],
      body: tableData,
      startY: 45,
      theme: 'grid',
      headStyles: { fillColor: [75, 85, 99] }
    })

    const finalY = (doc as any).lastAutoTable.finalY || 40
    let currentY = finalY + 15

    doc.setFont("helvetica", "bold")
    doc.text("Income Summary by Category:", 14, currentY)
    doc.setFont("helvetica", "normal")
    
    currentY += 7
    const formatRF = (amt: number) => `RF ${amt.toLocaleString()}`

    INCOME_CATEGORIES.forEach(cat => {
      const catTransactions = transactions.filter(tr => tr.type === 'income' && (
        cat === 'Other' 
          ? !STANDARD_INCOME.includes(tr.category)
          : tr.category === cat
      ))
      const catTotal = catTransactions.reduce((sum, tr) => sum + tr.amount, 0)
      
      const catLabel = t.categories[cat as keyof typeof t.categories] || cat
      doc.text(`${catLabel}: ${formatRF(catTotal)}`, 20, currentY)
      currentY += 7

      if (cat === 'Other' && catTransactions.length > 0) {
        doc.setFontSize(10)
        catTransactions.forEach(tr => {
          const specName = STANDARD_INCOME.includes(tr.category) ? (tr.description || t.other) : tr.category
          doc.text(`- ${specName}: ${formatRF(tr.amount)}`, 25, currentY)
          currentY += 5
        })
        doc.setFontSize(12)
        currentY += 2
      }
    })

    doc.setFont("helvetica", "bold")
    doc.text(`General Total Income: ${formatRF(totalIncome)}`, 14, currentY + 5)
    doc.text(`General Total Expenses: ${formatRF(totalExpenses)}`, 14, currentY + 12)
    doc.setFont("helvetica", "normal")

    doc.save("church_report.pdf")
  }

  const generateMonthlyReport = () => {
    if (!selectedYear) {
      alert(lang === 'rw' ? 'Nyamuneka hitamo umwaka w\'itorero!' : (lang === 'fr' ? 'Veuillez sélectionner une année d\'église !' : 'Please select a church year!'))
      return
    }
    const monthStr = `${selectedYear}-${(selectedMonth + 1).toString().padStart(2, '0')}`
    let monthlyTransactions = transactions.filter(tr => tr.date.startsWith(monthStr))
    
    if (selectedReportCategory !== "All") {
      monthlyTransactions = monthlyTransactions.filter(tr => tr.category === selectedReportCategory)
    }

    if (monthlyTransactions.length === 0) {
      alert(t.noTransactions)
      return
    }

    const doc = new jsPDF()
    const pageWidth = doc.internal.pageSize.getWidth()
    
    doc.setFontSize(10)
    doc.text(`${t.date}: ${new Date().toLocaleDateString()}`, pageWidth - 14, 10, { align: 'right' })

    doc.setFontSize(22)
    doc.setFont("helvetica", "bold")
    doc.text("Church Treasurer", pageWidth / 2, 25, { align: 'center' })
    
    doc.setFontSize(16)
    const categoryTitle = selectedReportCategory === "All" ? "" : ` - ${t.categories[selectedReportCategory as keyof typeof t.categories] || selectedReportCategory}`
    doc.text(`${t.months[selectedMonth]} ${selectedYear}${categoryTitle} Report`, pageWidth / 2, 35, { align: 'center' })
    
    const tableData = monthlyTransactions.map(tr => [
      tr.date, 
      tr.type.toUpperCase(), 
      tr.category, 
      formatCurrency(tr.amount), 
      tr.description || '-'
    ])

    autoTable(doc, {
      head: [[t.date, t.type, t.category, t.amount, t.description]],
      body: tableData,
      startY: 45,
      theme: 'grid',
      headStyles: { fillColor: [75, 85, 99] }
    })

    const finalY = (doc as any).lastAutoTable.finalY || 40
    let currentY = finalY + 15

    const monthIncome = monthlyTransactions.filter(tr => tr.type === 'income').reduce((sum, tr) => sum + tr.amount, 0)
    const monthExpenses = monthlyTransactions.filter(tr => tr.type === 'expense').reduce((sum, tr) => sum + tr.amount, 0)

    doc.setFont("helvetica", "bold")
    doc.text("Summary:", 14, currentY)
    doc.setFont("helvetica", "normal")
    currentY += 10
    
    if (selectedReportCategory === "All" || monthlyTransactions.some(tr => tr.type === 'income')) {
      doc.text(`Total Income: ${formatCurrency(monthIncome)}`, 20, currentY)
      currentY += 7
    }
    if (selectedReportCategory === "All" || monthlyTransactions.some(tr => tr.type === 'expense')) {
      doc.text(`Total Expenses: ${formatCurrency(monthExpenses)}`, 20, currentY)
      currentY += 7
    }
    
    if (selectedReportCategory === "All") {
      doc.setFont("helvetica", "bold")
      doc.text(`Balance: ${formatCurrency(monthIncome - monthExpenses)}`, 20, currentY)
    }

    const fileName = `Church_Report_${t.months[selectedMonth]}_${selectedYear}${selectedReportCategory !== "All" ? "_" + selectedReportCategory : ""}.pdf`
    doc.save(fileName)

    // Synchronize with Elder using runtime session variable
    const newReport = {
      id: Math.random().toString(36).substr(2, 9),
      title: "Monthly Tithe & Offerings",
      month: `${t.months[selectedMonth]} ${selectedYear}`,
      total: formatCurrency(monthIncome),
      status: "Verified",
      type: "Financial",
      pdfUrl: "#"
    }
    sessionChurchReports = [newReport, ...sessionChurchReports]
    window.dispatchEvent(new Event("storage"))
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-RW', { style: 'currency', currency: 'RWF', maximumFractionDigits: 0 }).format(amount)
  }

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <YearSelector />
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">{t.title}</h2>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={exportToExcel}>
            <FileSpreadsheet className="mr-2 h-4 w-4" />
            {t.excel}
          </Button>
          <Button variant="outline" size="sm" onClick={exportToPDF}>
            <FileText className="mr-2 h-4 w-4" />
            {t.pdf}
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-4" onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview">{t.overview}</TabsTrigger>
          <TabsTrigger value="income">{t.income}</TabsTrigger>
          <TabsTrigger value="expenses">{t.expenses}</TabsTrigger>
          <TabsTrigger value="properties">{t.properties}</TabsTrigger>
          <TabsTrigger value="reports">{t.reports}</TabsTrigger>
        </TabsList>

        {/* --- Overview Tab --- */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{t.totalBalance}</CardTitle>
                <Wallet className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {formatCurrency(balance)}
                </div>
                <p className="text-xs text-muted-foreground">{t.totalBalance}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{t.totalIncome}</CardTitle>
                <ArrowUpCircle className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(totalIncome)}</div>
                <p className="text-xs text-muted-foreground">{t.totalIncome}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{t.totalExpenses}</CardTitle>
                <ArrowDownCircle className="h-4 w-4 text-red-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(totalExpenses)}</div>
                <p className="text-xs text-muted-foreground">{t.totalExpenses}</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>{t.recentTransactions}</CardTitle>
                <CardDescription>{t.recentSub}</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{t.date}</TableHead>
                      <TableHead>{t.category}</TableHead>
                      <TableHead>{t.amount}</TableHead>
                      <TableHead className="text-right">{t.type}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentTransactions.map((tr) => (
                      <TableRow key={tr.id}>
                        <TableCell className="font-medium">{tr.date}</TableCell>
                        <TableCell>{t.categories[tr.category as keyof typeof t.categories] || tr.category}</TableCell>
                        <TableCell>{formatCurrency(tr.amount)}</TableCell>
                        <TableCell className="text-right">
                          <span className={`px-2 py-1 rounded-full text-xs ${tr.type === 'income' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                            {tr.type === 'income' ? t.income : t.expenses}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
                    {recentTransactions.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center py-4 text-muted-foreground">
                          {t.noTransactions}
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>{t.quickAdd}</CardTitle>
                <CardDescription>{t.quickSub}</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label>{t.type}</Label>
                    <Select name="type" value={formData.type} onChange={handleInputChange}>
                      <option value="income">{t.income}</option>
                      <option value="expense">{t.expenses}</option>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>{t.category}</Label>
                    <Select name="category" value={formData.category} onChange={handleInputChange}>
                      {(formData.type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES).map(cat => (
                        <option key={cat} value={cat}>{t.categories[cat as keyof typeof t.categories] || cat}</option>
                      ))}
                    </Select>
                  </div>
                  {formData.category === 'Other' && (
                    <div className="space-y-2">
                      <Label htmlFor="customCategory">{t.specifyCategory}</Label>
                      <Input 
                        id="customCategory" 
                        name="customCategory" 
                        placeholder={t.specifyPlaceholder} 
                        value={formData.customCategory} 
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  )}
                  <div className="space-y-2">
                    <Label htmlFor="amount">{t.amount} (RWF)</Label>
                    <Input 
                      id="amount" 
                      name="amount" 
                      type="number" 
                      placeholder="50000" 
                      value={formData.amount} 
                      onChange={handleInputChange}
                      required 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">{t.description}</Label>
                    <Input 
                      id="description" 
                      name="description" 
                      placeholder={t.descPlaceholder} 
                      value={formData.description} 
                      onChange={handleInputChange}
                    />
                  </div>
                  <Button type="submit" className="w-full">
                    <Plus className="mr-2 h-4 w-4" /> {t.addTransaction}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* --- Income Tab --- */}
        <TabsContent value="income" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>{t.incomeManagement}</CardTitle>
                <CardDescription>{t.incomeSub}</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t.date}</TableHead>
                    <TableHead>{t.category}</TableHead>
                    <TableHead>{t.description}</TableHead>
                    <TableHead>{t.amount}</TableHead>
                    <TableHead className="text-right">{t.actions}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions.filter(tr => tr.type === 'income').map((tr) => (
                    <TableRow key={tr.id}>
                      <TableCell>{tr.date}</TableCell>
                      <TableCell>{t.categories[tr.category as keyof typeof t.categories] || tr.category}</TableCell>
                      <TableCell className="max-w-[200px] truncate">{tr.description || '-'}</TableCell>
                      <TableCell className="text-green-600 font-medium">+{formatCurrency(tr.amount)}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" onClick={() => deleteTransaction(tr.id)}>{t.delete}</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  {transactions.filter(tr => tr.type === 'income').length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                        {t.noIncome}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* --- Expenses Tab --- */}
        <TabsContent value="expenses" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{t.expenseManagement}</CardTitle>
              <CardDescription>{t.expenseSub}</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t.date}</TableHead>
                    <TableHead>{t.category}</TableHead>
                    <TableHead>{t.description}</TableHead>
                    <TableHead>{t.amount}</TableHead>
                    <TableHead className="text-right">{t.actions}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions.filter(tr => tr.type === 'expense').map((tr) => (
                    <TableRow key={tr.id}>
                      <TableCell>{tr.date}</TableCell>
                      <TableCell>{t.categories[tr.category as keyof typeof t.categories] || tr.category}</TableCell>
                      <TableCell className="max-w-[200px] truncate">{tr.description || '-'}</TableCell>
                      <TableCell className="text-red-600 font-medium">-{formatCurrency(tr.amount)}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" onClick={() => deleteTransaction(tr.id)}>{t.delete}</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  {transactions.filter(tr => tr.type === 'expense').length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                        {t.noExpenses}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* --- Properties Tab --- */}
        <TabsContent value="properties" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{t.propertyManagement}</CardTitle>
              <CardDescription>{t.propertySub}</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="books" className="space-y-4">
                <TabsList>
                  <TabsTrigger value="books">
                    <BookOpen className="mr-2 h-4 w-4" />
                    {t.books}
                  </TabsTrigger>
                  <TabsTrigger value="gifts">
                    <GiftIcon className="mr-2 h-4 w-4" />
                    {t.gifts}
                  </TabsTrigger>
                </TabsList>

                {/* --- Books Sub-tab --- */}
                <TabsContent value="books" className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-7">
                    <div className="col-span-4">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>{t.date}</TableHead>
                            <TableHead>{t.bookName}</TableHead>
                            <TableHead>{t.count}</TableHead>
                            <TableHead>{t.description}</TableHead>
                            <TableHead className="text-right">{t.actions}</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {books.map((book) => (
                            <TableRow key={book.id}>
                              <TableCell>{book.date}</TableCell>
                              <TableCell>{book.name}</TableCell>
                              <TableCell>{book.count}</TableCell>
                              <TableCell className="max-w-[150px] truncate">{book.description || '-'}</TableCell>
                              <TableCell className="text-right space-x-2">
                                <Button variant="ghost" size="sm" onClick={() => startEditingBook(book)}>{t.edit}</Button>
                                <Button variant="ghost" size="sm" onClick={() => deleteBook(book.id)}>{t.delete}</Button>
                              </TableCell>
                            </TableRow>
                          ))}
                          {books.length === 0 && (
                            <TableRow>
                              <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                                {t.noProperties}
                              </TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    </div>
                    <div className="col-span-3">
                      <Card>
                        <CardHeader>
                          <CardTitle>{editingBookId ? t.edit : t.addBook}</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <form onSubmit={handleBookSubmit} className="space-y-4">
                            <div className="space-y-2">
                              <Label htmlFor="bookName">{t.bookName}</Label>
                              <Input 
                                id="bookName" 
                                value={bookFormData.name} 
                                onChange={(e) => setBookFormData(prev => ({ ...prev, name: e.target.value }))}
                                required
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="bookDate">{t.date}</Label>
                              <Input 
                                id="bookDate" 
                                type="date"
                                value={bookFormData.date} 
                                onChange={(e) => setBookFormData(prev => ({ ...prev, date: e.target.value }))}
                                required
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="bookCount">{t.count}</Label>
                              <Input 
                                id="bookCount" 
                                type="number"
                                value={bookFormData.count} 
                                onChange={(e) => setBookFormData(prev => ({ ...prev, count: e.target.value }))}
                                required
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="bookDesc">{t.description}</Label>
                              <Input 
                                id="bookDesc" 
                                value={bookFormData.description} 
                                onChange={(e) => setBookFormData(prev => ({ ...prev, description: e.target.value }))}
                                placeholder={t.descPlaceholder}
                              />
                            </div>
                            <Button type="submit" className="w-full">
                              {editingBookId ? t.edit : <><Plus className="mr-2 h-4 w-4" /> {t.addBook}</>}
                            </Button>
                            {editingBookId && (
                              <Button variant="outline" className="w-full" onClick={() => {
                                setEditingBookId(null)
                                setBookFormData({ name: '', date: new Date().toISOString().split('T')[0], count: '', description: '' })
                              }}>
                                Cancel
                              </Button>
                            )}
                          </form>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </TabsContent>

                {/* --- Gifts Sub-tab --- */}
                <TabsContent value="gifts" className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-7">
                    <div className="col-span-4">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>{t.issuedDate}</TableHead>
                            <TableHead>{t.giftName}</TableHead>
                            <TableHead>{t.issuedTo}</TableHead>
                            <TableHead className="text-right">{t.actions}</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {gifts.map((gift) => (
                            <TableRow key={gift.id}>
                              <TableCell>{gift.date}</TableCell>
                              <TableCell>{gift.name}</TableCell>
                              <TableCell>{gift.issuedTo}</TableCell>
                              <TableCell className="text-right space-x-2">
                                <Button variant="ghost" size="sm" onClick={() => startEditingGift(gift)}>{t.edit}</Button>
                                <Button variant="ghost" size="sm" onClick={() => deleteGift(gift.id)}>{t.delete}</Button>
                              </TableCell>
                            </TableRow>
                          ))}
                          {gifts.length === 0 && (
                            <TableRow>
                              <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                                {t.noProperties}
                              </TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    </div>
                    <div className="col-span-3">
                      <Card>
                        <CardHeader>
                          <CardTitle>{editingGiftId ? t.edit : t.addGift}</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <form onSubmit={handleGiftSubmit} className="space-y-4">
                            <div className="space-y-2">
                              <Label htmlFor="giftName">{t.giftName}</Label>
                              <Input 
                                id="giftName" 
                                value={giftFormData.name} 
                                onChange={(e) => setGiftFormData(prev => ({ ...prev, name: e.target.value }))}
                                required
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="issuedTo">{t.issuedTo}</Label>
                              <Input 
                                id="issuedTo" 
                                value={giftFormData.issuedTo} 
                                onChange={(e) => setGiftFormData(prev => ({ ...prev, issuedTo: e.target.value }))}
                                required
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="giftDate">{t.issuedDate}</Label>
                              <Input 
                                id="giftDate" 
                                type="date"
                                value={giftFormData.date} 
                                onChange={(e) => setGiftFormData(prev => ({ ...prev, date: e.target.value }))}
                                required
                              />
                            </div>
                            <Button type="submit" className="w-full">
                              {editingGiftId ? t.edit : <><Plus className="mr-2 h-4 w-4" /> {t.addGift}</>}
                            </Button>
                            {editingGiftId && (
                              <Button variant="outline" className="w-full" onClick={() => {
                                setEditingGiftId(null)
                                setGiftFormData({ name: '', issuedTo: '', date: new Date().toISOString().split('T')[0] })
                              }}>
                                Cancel
                              </Button>
                            )}
                          </form>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </TabsContent>

        {/* --- Reports Tab --- */}
        <TabsContent value="reports" className="space-y-4">
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>{t.generateReport}</CardTitle>
              <CardDescription>Select month and year to generate a detailed PDF report</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-wrap items-end gap-4">
              <div className="space-y-2">
                <Label>{t.month}</Label>
                <Select 
                  value={selectedMonth.toString()} 
                  onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                >
                  {t.months.map((month, index) => (
                    <option key={month} value={index}>{month}</option>
                  ))}
                </Select>
              </div>
              <div className="space-y-2">
                <Label>{t.year}</Label>
                <Input 
                  type="number" 
                  className="w-24"
                  value={selectedYear} 
                  onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                />
              </div>
              <div className="space-y-2">
                <Label>{t.category}</Label>
                <Select 
                  value={selectedReportCategory} 
                  onChange={(e) => setSelectedReportCategory(e.target.value)}
                >
                  <option value="All">{lang === 'rw' ? 'Byose' : (lang === 'fr' ? 'Tout' : 'All Categories')}</option>
                  {Array.from(new Set([...INCOME_CATEGORIES, ...EXPENSE_CATEGORIES])).map(cat => (
                    <option key={cat} value={cat}>{t.categories[cat as keyof typeof t.categories] || cat}</option>
                  ))}
                </Select>
              </div>
              <Button onClick={generateMonthlyReport}>
                <Download className="mr-2 h-4 w-4" />
                {t.pdf}
              </Button>
            </CardContent>
          </Card>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>{t.incomeBreakdown}</CardTitle>
                <CardDescription>{t.category}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {INCOME_CATEGORIES.map(cat => {
                    const amount = transactions
                      .filter(tr => tr.type === 'income' && (
                        cat === 'Other' 
                          ? !STANDARD_INCOME.includes(tr.category)
                          : tr.category === cat
                      ))
                      .reduce((sum, tr) => sum + tr.amount, 0)
                    const percentage = totalIncome > 0 ? (amount / totalIncome) * 100 : 0
                    
                    return (
                      <div key={cat} className="space-y-1">
                        <div className="flex items-center justify-between text-sm">
                          <span>{t.categories[cat as keyof typeof t.categories] || cat}</span>
                          <span className="font-semibold">{formatCurrency(amount)}</span>
                        </div>
                        <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-green-500 transition-all" 
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{t.expenseBreakdown}</CardTitle>
                <CardDescription>{t.category}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {EXPENSE_CATEGORIES.map(cat => {
                    const amount = transactions
                      .filter(tr => tr.type === 'expense' && (
                        cat === 'Other' 
                          ? !STANDARD_EXPENSES.includes(tr.category)
                          : tr.category === cat
                      ))
                      .reduce((sum, tr) => sum + tr.amount, 0)
                    const percentage = totalExpenses > 0 ? (amount / totalExpenses) * 100 : 0
                    
                    return (
                      <div key={cat} className="space-y-1">
                        <div className="flex items-center justify-between text-sm">
                          <span>{t.categories[cat as keyof typeof t.categories] || cat}</span>
                          <span className="font-semibold">{formatCurrency(amount)}</span>
                        </div>
                        <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-red-500 transition-all" 
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>{t.monthlySummary}</CardTitle>
                <CardDescription>Last 6 months comparison</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[200px] flex items-end justify-between px-4 pt-4 border-b">
                   {[5,4,3,2,1,0].map(i => {
                      const d = new Date()
                      d.setMonth(d.getMonth() - i)
                      const monthStr = d.toISOString().split('T')[0].substring(0, 7)
                      const monthLabel = d.toLocaleString(lang === 'rw' ? 'rw-RW' : (lang === 'fr' ? 'fr-FR' : 'en-US'), { month: 'short' })
                      
                      const monthIncome = transactions
                        .filter(tr => tr.type === 'income' && tr.date.startsWith(monthStr))
                        .reduce((sum, tr) => sum + tr.amount, 0)
                      
                      const monthExpense = transactions
                        .filter(tr => tr.type === 'expense' && tr.date.startsWith(monthStr))
                        .reduce((sum, tr) => sum + tr.amount, 0)

                      const maxVal = Math.max(totalIncome, totalExpenses, 1)
                      const incHeight = (monthIncome / maxVal) * 100
                      const expHeight = (monthExpense / maxVal) * 100

                      return (
                        <div key={monthStr} className="flex flex-col items-center space-y-2 w-1/6">
                          <div className="flex items-end space-x-1 h-[150px] w-full justify-center">
                            <div 
                              className="w-3 bg-green-500 rounded-t-sm" 
                              style={{ height: `${Math.max(incHeight, 2)}%` }}
                              title={`${t.income}: ${formatCurrency(monthIncome)}`}
                            />
                            <div 
                              className="w-3 bg-red-500 rounded-t-sm" 
                              style={{ height: `${Math.max(expHeight, 2)}%` }}
                              title={`${t.expenses}: ${formatCurrency(monthExpense)}`}
                            />
                          </div>
                          <span className="text-[10px] text-muted-foreground uppercase">{monthLabel}</span>
                        </div>
                      )
                   })}
                </div>
                <div className="flex justify-center space-x-4 mt-4 text-xs">
                  <div className="flex items-center"><div className="w-3 h-3 bg-green-500 mr-1 rounded-sm"/> {t.income}</div>
                  <div className="flex items-center"><div className="w-3 h-3 bg-red-500 mr-1 rounded-sm"/> {t.expenses}</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}