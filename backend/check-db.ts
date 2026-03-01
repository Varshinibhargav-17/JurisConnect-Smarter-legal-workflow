import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    try {
        const userCount = await prisma.user.count();
        const clientCount = await prisma.client.count();
        const matterCount = await prisma.matter.count();
        console.log(`Users: ${userCount}`);
        console.log(`Clients: ${clientCount}`);
        console.log(`Matters: ${matterCount}`);
    } catch (err) {
        console.error("Database connection error:", err);
    } finally {
        await prisma.$disconnect();
    }
}

main();
