import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const data = await request.json();
    const family = await prisma.family.update({
      where: { id: params.id },
      data,
    });
    return NextResponse.json(family);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update family" }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.family.delete({
      where: { id: params.id },
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete family" }, { status: 500 });
  }
}
