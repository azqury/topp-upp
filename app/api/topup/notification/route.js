import { NextResponse } from 'next/server';
import prisma from '../../../../lib/prisma';
import { snap } from '../../../../lib/midtrans';

export async function POST(req) {
  const body = await req.json();

  try {
    const statusResponse = await snap.transaction.notification(body);
    const orderId = statusResponse.order_id;
    const transactionStatus = statusResponse.transaction_status;
    const fraudStatus = statusResponse.fraud_status;

    const trx = await prisma.transaction.findUnique({ where: { orderId } });
    if (!trx || trx.status !== 'PENDING') {
      return NextResponse.json({ ok: true });
    }

    let newStatus = null;
    if (transactionStatus === 'capture') {
      newStatus = fraudStatus === 'accept' ? 'SUCCESS' : 'FAILED';
    } else if (transactionStatus === 'settlement') {
      newStatus = 'SUCCESS';
    } else if (['cancel', 'deny', 'expire'].includes(transactionStatus)) {
      newStatus = 'FAILED';
    }

    if (newStatus) {
      await prisma.transaction.update({ where: { orderId }, data: { status: newStatus } });
      if (newStatus === 'SUCCESS') {
        await prisma.user.update({
          where: { id: trx.userId },
          data: { balance: { increment: trx.amount } }
        });
      }
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
