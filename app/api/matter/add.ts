import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/auth";

import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    // 1️⃣ Verify session
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // 2️⃣ Get logged-in user
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // 3️⃣ Parse request body
    const body = await req.json();
    const {
      client_id,
      title,
      case_number,
      case_type,
      court_name,
      judge_name,
      opposing_party,
      opposing_counsel,
      status,
    } = body;

    if (!client_id || !title || !case_type || !status) {
      return NextResponse.json(
        { error: "Required fields missing" },
        { status: 400 }
      );
    }

    // 4️⃣ Ensure client belongs to the user
    const client = await prisma.client.findFirst({
      where: { id: client_id, user_id: user.id },
    });

    if (!client) {
      return NextResponse.json(
        { error: "Client not found or does not belong to user" },
        { status: 404 }
      );
    }

    // 5️⃣ Create Matter
    const newMatter = await prisma.matter.create({
      data: {
        user_id: user.id,
        client_id,
        title,
        case_number,
        case_type,
        court_name,
        judge_name,
        opposing_party,
        opposing_counsel,
        status,
      },
    });

    return NextResponse.json(
      { matter: newMatter },
      { status: 201 }
    );

  } catch (error) {
    console.error("Add Matter Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
