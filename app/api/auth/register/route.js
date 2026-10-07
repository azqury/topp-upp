import bcrypt from 'bcryptjs';
import { NextResponse } from 'next/server';
import prisma from '../../../../lib/prisma';
import { signToken } from '../../../../lib/auth';

export async function POST(req) {
  const { name, email, password } = await req.json();
  if (!name || !email || !password) {
    return NextResponse.json({ error: 'Data tidak lengkap' }, { status: 400 });
  }
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return NextResponse.json({ error: 'Email sudah terdaftar' }, { status: 400 });
  }
  const hashed = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: { name, email, password: hashed }
  });
  const token = signToken(user);
  const res = NextResponse.json({ id: user.id, name: user.name, email: user.email });
  res.cookies.set('token', token, { httpOnly: true, path: '/', maxAge: 60 * 60 * 24 * 7 });
  return res;
}