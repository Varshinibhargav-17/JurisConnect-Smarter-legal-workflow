import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/auth";

import { prisma } from "@/lib/prisma";

export async function PUT(req: Request) {
  try {
    // 1️⃣ Verify user session
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // 2️⃣ Parse request body
    const body = await req.json();
    const { name, phone, bar_enrollment_number, hourly_rate } = body;

    // 3️⃣ Update user
    const updatedUser = await prisma.user.update({
      where: { email: session.user.email },
      data: {
        name,
        phone,
        bar_enrollment_number,
        hourly_rate: hourly_rate ? Number(hourly_rate) : undefined,
      },
    });

    // 4️⃣ Return safe user response
    const safeUser = {
      id: updatedUser.id,
      name: updatedUser.name,
      email: updatedUser.email,
      phone: updatedUser.phone,
      bar_enrollment_number: updatedUser.bar_enrollment_number,
      hourly_rate: updatedUser.hourly_rate,
    };

    return NextResponse.json(
      { user: safeUser },
      { status: 200 }
    );

  } catch (error) {
    console.error("Update User Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

