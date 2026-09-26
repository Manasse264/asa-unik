"use server"

import prisma from "@/lib/prisma"
import bcrypt from "bcryptjs"
import { revalidatePath } from "next/cache"

function safeRevalidate(path: string) {
  try {
    revalidatePath(path)
  } catch (e) {
    // Gracefully ignore when executed outside Next.js request context
  }
}

// 1. Get Established Years
export async function getEstablishedYears() {
  try {
    const config = await prisma.systemConfig.findUnique({
      where: { id: "global" },
    })
    if (config?.availableYears && config.availableYears.length > 0) {
      return config.availableYears
    }
  } catch (e) {
    console.error("Error fetching system config years:", e)
  }
  return ["2024-2025", "2025-2026", "2026-2027"]
}

// 2. Get Families for Dropdown Selection in specific established year
export async function getFamiliesForSelection(year: string) {
  try {
    const families = await prisma.family.findMany({
      where: { year },
      orderBy: { name: "asc" },
      select: {
        id: true,
        name: true,
        pere: true,
        mere: true,
        memberCount: true,
        year: true,
        password: true,
      },
    })
    return families.map(f => ({
      id: f.id,
      name: f.name,
      pere: f.pere,
      mere: f.mere,
      memberCount: f.memberCount,
      year: f.year,
      hasAccount: !!f.password,
    }))
  } catch (error: any) {
    console.error("Error in getFamiliesForSelection:", error)
    return []
  }
}

// 3. Signup / Register Family Account
export async function registerFamilyAccount(data: {
  familyId: string
  pere: string
  mere: string
  password: string
  confirmPassword?: string
}) {
  try {
    const { familyId, pere, mere, password, confirmPassword } = data

    if (!familyId) {
      return { success: false, error: "Please select a family." }
    }
    if (!pere?.trim() || !mere?.trim()) {
      return { success: false, error: "Please enter names for both Pere (Father) and Mere (Mother)." }
    }
    if (!password || password.length < 4) {
      return { success: false, error: "Password must be at least 4 characters long." }
    }
    if (confirmPassword !== undefined && password !== confirmPassword) {
      return { success: false, error: "Passwords do not match." }
    }

    const family = await prisma.family.findUnique({
      where: { id: familyId },
      include: { members: true },
    })

    if (!family) {
      return { success: false, error: "Selected family does not exist." }
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    // Update family
    const updatedFamily = await prisma.family.update({
      where: { id: familyId },
      data: {
        pere: pere.trim(),
        mere: mere.trim(),
        password: hashedPassword,
      },
    })

    // Ensure Pere and Mere exist in FamilyMember list
    const existingMemberNames = family.members.map(m => m.name.toLowerCase().trim())
    const pereName = pere.trim()
    const mereName = mere.trim()

    if (!existingMemberNames.includes(pereName.toLowerCase())) {
      await prisma.familyMember.create({
        data: {
          familyId,
          name: pereName,
          role: "Pere",
          year: family.year,
        },
      })
    }

    if (!existingMemberNames.includes(mereName.toLowerCase())) {
      await prisma.familyMember.create({
        data: {
          familyId,
          name: mereName,
          role: "Mere",
          year: family.year,
        },
      })
    }

    // Recalculate member count
    const totalMembers = await prisma.familyMember.count({
      where: { familyId },
    })
    await prisma.family.update({
      where: { id: familyId },
      data: { memberCount: Math.max(totalMembers, 2) },
    })

    safeRevalidate("/family/signin")
    safeRevalidate("/dashboard/sabbath-school")

    return {
      success: true,
      family: {
        id: updatedFamily.id,
        name: updatedFamily.name,
        pere: updatedFamily.pere,
        mere: updatedFamily.mere,
        year: updatedFamily.year,
      },
    }
  } catch (error: any) {
    console.error("Error in registerFamilyAccount:", error)
    return { success: false, error: error.message || "Failed to register family account." }
  }
}

// 4. Signin / Login Family Account
export async function loginFamilyAccount(familyName: string, password: string, year?: string) {
  try {
    const cleanName = familyName.trim()
    if (!cleanName || !password) {
      return { success: false, error: "Please enter Family Name and Password." }
    }

    const whereClause: any = {
      name: { equals: cleanName, mode: "insensitive" },
    }

    // Search all years so a stale selected year does not block sign-in.
    const families = await prisma.family.findMany({
      where: whereClause,
      orderBy: { createdAt: "desc" },
    })

    if (year) {
      families.sort((a, b) => Number(b.year === year) - Number(a.year === year))
    }

    if (!families || families.length === 0) {
      return { success: false, error: "Family not found. Please verify the family name or sign up first." }
    }

    // Check password against each match
    let authenticatedFamily = null
    for (const fam of families) {
      if (!fam.password) continue
      const hasBcryptHash = /^\$2[aby]\$\d{2}\$/.test(fam.password)
      const isMatch = hasBcryptHash
        ? await bcrypt.compare(password, fam.password)
        : password === fam.password
      if (isMatch) {
        authenticatedFamily = fam
        if (!hasBcryptHash) {
          const hashedPassword = await bcrypt.hash(password, 10)
          await prisma.family.update({
            where: { id: fam.id },
            data: { password: hashedPassword },
          })
        }
        break
      }
    }

    if (!authenticatedFamily) {
      return {
        success: false,
        error: "Incorrect password or this family has not yet set a password. Please sign up first.",
      }
    }

    return {
      success: true,
      family: {
        id: authenticatedFamily.id,
        name: authenticatedFamily.name,
        pere: authenticatedFamily.pere,
        mere: authenticatedFamily.mere,
        year: authenticatedFamily.year,
      },
    }
  } catch (error: any) {
    console.error("Error in loginFamilyAccount:", error)
    return { success: false, error: error.message || "Failed to sign in." }
  }
}

// 5. Get Family Details and Members
export async function getFamilyDetails(familyId: string) {
  try {
    const family = await prisma.family.findUnique({
      where: { id: familyId },
      include: {
        members: {
          orderBy: { createdAt: "asc" },
        },
        attendanceLists: {
          orderBy: { updatedAt: "desc" },
        },
      },
    })

    if (!family) return null

    // If family has no member records yet but has pere/mere names, seed them
    if (family.members.length === 0 && (family.pere || family.mere)) {
      if (family.pere) {
        await prisma.familyMember.create({
          data: { familyId, name: family.pere, role: "Pere", year: family.year },
        })
      }
      if (family.mere) {
        await prisma.familyMember.create({
          data: { familyId, name: family.mere, role: "Mere", year: family.year },
        })
      }
      return await prisma.family.findUnique({
        where: { id: familyId },
        include: {
          members: { orderBy: { createdAt: "asc" } },
          attendanceLists: { orderBy: { updatedAt: "desc" } },
        },
      })
    }

    return family
  } catch (error: any) {
    console.error("Error in getFamilyDetails:", error)
    return null
  }
}

// 6. Add Family Member
export async function addFamilyMember(data: {
  familyId: string
  name: string
  role?: string
  year: string
}) {
  try {
    if (!data.name?.trim()) {
      return { success: false, error: "Member name is required." }
    }

    const member = await prisma.familyMember.create({
      data: {
        familyId: data.familyId,
        name: data.name.trim(),
        role: data.role?.trim() || "Member",
        year: data.year,
      },
    })

    // Update count in Family table
    const count = await prisma.familyMember.count({ where: { familyId: data.familyId } })
    await prisma.family.update({
      where: { id: data.familyId },
      data: { memberCount: count },
    })

    safeRevalidate("/family/dashboard")
    safeRevalidate("/dashboard/sabbath-school")
    return { success: true, member }
  } catch (error: any) {
    console.error("Error adding family member:", error)
    return { success: false, error: error.message }
  }
}

// 7. Update Family Member
export async function updateFamilyMember(data: {
  id: string
  familyId: string
  name: string
  role?: string
}) {
  try {
    if (!data.name?.trim()) {
      return { success: false, error: "Member name is required." }
    }

    const member = await prisma.familyMember.update({
      where: { id: data.id },
      data: {
        name: data.name.trim(),
        role: data.role?.trim() || "Member",
      },
    })

    safeRevalidate("/family/dashboard")
    safeRevalidate("/dashboard/sabbath-school")
    return { success: true, member }
  } catch (error: any) {
    console.error("Error updating family member:", error)
    return { success: false, error: error.message }
  }
}

// 8. Delete Family Member
export async function deleteFamilyMember(memberId: string, familyId: string) {
  try {
    await prisma.familyMember.delete({
      where: { id: memberId },
    })

    const count = await prisma.familyMember.count({ where: { familyId } })
    await prisma.family.update({
      where: { id: familyId },
      data: { memberCount: count },
    })

    safeRevalidate("/family/dashboard")
    safeRevalidate("/dashboard/sabbath-school")
    return { success: true }
  } catch (error: any) {
    console.error("Error deleting family member:", error)
    return { success: false, error: error.message }
  }
}

// 9. Get Attendance List for Family, Year & Quarter
export async function getAttendanceList(familyId: string, year: string, quarter: string) {
  try {
    const list = await prisma.familyAttendanceList.findUnique({
      where: {
        familyId_year_quarter: {
          familyId,
          year,
          quarter,
        },
      },
    })
    return list
  } catch (error: any) {
    console.error("Error getting attendance list:", error)
    return null
  }
}

// 10. Save or Publish Attendance List
export async function saveAttendanceList(data: {
  familyId: string
  year: string
  quarter: string
  attendanceGrid: string
  summaryData: string
  isPublished: boolean
  publishedBy?: string
}) {
  try {
    const { familyId, year, quarter, attendanceGrid, summaryData, isPublished, publishedBy } = data

    const now = new Date()
    const updateData: any = {
      attendanceGrid,
      summaryData,
      isPublished,
      updatedAt: now,
    }

    if (isPublished) {
      updateData.publishedAt = now
      if (publishedBy) updateData.publishedBy = publishedBy
    }

    const list = await prisma.familyAttendanceList.upsert({
      where: {
        familyId_year_quarter: {
          familyId,
          year,
          quarter,
        },
      },
      update: updateData,
      create: {
        familyId,
        year,
        quarter,
        attendanceGrid,
        summaryData,
        isPublished,
        publishedAt: isPublished ? now : null,
        publishedBy: isPublished ? publishedBy : null,
      },
    })

    safeRevalidate("/family/dashboard")
    safeRevalidate("/dashboard/sabbath-school")
    return { success: true, list }
  } catch (error: any) {
    console.error("Error saving attendance list:", error)
    return { success: false, error: error.message }
  }
}

// 11. Get Overview for Sabbath School Leader Dashboard
export async function getSabbathSchoolAttendanceOverview(year: string, quarter: string = "Q1") {
  try {
    const families = await prisma.family.findMany({
      where: { year },
      orderBy: { name: "asc" },
      include: {
        members: {
          orderBy: { createdAt: "asc" },
        },
        attendanceLists: {
          where: { year, quarter },
        },
      },
    })

    return families.map(f => {
      const attendance = f.attendanceLists[0] || null
      return {
        id: f.id,
        name: f.name,
        pere: f.pere,
        mere: f.mere,
        memberCount: f.members.length,
        members: f.members,
        attendanceList: attendance,
        isPublished: attendance?.isPublished ?? false,
        publishedAt: attendance?.publishedAt ?? null,
      }
    })
  } catch (error: any) {
    console.error("Error getting sabbath school overview:", error)
    return []
  }
}

// 12. Update Published Attendance List by Sabbath School Leader
export async function updateAttendanceListByLeader(data: {
  familyId: string
  year: string
  quarter: string
  attendanceGrid: string
  summaryData: string
  isPublished?: boolean
}) {
  try {
    const { familyId, year, quarter, attendanceGrid, summaryData, isPublished } = data

    const list = await prisma.familyAttendanceList.upsert({
      where: {
        familyId_year_quarter: {
          familyId,
          year,
          quarter,
        },
      },
      update: {
        attendanceGrid,
        summaryData,
        isPublished: isPublished !== undefined ? isPublished : true,
        updatedAt: new Date(),
      },
      create: {
        familyId,
        year,
        quarter,
        attendanceGrid,
        summaryData,
        isPublished: isPublished !== undefined ? isPublished : true,
        publishedAt: new Date(),
        publishedBy: "Sabbath School Leader",
      },
    })

    safeRevalidate("/dashboard/sabbath-school")
    safeRevalidate("/family/dashboard")
    return { success: true, list }
  } catch (error: any) {
    console.error("Error in updateAttendanceListByLeader:", error)
    return { success: false, error: error.message }
  }
}
