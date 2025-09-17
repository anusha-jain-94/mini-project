import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"; // make sure you have this helper
import { buyerSchema } from "@/lib/validation";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route"; // adjust path

// GET buyer + history
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const buyer = await prisma.buyer.findUnique({
    where: { id: params.id },
  });

  if (!buyer) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const history = await prisma.buyerHistory.findMany({
    where: { buyerId: params.id },
    orderBy: { createdAt: "desc" },
    take: 5,
  });

  return NextResponse.json({ buyer, history });
}

// PUT update buyer
export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();

  // parse/validate input
  const parsed = buyerSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0].message },
      { status: 400 }
    );
  }

  const data = parsed.data;

  // Check concurrency
  const existing = await prisma.buyer.findUnique({ where: { id: params.id } });
  if (!existing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  if (new Date(body.updatedAt).getTime() !== existing.updatedAt.getTime()) {
    return NextResponse.json(
      { error: "Record changed, please refresh" },
      { status: 409 }
    );
  }

  // compute diff
  const diff: Record<string, any> = {};
  for (const key of Object.keys(data)) {
    if ((existing as any)[key] !== (data as any)[key]) {
      diff[key] = { old: (existing as any)[key], new: (data as any)[key] };
    }
  }

  // update buyer
  const updated = await prisma.buyer.update({
    where: { id: params.id },
    data,
  });

  if (Object.keys(diff).length > 0) {
    await prisma.buyerHistory.create({
      data: {
        buyerId: params.id,
        changedBy: session.user?.email || "unknown",
        diff,
      },
    });
  }

  return NextResponse.json(updated);
}
