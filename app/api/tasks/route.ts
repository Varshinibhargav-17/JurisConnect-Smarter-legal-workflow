import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { matter_id, title, description, due_date, priority } = body;

    if (!matter_id || !title) {
      return NextResponse.json({ error: "Matter ID and title are required" }, { status: 400 });
    }

    const task = await prisma.task.create({
      data: {
        matter_id,
        title,
        description: description || null,
        due_date: due_date ? new Date(due_date) : null,
        priority: priority || "medium",
        status: "pending",
      },
    });

    return NextResponse.json({ task });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
