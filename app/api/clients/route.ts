import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const clients = await prisma.client.findMany({ orderBy: { createdAt: 'desc' } });
    return NextResponse.json({ clients });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, contact, issue, income } = body;
    if (!name || !contact)
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });

    const client = await prisma.client.create({
      data: {
        name,
        contact,
        issue: issue ?? '',
        income: income ?? '',
        status: 'Pending Review',
      },
    });

    // Also create initial case
    const caseRecord = await prisma.case.create({
      data: { clientId: client.id, status: 'Pending Review' },
    });

    return NextResponse.json({ client, case: caseRecord }, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
