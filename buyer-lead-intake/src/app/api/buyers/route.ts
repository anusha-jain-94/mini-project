import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const buyers = await prisma.buyer.findMany({
    orderBy: { updatedAt: "desc" },
  });
  return NextResponse.json(buyers);
}

export async function POST(req: Request) {
  const data = await req.json();
  const buyer = await prisma.buyer.create({ data });
  return NextResponse.json(buyer);
}
