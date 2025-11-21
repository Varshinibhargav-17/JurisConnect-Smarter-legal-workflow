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
    if (!user) return res.status(404).json({ error: "User not found" });

    // 3️⃣ Get Matter details from request body
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
    } = req.body;

    if (!client_id || !title || !case_type || !status) {
      return res.status(400).json({ error: "Required fields missing" });
    }

    // 4️⃣ Verify client belongs to this user
    const client = await prisma.client.findFirst({
      where: { id: client_id, user_id: user.id },
    });
    if (!client) return res.status(404).json({ error: "Client not found or does not belong to user" });

    // 5️⃣ Create the Matter
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

    return res.status(201).json({ matter: newMatter });
  } catch (error) {
    console.error("Add Matter Error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
