import { NextResponse } from 'next/server';
import prisma from '../../../lib/prisma';
import { getCurrentUser } from '../../../lib/auth';

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'Silakan login dulu' }, { status: 401 });
  const trx = await prisma.transaction.findMany({
    where: { userId: user.id },
    orderBy: { id: 'desc' }
  });
  return NextResponse.json(trx);
}

export async function POST(req) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'Silakan login dulu' }, { status: 401 });

  const { productId } = await req.json();
  const product = await prisma.product.findUnique({ where: { id: parseInt(productId, 10) } });
  if (!product) return NextResponse.json({ error: 'Produk tidak ditemukan' }, { status: 404 });

  if (user.balance < product.price) {
    return NextResponse.json({ error: 'Saldo tidak cukup' }, { status: 400 });
  }

  const [trx] = await prisma.$transaction([
    prisma.transaction.create({
      data: {
        userId: user.id,
        type: 'PURCHASE',
        amount: product.price,
        status: 'SUCCESS',
        note: product.name
      }
    }),
    prisma.user.update({
      where: { id: user.id },
      data: { balance: { decrement: product.price } }
    })
  ]);

  return NextResponse.json(trx);
}