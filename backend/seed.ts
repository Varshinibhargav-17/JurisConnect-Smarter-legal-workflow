import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('Clearing database...');
    await prisma.invoiceItem.deleteMany({});
    await prisma.invoice.deleteMany({});
    await prisma.document.deleteMany({});
    await prisma.timeEntry.deleteMany({});
    await prisma.task.deleteMany({});
    await prisma.courtDate.deleteMany({});
    await prisma.matter.deleteMany({});
    await prisma.client.deleteMany({});
    await prisma.user.deleteMany({});

    console.log('Seeding data...');
    const user = await prisma.user.create({
        data: {
            name: 'Test Lawyer',
            email: 'lawyer@jurisconnect.com',
            password: 'password123',
            phone: '9876543210'
        }
    });

    const client1 = await prisma.client.create({
        data: {
            user_id: user.id,
            name: 'Rajesh Sharma',
            email: 'rajesh@example.com',
            phone: '9876543210',
            address: 'Vasant Vihar, Delhi'
        }
    });

    const client2 = await prisma.client.create({
        data: {
            user_id: user.id,
            name: 'Beta Corp Ltd',
            email: 'legal@betacorp.in',
            phone: '9876543211',
            address: 'Gurgaon, Haryana'
        }
    });

    const matter1 = await prisma.matter.create({
        data: {
            user_id: user.id,
            client_id: client1.id,
            title: 'Sharma vs. Verma Property Dispute',
            case_number: 'CS(OS) 123/2024',
            court_name: 'Delhi High Court',
            status: 'Active'
        }
    });

    const matter2 = await prisma.matter.create({
        data: {
            user_id: user.id,
            client_id: client2.id,
            title: 'Beta Corp Employment Case',
            case_number: 'W.P.(C) 456/2024',
            court_name: 'Supreme Court',
            status: 'Active'
        }
    });

    await prisma.invoice.create({
        data: {
            matter_id: matter1.id,
            client_id: client1.id,
            invoice_number: 'INV-045',
            amount: 150000,
            gst_amount: 30000,
            total_amount: 180000,
            status: 'Overdue',
            due_date: new Date('2024-05-15')
        }
    });

    await prisma.invoice.create({
        data: {
            matter_id: matter2.id,
            client_id: client2.id,
            invoice_number: 'INV-046',
            amount: 220000,
            gst_amount: 30000,
            total_amount: 250000,
            status: 'Sent',
            due_date: new Date('2024-05-25')
        }
    });

    console.log('Seeding completed successfully!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
