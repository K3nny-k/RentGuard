import { PrismaClient, Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Hash password for demo users
  const hashedPassword = await bcrypt.hash('password123', 10);

  // Create demo landlord users
  const landlord1 = await prisma.user.upsert({
    where: { email: 'landlord1@example.com' },
    update: {},
    create: {
      email: 'landlord1@example.com',
      password: hashedPassword,
      role: Role.LANDLORD,
    },
  });

  const landlord2 = await prisma.user.upsert({
    where: { email: 'landlord2@example.com' },
    update: {},
    create: {
      email: 'landlord2@example.com',
      password: hashedPassword,
      role: Role.LANDLORD,
    },
  });

  // Create admin user
  const admin = await prisma.user.upsert({
    where: { email: 'admin@rentguard.com' },
    update: {},
    create: {
      email: 'admin@rentguard.com',
      password: hashedPassword,
      role: Role.ADMIN,
    },
  });

  console.log('👥 Created users:', { landlord1, landlord2, admin });

  // Create demo tenants
  const tenant1 = await prisma.tenant.upsert({
    where: { nationalIdHash: 'hash_123456789012' },
    update: {},
    create: {
      name: 'Ahmad bin Abdullah',
      nationalIdHash: 'hash_123456789012',
    },
  });

  const tenant2 = await prisma.tenant.upsert({
    where: { nationalIdHash: 'hash_987654321098' },
    update: {},
    create: {
      name: 'Siti Nurhaliza',
      nationalIdHash: 'hash_987654321098',
    },
  });

  const tenant3 = await prisma.tenant.upsert({
    where: { nationalIdHash: 'hash_456789123456' },
    update: {},
    create: {
      name: 'Raj Kumar',
      nationalIdHash: 'hash_456789123456',
    },
  });

  console.log('🏠 Created tenants:', { tenant1, tenant2, tenant3 });

  // Create demo listings
  const listing1 = await prisma.listing.upsert({
    where: { id: 1 },
    update: {},
    create: {
      title: 'Modern 2BR Apartment in KLCC',
      rent: 2500.00,
      location: 'Kuala Lumpur City Centre',
      landlordId: landlord1.id,
      pictures: [
        'https://example.com/images/apartment1_1.jpg',
        'https://example.com/images/apartment1_2.jpg',
      ],
    },
  });

  const listing2 = await prisma.listing.upsert({
    where: { id: 2 },
    update: {},
    create: {
      title: 'Cozy Studio in Bangsar',
      rent: 1200.00,
      location: 'Bangsar, Kuala Lumpur',
      landlordId: landlord1.id,
      pictures: [
        'https://example.com/images/studio1_1.jpg',
      ],
    },
  });

  const listing3 = await prisma.listing.upsert({
    where: { id: 3 },
    update: {},
    create: {
      title: '3BR Terrace House in Subang Jaya',
      rent: 1800.00,
      location: 'Subang Jaya, Selangor',
      landlordId: landlord2.id,
      pictures: [
        'https://example.com/images/house1_1.jpg',
        'https://example.com/images/house1_2.jpg',
        'https://example.com/images/house1_3.jpg',
      ],
    },
  });

  console.log('🏢 Created listings:', { listing1, listing2, listing3 });

  // Create demo ratings
  const rating1 = await prisma.rating.upsert({
    where: { id: 1 },
    update: {},
    create: {
      score: 5,
      comment: 'Excellent tenant! Always pays rent on time and keeps the property clean.',
      tenantId: tenant1.id,
      landlordId: landlord1.id,
      proofUrl: 'https://example.com/proof/rating1.pdf',
    },
  });

  const rating2 = await prisma.rating.upsert({
    where: { id: 2 },
    update: {},
    create: {
      score: 4,
      comment: 'Good tenant, minor issues with noise but overall responsible.',
      tenantId: tenant2.id,
      landlordId: landlord2.id,
    },
  });

  const rating3 = await prisma.rating.upsert({
    where: { id: 3 },
    update: {},
    create: {
      score: 3,
      comment: 'Average tenant. Had some payment delays but eventually resolved.',
      tenantId: tenant3.id,
      landlordId: landlord1.id,
    },
  });

  console.log('⭐ Created ratings:', { rating1, rating2, rating3 });

  console.log('✅ Database seed completed successfully!');
  console.log('\n📋 Demo Credentials:');
  console.log('Landlord 1: landlord1@example.com / password123');
  console.log('Landlord 2: landlord2@example.com / password123');
  console.log('Admin: admin@rentguard.com / password123');
}

main()
  .catch((e) => {
    console.error('❌ Error during seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 