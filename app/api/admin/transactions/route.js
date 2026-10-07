import { NextResponse } from 'next/server';
import prisma from '../../../../lib/prisma';
import { getCurrentUser } from '../../../../lib/auth';

export async function GET() {
  const user = await getCurrentUser();
  if (!user || user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Akses ditolak' }, { status: 403 });
  }
  const trx = await prisma.transaction.findMany({
    where: { type: 'TOPUP' },
    include: { user: { select: { name: true, email: true } } },
    orderBy: { id: 'desc' }
  });
  return NextResponse.json(trx);
}