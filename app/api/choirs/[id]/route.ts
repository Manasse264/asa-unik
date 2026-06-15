import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const data = await request.json();
    const choir = await prisma.choir.update({
      where: { id: params.id },
      data,
    });
    return NextResponse.json(choir);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update choir" }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.choir.delete({
      where: { id: params.id },
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete choir" }, { status: 500 });
  }
}
