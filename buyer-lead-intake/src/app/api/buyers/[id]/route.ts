import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const buyer = await prisma.buyer.findUnique({ where: { id: Number(params.id) } });
  return NextResponse.json(buyer);
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const data = await req.json();
  const buyer = await prisma.buyer.update({
    where: { id: Number(params.id) },
    data,
  });
  return NextResponse.json(buyer);
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  await prisma.buyer.delete({ where: { id: Number(params.id) } });
  return NextResponse.json({ message: "Buyer deleted" });
}
