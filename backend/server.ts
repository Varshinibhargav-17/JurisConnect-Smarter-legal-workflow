import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

// Users
app.get('/api/users', async (req, res) => {
    const users = await prisma.user.findMany();
    res.json(users);
});

app.post('/api/register', async (req, res) => {
    try {
        const { email, password, name } = req.body;
        const user = await prisma.user.create({
            data: {
                email,
                password,
                name: name || email.split('@')[0]
            }
        });
        res.json(user);
    } catch (e) {
        res.status(500).json({ error: String(e) });
    }
});

app.post('/api/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await prisma.user.findUnique({
            where: { email }
        });
        if (!user || user.password !== password) {
            return res.status(401).json({ error: "Invalid email or password" });
        }
        res.json(user);
    } catch (e) {
        res.status(500).json({ error: String(e) });
    }
});

// Clients
app.get('/api/clients', async (req, res) => {
    const userId = req.query.userId as string;
    if (!userId) {
        return res.status(400).json({ error: "UserId is required" });
    }

    const clients = await prisma.client.findMany({
        where: { user_id: userId },
        include: {
            matters: true,
        }
    });

    const formattedClients = clients.map(client => ({
        id: client.id,
        name: client.name,
        phone: client.phone,
        email: client.email,
        activeMatters: client.matters.filter(m => m.status === 'Active').length
    }));
    res.json(formattedClients);
});

app.get('/api/clients/:id', async (req, res) => {
    try {
        const client = await prisma.client.findUnique({
            where: { id: req.params.id },
            include: { matters: true }
        });
        if (!client) {
            return res.status(404).json({ error: "Client not found" });
        }
        res.json(client);
    } catch (e) {
        res.status(500).json({ error: String(e) });
    }
});

app.post('/api/clients', async (req, res) => {
    try {
        const { name, email, phone, address, user_id } = req.body;
        if (!user_id) return res.status(400).json({ error: "user_id is required" });

        const client = await prisma.client.create({
            data: { name, email, phone, address, user_id }
        });
        res.json(client);
    } catch (e) {
        res.status(500).json({ error: String(e) });
    }
});

// Matters
app.get('/api/matters', async (req, res) => {
    const userId = req.query.userId as string;
    if (!userId) {
        return res.status(400).json({ error: "UserId is required" });
    }

    const matters = await prisma.matter.findMany({
        where: { user_id: userId },
        include: { client: true }
    });
    const formattedMatters = matters.map(m => ({
        id: m.id,
        title: m.title,
        caseNo: m.case_number || 'N/A',
        court: m.court_name || 'N/A',
        status: m.status,
        clientId: m.client_id
    }));
    res.json(formattedMatters);
});

app.get('/api/matters/:id', async (req, res) => {
    try {
        const matter = await prisma.matter.findUnique({
            where: { id: req.params.id },
            include: {
                client: true,
                court_dates: true,
                tasks: true,
                time_entries: true,
                invoices: true
            }
        });
        res.json(matter);
    } catch (e) {
        res.status(500).json({ error: String(e) });
    }
});

app.post('/api/matters', async (req, res) => {
    try {
        const { title, case_number, court_name, status, client_id, user_id } = req.body;
        if (!user_id) return res.status(400).json({ error: "user_id is required" });

        const matter = await prisma.matter.create({
            data: {
                title, case_number, court_name, status: status || 'Active',
                client_id, user_id
            }
        });
        res.json(matter);
    } catch (e) {
        res.status(500).json({ error: String(e) });
    }
});

app.put('/api/matters/:id', async (req, res) => {
    try {
        const { status } = req.body;
        const matter = await prisma.matter.update({
            where: { id: req.params.id },
            data: { status },
            include: {
                client: true,
                court_dates: true,
                tasks: true,
                time_entries: true,
                invoices: true
            }
        });
        res.json(matter);
    } catch (e) {
        res.status(500).json({ error: String(e) });
    }
});

// Time Tracking
app.get('/api/time-entries', async (req, res) => {
    const userId = req.query.userId as string;
    if (!userId) {
        return res.status(400).json({ error: "UserId is required" });
    }

    const entries = await prisma.timeEntry.findMany({
        where: {
            matter: {
                user_id: userId
            }
        },
        include: { matter: true }
    });
    res.json(entries.map(e => ({
        id: e.id,
        matter: e.matter.title,
        task: e.description || 'Unknown task',
        duration: `${e.hours} hrs`,
        amount: e.rate ? `₹${(e.hours * e.rate).toLocaleString()}` : 'N/A',
        hours: e.hours,
        rate: e.rate
    })));
});

app.post('/api/time-entries', async (req, res) => {
    try {
        const { matter_id, date, hours, description, billable, rate } = req.body;
        const entry = await prisma.timeEntry.create({
            data: {
                matter_id,
                date: new Date(date),
                hours: parseFloat(hours),
                description,
                billable,
                rate: parseFloat(rate || 0)
            }
        });
        res.json(entry);
    } catch (e) {
        res.status(500).json({ error: String(e) });
    }
});

// Invoices
app.get('/api/invoices', async (req, res) => {
    const userId = req.query.userId as string;
    if (!userId) {
        return res.status(400).json({ error: "UserId is required" });
    }

    const invoices = await prisma.invoice.findMany({
        where: {
            client: {
                user_id: userId
            }
        },
        include: { client: true }
    });

    res.json(invoices.map(inv => ({
        id: inv.id,
        invoice_number: inv.invoice_number,
        client: inv.client.name,
        amount: `₹${(inv.total_amount / 1000).toFixed(0)}K`,
        due: inv.due_date?.toLocaleDateString() || 'N/A',
        status: inv.status
    })));
});

app.post('/api/invoices', async (req, res) => {
    try {
        const { invoice_number, client_id, total_amount, status, due_date, matter_id } = req.body;

        const invoice = await prisma.invoice.create({
            data: {
                client_id,
                invoice_number,
                amount: total_amount,
                gst_amount: 0,
                total_amount,
                status,
                due_date: new Date(due_date),
                matter_id: matter_id || null
            },
            include: { client: true }
        });
        res.json(invoice);
    } catch (e) {
        res.status(500).json({ error: String(e) });
    }
});

app.post('/api/court-dates', async (req, res) => {
    try {
        const { matter_id, date, purpose, court_room, notes } = req.body;
        const courtDate = await prisma.courtDate.create({
            data: {
                matter_id,
                date: new Date(date),
                purpose,
                court_room,
                notes
            }
        });
        res.json(courtDate);
    } catch (e) {
        res.status(500).json({ error: String(e) });
    }
});

app.put('/api/invoices/:id', async (req, res) => {
    try {
        const { status } = req.body;
        const invoice = await prisma.invoice.update({
            where: { id: req.params.id },
            data: { status },
            include: { client: true }
        });
        res.json(invoice);
    } catch (e) {
        res.status(500).json({ error: String(e) });
    }
});

// Dashboard stats
app.get('/api/dashboard', async (req, res) => {
    try {
        const userId = req.query.userId as string;
        if (!userId) {
            return res.status(400).json({ error: "UserId is required" });
        }

        const now = new Date();
        const nextWeek = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

        const mattersCount = await prisma.matter.count({ where: { user_id: userId, status: 'Active' } });
        const invoices = await prisma.invoice.findMany({
            where: {
                client: { user_id: userId },
                status: 'Paid'
            }
        });
        const revenue = invoices.reduce((acc, inv) => acc + inv.total_amount, 0);

        const hearingsCount = await prisma.courtDate.count({
            where: {
                matter: { user_id: userId },
                date: {
                    gte: now,
                    lte: nextWeek
                }
            }
        });

        const overdueTasksCount = await prisma.task.count({
            where: {
                matter: { user_id: userId },
                status: 'Pending',
                due_date: {
                    lt: now
                }
            }
        });

        const overdueInvoicesCount = await prisma.invoice.count({
            where: {
                client: { user_id: userId },
                status: 'Overdue'
            }
        });

        const totalOverdue = overdueTasksCount + overdueInvoicesCount;

        const upcomingDeadlines = await prisma.courtDate.findMany({
            where: {
                matter: { user_id: userId },
                date: { gte: now }
            },
            orderBy: { date: 'asc' },
            take: 2,
            include: { matter: true }
        });

        const outstandingInvoices = await prisma.invoice.findMany({
            where: {
                client: { user_id: userId },
                status: { in: ['Sent', 'Overdue'] }
            },
            include: { client: true },
            take: 2
        });

        let revenueFormatted = `₹${revenue.toLocaleString()}`;
        if (revenue >= 100000) {
            revenueFormatted = `₹${(revenue / 100000).toFixed(2)}L`;
        } else if (revenue >= 1000) {
            revenueFormatted = `₹${(revenue / 1000).toFixed(1)}K`;
        }

        res.json({
            stats: {
                activeMatters: mattersCount,
                revenueMonth: revenueFormatted,
                hearingsWeek: hearingsCount,
                overdueTasks: totalOverdue
            },
            deadlines: upcomingDeadlines,
            invoices: outstandingInvoices.map(inv => ({
                id: inv.invoice_number,
                client: inv.client.name,
                amount: `₹${(inv.total_amount / 1000).toFixed(1)}K`,
                due: inv.due_date?.toLocaleDateString() || 'N/A',
                status: inv.status
            }))
        });
    } catch (e) {
        res.status(500).json({ error: String(e) });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
});
