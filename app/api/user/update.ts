import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";
import prisma from "../../../lib/prisma"; // your Prisma client

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // 1️⃣ Get session to verify user is logged in
    const session = await getServerSession(req, res, authOptions);

    if (!session?.user?.email) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    if (req.method !== "PUT") {
      return res.status(405).json({ error: "Method not allowed" });
    }

    // 2️⃣ Get fields from request body
    const { name, phone, bar_enrollment_number, hourly_rate } = req.body;

    // 3️⃣ Update user in database
    const updatedUser = await prisma.user.update({
      where: { email: session.user.email },
      data: {
        name,
        phone,
        bar_enrollment_number,
        hourly_rate: hourly_rate ? Number(hourly_rate) : undefined,
      },
    });

    return res.status(200).json({ user: updatedUser });
  } catch (error) {
    console.error("Update User Error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
