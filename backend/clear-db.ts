import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function clearDb() {
    console.log('Clearing database...');
    // Delete in order to respect constraints
    await prisma.invoiceItem.deleteMany({});
    await prisma.invoice.deleteMany({});
    await prisma.timeEntry.deleteMany({});
    await prisma.task.deleteMany({});
    await prisma.courtDate.deleteMany({});
    await prisma.document.deleteMany({});
    await prisma.matter.deleteMany({});
    await prisma.client.deleteMany({});
    await prisma.user.deleteMany({}); // Delete users too as requested ("clear my current database")
    console.log('Database cleared.');
}

clearDb()
    .catch(e => console.error(e))
    .finally(() => prisma.$disconnect());
