import { NextRequest, NextResponse } from "next/server";
import { buyerSchema } from "@/lib/validation";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

export async function POST(req: NextRequest) {
  try {
    // 1️⃣ Get the current logged-in user
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // 2️⃣ Parse request body
    const body = await req.json();

    // 3️⃣ Validate input with Zod
    const parsedData = buyerSchema.parse(body);

    // 4️⃣ Create a new buyer and connect the owner relation
    const buyer = await prisma.buyer.create({
      data: {
        fullName: parsedData.fullName,
        phone: parsedData.phone,
        propertyType: parsedData.propertyType,
        email: parsedData.email,
        city: parsedData.city,
        bhk: parsedData.bhk,
        purpose: parsedData.purpose,
        budgetMin: parsedData.budgetMin,
        budgetMax: parsedData.budgetMax,
        timeline: parsedData.timeline,
        source: parsedData.source,
        notes: parsedData.notes,
        tags: parsedData.tags,
        owner: { connect: { id: session.user.id } }, // ✅ connect owner relation
      },
    });

    // 5️⃣ Add an entry in buyer_history
    await prisma.buyerHistory.create({
      data: {
        buyer: { connect: { id: buyer.id } }, // ✅ connect to buyer
        action: "Created Lead",
        changedBy: session.user.email, // string field, not relation
      },
    });

    // 6️⃣ Return JSON response
    return NextResponse.json({ message: "Lead created successfully!", buyer }, { status: 201 });
  } catch (err: any) {
    console.error(err);

    // Handle Zod validation errors
    if (err?.name === "ZodError") {
      const messages = err.errors.map((e: any) => e.message).join(", ");
      return NextResponse.json({ message: messages }, { status: 400 });
    }

    return NextResponse.json({ message: err?.message || "Internal Server Error" }, { status: 500 });
  }
}
