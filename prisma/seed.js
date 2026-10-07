import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
const prisma = new PrismaClient();

async function main() {
  const adminPass = await bcrypt.hash('admin123', 10);
  await prisma.user.upsert({
    where: { email: 'admin@topup.local' },
    update: {},
    create: {
      name: 'Admin',
      email: 'admin@topup.local',
      password: adminPass,
      role: 'ADMIN',
      balance: 0
    }
  });

  const userPass = await bcrypt.hash('user123', 10);
  await prisma.user.upsert({
    where: { email: 'user@topup.local' },
    update: {
      balance: 500000
    },
    create: {
      name: 'User Demo',
      email: 'user@topup.local',
      password: userPass,
      role: 'USER',
      balance: 500000
    }
  });

  const products = [
    { name: 'Mobile Legends 86 Diamonds', description: 'Top up diamond ML', price: 20000, category: 'game', image: '🎮' },
    { name: 'Mobile Legends 172 Diamonds', description: 'Top up diamond ML', price: 38000, category: 'game', image: '🎮' },
    { name: 'Mobile Legends 257 Diamonds', description: 'Top up diamond ML', price: 55000, category: 'game', image: '🎮' },
    { name: 'Free Fire 70 Diamonds', description: 'Top up diamond FF', price: 15000, category: 'game', image: '🔥' },
    { name: 'Free Fire 140 Diamonds', description: 'Top up diamond FF', price: 28000, category: 'game', image: '🔥' },
    { name: 'PUBG Mobile 60 UC', description: 'Top up UC PUBGM', price: 18000, category: 'game', image: '🎯' },
    { name: 'PUBG Mobile 325 UC', description: 'Top up UC PUBGM', price: 85000, category: 'game', image: '🎯' },
    { name: 'Valorant 475 VP', description: 'Top up Valorant Points', price: 75000, category: 'game', image: '🕹️' },
    { name: 'Genshin Impact 60 Crystal', description: 'Top up Genesis Crystal', price: 16000, category: 'game', image: '⚔️' },
    { name: 'Pulsa Telkomsel 25rb', description: 'Isi pulsa Telkomsel', price: 27000, category: 'pulsa', image: '📱' },
    { name: 'Pulsa Indosat 25rb', description: 'Isi pulsa Indosat', price: 26500, category: 'pulsa', image: '📱' },
    { name: 'Pulsa XL 25rb', description: 'Isi pulsa XL', price: 26500, category: 'pulsa', image: '📱' },
    { name: 'Token PLN 50rb', description: 'Token listrik PLN', price: 51500, category: 'pln', image: '⚡' },
    { name: 'Token PLN 100rb', description: 'Token listrik PLN', price: 101500, category: 'pln', image: '⚡' },
    { name: 'Token PLN 200rb', description: 'Token listrik PLN', price: 201500, category: 'pln', image: '⚡' },
    { name: 'Spotify Premium 1 Bulan', description: 'Langganan Spotify Individual', price: 54000, category: 'voucher', image: '🎧' },
    { name: 'Netflix Mobile 1 Bulan', description: 'Langganan Netflix paket Mobile', price: 65000, category: 'voucher', image: '🎬' }
  ];

  for (const p of products) {
    const exists = await prisma.product.findFirst({ where: { name: p.name } });
    if (!exists) await prisma.product.create({ data: p });
  }

  console.log('Seed berhasil!');
  console.log('1. Akun User Biasa: user@topup.local / user123 (Saldo: Rp500.000)');
  console.log('2. Akun Admin:      admin@topup.local / admin123');
}

main().finally(() => prisma.$disconnect());
