import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { matter_id, date, time, purpose, court_room, notes } = body;

    if (!matter_id || !date) {
      return NextResponse.json({ error: "Matter ID and date are required" }, { status: 400 });
    }

    // Create Court Date
    const courtDate = await prisma.courtDate.create({
      data: {
        matter_id,
        date: new Date(date),
        time: time || null,
        purpose: purpose || null,
        court_room: court_room || null,
        notes: notes || null,
        reminder_sent: false,
      },
    });

    return NextResponse.json({ courtDate });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
