"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const client_1 = require("@prisma/client");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const prisma = new client_1.PrismaClient();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Users
app.get('/api/users', async (req, res) => {
    const users = await prisma.user.findMany();
    res.json(users);
});
// Clients
app.get('/api/clients', async (req, res) => {
    const clients = await prisma.client.findMany({
        include: {
            matters: true,
        }
    });
    // Format for frontend
    const formattedClients = clients.map(client => ({
        id: client.id,
        name: client.name,
        phone: client.phone,
        email: client.email,
        activeMatters: client.matters.filter(m => m.status === 'Active').length
    }));
    res.json(formattedClients);
});
app.post('/api/clients', async (req, res) => {
    try {
        const { name, email, phone, address, user_id } = req.body;
        let uId = user_id;
        if (!uId) {
            // Default to first user if none provided (for demo)
            const user = await prisma.user.findFirst();
            if (user)
                uId = user.id;
        }
        const client = await prisma.client.create({
            data: { name, email, phone, address, user_id: uId }
        });
        res.json(client);
    }
    catch (e) {
        res.status(500).json({ error: String(e) });
    }
});
// Matters
app.get('/api/matters', async (req, res) => {
    const matters = await prisma.matter.findMany({
        include: { client: true }
    });
    // format for frontend
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
app.post('/api/matters', async (req, res) => {
    try {
        const { title, case_number, court_name, status, client_id, user_id } = req.body;
        let uId = user_id;
        if (!uId) {
            const user = await prisma.user.findFirst();
            if (user)
                uId = user.id;
        }
        const matter = await prisma.matter.create({
            data: {
                title, case_number, court_name, status: status || 'Active',
                client_id, user_id: uId
            }
        });
        res.json(matter);
    }
    catch (e) {
        res.status(500).json({ error: String(e) });
    }
});
// Matter Details
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
    }
    catch (e) {
        res.status(500).json({ error: String(e) });
    }
});
// Time Tracking
app.get('/api/time-entries', async (req, res) => {
    const entries = await prisma.timeEntry.findMany({
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
    }
    catch (e) {
        res.status(500).json({ error: String(e) });
    }
});
// Dashboard stats
app.get('/api/dashboard', async (req, res) => {
    try {
        const mattersCount = await prisma.matter.count({ where: { status: 'Active' } });
        const invoices = await prisma.invoice.findMany({ where: { status: 'Paid' } });
        const revenue = invoices.reduce((acc, inv) => acc + inv.total_amount, 0);
        const upcomingDeadlines = await prisma.courtDate.findMany({
            where: { date: { gte: new Date() } },
            orderBy: { date: 'asc' },
            take: 2,
            include: { matter: true }
        });
        const outstandingInvoices = await prisma.invoice.findMany({
            where: { status: { in: ['Sent', 'Overdue'] } },
            include: { client: true },
            take: 2
        });
        res.json({
            stats: {
                activeMatters: mattersCount,
                revenueMonth: `₹${(revenue / 100000).toFixed(1)}L`,
                hearingsWeek: 4,
                overdueTasks: 2
            },
            deadlines: upcomingDeadlines,
            invoices: outstandingInvoices.map(inv => ({
                id: inv.invoice_number,
                client: inv.client.name,
                amount: `₹${(inv.total_amount / 100000).toFixed(1)}L`,
                due: inv.due_date?.toLocaleDateString() || 'N/A',
                status: inv.status
            }))
        });
    }
    catch (e) {
        res.status(500).json({ error: String(e) });
    }
});
// Invoices
app.get('/api/invoices', async (req, res) => {
    const invoices = await prisma.invoice.findMany({
        include: { client: true }
    });
    res.json(invoices.map(inv => ({
        id: inv.invoice_number,
        client: inv.client.name,
        amount: `₹${(inv.total_amount / 1000).toFixed(0)}K`,
        due: inv.due_date?.toLocaleDateString() || 'N/A',
        status: inv.status,
        statusColor: inv.status === 'Paid' ? 'text-green-600 bg-green-100' :
            inv.status === 'Overdue' ? 'text-red-600 bg-red-100' : 'text-yellow-600 bg-yellow-100'
    })));
});
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
