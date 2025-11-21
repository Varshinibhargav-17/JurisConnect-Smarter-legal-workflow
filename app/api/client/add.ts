import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";
import prisma from "../../../lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // 1️⃣ Verify user is logged in
    const session = await getServerSession(req, res, authOptions);
    if (!session?.user?.email) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method not allowed" });
    }

    // 2️⃣ Get user info
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // 3️⃣ Get client details from request body
    const { name, email, phone, address } = req.body;

    if (!name) {
      return res.status(400).json({ error: "Client name is required" });
    }

    // 4️⃣ Create client
    const newClient = await prisma.client.create({
      data: {
        name,
        email,
        phone,
        address,
        user_id: user.id, // associate with logged-in user
      },
    });

    return res.status(201).json({ client: newClient });
  } catch (error) {
    console.error("Add Client Error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
