import { NextResponse } from 'next/server';
import prisma from '../../../../../lib/prisma';
import { getCurrentUser } from '../../../../../lib/auth';

export async function PATCH(req, { params }) {
  const user = await getCurrentUser();
  if (!user || user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Akses ditolak' }, { status: 403 });
  }

  const { status } = await req.json();
  const id = parseInt(params.id, 10);
  const trx = await prisma.transaction.findUnique({ where: { id } });
  if (!trx || trx.status !== 'PENDING') {
    return NextResponse.json({ error: 'Transaksi tidak valid' }, { status: 400 });
  }

  const updated = await prisma.transaction.update({ where: { id }, data: { status } });

  if (status === 'SUCCESS') {
    await prisma.user.update({
      where: { id: trx.userId },
      data: { balance: { increment: trx.amount } }
    });
  }

  return NextResponse.json(updated);
}