import { NextResponse } from 'next/server';
import prisma from '../../../lib/prisma';
import { getCurrentUser } from '../../../lib/auth';

export async function POST(req) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'Silakan login dulu' }, { status: 401 });

  const { amount, method } = await req.json();
  const amt = parseInt(amount, 10);
  if (!amt || amt < 10000) {
    return NextResponse.json({ error: 'Minimal top up Rp10.000' }, { status: 400 });
  }

  const trx = await prisma.transaction.create({
    data: {
      userId: user.id,
      type: 'TOPUP',
      amount: amt,
      method: method || 'manual',
      status: 'PENDING'
    }
  });

  return NextResponse.json(trx);
}