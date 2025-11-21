import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { matter_id, file_name, file_url, file_type } = body;

    if (!matter_id || !file_name || !file_url) {
      return NextResponse.json({ error: "Matter ID, file name, and file URL are required" }, { status: 400 });
    }

    const document = await prisma.document.create({
      data: {
        matter_id,
        file_name,
        file_url,
        file_type: file_type || null,
      },
    });

    return NextResponse.json({ document });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
