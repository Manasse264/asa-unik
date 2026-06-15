import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const year = searchParams.get("year");

  if (!year) {
    return NextResponse.json({ error: "Year is required" }, { status: 400 });
  }

  try {
    const choirs = await prisma.choir.findMany({
      where: { year },
    });
    return NextResponse.json(choirs);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch choirs" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const choir = await prisma.choir.create({
      data,
    });
    return NextResponse.json(choir);
  } catch (error) {
    return NextResponse.json({ error: "Failed to create choir" }, { status: 500 });
  }
}
