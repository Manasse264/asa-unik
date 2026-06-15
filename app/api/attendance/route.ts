import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const year = searchParams.get("year");

  if (!year) {
    return NextResponse.json({ error: "Year is required" }, { status: 400 });
  }

  try {
    const attendance = await prisma.attendance.findMany({
      where: { year },
    });
    return NextResponse.json(attendance);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch attendance" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const attendance = await prisma.attendance.create({
      data,
    });
    return NextResponse.json(attendance);
  } catch (error) {
    return NextResponse.json({ error: "Failed to create attendance" }, { status: 500 });
  }
}
