import bcrypt from 'bcryptjs';
import { NextResponse } from 'next/server';
import prisma from '../../../../lib/prisma';
import { signToken } from '../../../../lib/auth';

export async function POST(req) {
  const { email, password } = await req.json();
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return NextResponse.json({ error: 'Email atau password salah' }, { status: 401 });
  const match = await bcrypt.compare(password, user.password);
  if (!match) return NextResponse.json({ error: 'Email atau password salah' }, { status: 401 });
  const token = signToken(user);
  const res = NextResponse.json({ id: user.id, name: user.name, email: user.email, role: user.role });
  res.cookies.set('token', token, { httpOnly: true, path: '/', maxAge: 60 * 60 * 24 * 7 });
  return res;
}