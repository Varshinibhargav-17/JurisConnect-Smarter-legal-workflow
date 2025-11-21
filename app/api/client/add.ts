import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    // 1️⃣ Verify user session
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // 2️⃣ Find logged-in user
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // 3️⃣ Read request body
    const body = await req.json();
    const { name, email, phone, address } = body;

    if (!name) {
      return NextResponse.json(
        { error: "Client name is required" },
        { status: 400 }
      );
    }

    // 4️⃣ Create client
    const newClient = await prisma.client.create({
      data: {
        name,
        email,
        phone,
        address,
        user_id: user.id, // link to logged-in user
      },
    });

    return NextResponse.json(
      { client: newClient },
      { status: 201 }
    );

  } catch (error) {
    console.error("Add Client Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
