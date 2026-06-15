import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const year = searchParams.get("year");

  if (!year) {
    return NextResponse.json({ error: "Year is required" }, { status: 400 });
  }

  try {
    const members = await prisma.member.findMany({
      where: { year },
    });
    return NextResponse.json(members);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch members" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const member = await prisma.member.create({
      data,
    });
    return NextResponse.json(member);
  } catch (error) {
    return NextResponse.json({ error: "Failed to create member" }, { status: 500 });
  }
}
