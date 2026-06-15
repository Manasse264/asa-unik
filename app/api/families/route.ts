import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const year = searchParams.get("year");

  if (!year) {
    return NextResponse.json({ error: "Year is required" }, { status: 400 });
  }

  try {
    const families = await prisma.family.findMany({
      where: { year },
    });
    return NextResponse.json(families);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch families" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const family = await prisma.family.create({
      data,
    });
    return NextResponse.json(family);
  } catch (error) {
    return NextResponse.json({ error: "Failed to create family" }, { status: 500 });
  }
}
