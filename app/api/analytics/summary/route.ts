import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/auth";

export async function GET() {
  try {
    // 1️⃣ Check authentication
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2️⃣ Get logged-in user
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const userId = user.id;

    // 3️⃣ Fetch analytics
    const [
      totalClients,
      totalMatters,
      activeMatters,
      closedMatters,
      onHoldMatters,
      upcomingCourtDates,
      pendingTasks,
      completedTasks
    ] = await Promise.all([
      prisma.client.count({ where: { user_id: userId } }),

      prisma.matter.count({ where: { user_id: userId } }),

      prisma.matter.count({ where: { user_id: userId, status: "active" } }),
      prisma.matter.count({ where: { user_id: userId, status: "closed" } }),
      prisma.matter.count({ where: { user_id: userId, status: "on_hold" } }),

      prisma.courtDate.count({
        where: {
          matter: { user_id: userId },
          date: { gte: new Date() },
        },
      }),

      prisma.task.count({
        where: {
          matter: { user_id: userId },
          status: "pending",
        },
      }),

      prisma.task.count({
        where: {
          matter: { user_id: userId },
          status: "completed",
        },
      }),
    ]);

    return NextResponse.json(
      {
        totalClients,
        totalMatters,

        matters: {
          active: activeMatters,
          closed: closedMatters,
          onHold: onHoldMatters,
        },

        upcomingCourtDates,

        tasks: {
          pending: pendingTasks,
          completed: completedTasks,
        },
      },
      { status: 200 }
    );

  } catch (error) {
    console.error("Analytics Summary Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
