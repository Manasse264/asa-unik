"use server"

import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"

// --- Members ---
export async function getMembers(year: string) {
  return await prisma.member.findMany({ where: { year } })
}

export async function saveMember(data: any) {
  const { id, ...rest } = data
  if (id && id.length > 10) { // cuid check
    await prisma.member.update({ where: { id }, data: rest })
  } else {
    await prisma.member.create({ data: rest })
  }
  revalidatePath("/dashboard/secretary")
  revalidatePath("/dashboard/elder")
}

export async function deleteMember(id: string) {
  await prisma.member.delete({ where: { id } })
  revalidatePath("/dashboard/secretary")
  revalidatePath("/dashboard/elder")
}

// --- Choirs ---
export async function getChoirs(year: string) {
  return await prisma.choir.findMany({ where: { year } })
}

export async function saveChoir(data: any) {
  const { id, ...rest } = data
  if (id && id.length > 10) {
    await prisma.choir.update({ where: { id }, data: rest })
  } else {
    await prisma.choir.create({ data: rest })
  }
  revalidatePath("/dashboard/secretary")
}

export async function deleteChoir(id: string) {
  await prisma.choir.delete({ where: { id } })
  revalidatePath("/dashboard/secretary")
}

// --- Departments ---
export async function getDepartments(year: string) {
  return await prisma.department.findMany({ where: { year } })
}

export async function saveDepartment(data: any) {
  const { id, ...rest } = data
  if (id && id.length > 10) {
    await prisma.department.update({ where: { id }, data: rest })
  } else {
    await prisma.department.create({ data: rest })
  }
  revalidatePath("/dashboard/secretary")
}

export async function deleteDepartment(id: string) {
  await prisma.department.delete({ where: { id } })
  revalidatePath("/dashboard/secretary")
}

// --- Finances ---
export async function getFinances(year: string) {
  return await prisma.finance.findMany({ where: { year } })
}

export async function saveFinance(data: any) {
  await prisma.finance.create({ data })
  revalidatePath("/dashboard/treasurer")
}

export async function deleteFinance(id: string) {
  await prisma.finance.delete({ where: { id } })
  revalidatePath("/dashboard/treasurer")
}

// --- Inventory ---
export async function getInventory(year: string) {
  return await prisma.inventory.findMany({ where: { year } })
}

export async function saveInventory(data: any) {
  const { id, ...rest } = data
  if (id && id.length > 10) {
    await prisma.inventory.update({ where: { id }, data: rest })
  } else {
    await prisma.inventory.create({ data: rest })
  }
  revalidatePath("/dashboard/treasurer")
}

export async function deleteInventory(id: string) {
  await prisma.inventory.delete({ where: { id } })
  revalidatePath("/dashboard/treasurer")
}

// --- Announcements ---
export async function getAnnouncements(year: string) {
  return await prisma.announcement.findMany({ where: { year } })
}

export async function saveAnnouncement(data: any) {
  const { id, ...rest } = data
  if (id && id.length > 10) {
    await prisma.announcement.update({ where: { id }, data: rest })
  } else {
    await prisma.announcement.create({ data: rest })
  }
  revalidatePath("/dashboard/elder")
  revalidatePath("/announcements")
  revalidatePath("/news")
}

export async function deleteAnnouncement(id: string) {
  await prisma.announcement.delete({ where: { id } })
  revalidatePath("/dashboard/elder")
  revalidatePath("/announcements")
  revalidatePath("/news")
}

// --- System Config ---
export async function getSystemConfig() {
  return await prisma.systemConfig.upsert({
    where: { id: "global" },
    update: {},
    create: { id: "global" }
  })
}

export async function updateSystemConfig(data: any) {
  await prisma.systemConfig.update({
    where: { id: "global" },
    data
  })
  revalidatePath("/dashboard/elder")
}

// --- Users ---
export async function getUsers() {
  return await prisma.user.findMany()
}

export async function registerUser(data: any) {
  return await prisma.user.create({ data })
}

export async function updateUser(id: string, data: any) {
  await prisma.user.update({ where: { id }, data })
  revalidatePath("/dashboard/elder")
}

export async function deleteUser(id: string) {
  await prisma.user.delete({ where: { id } })
  revalidatePath("/dashboard/elder")
}
