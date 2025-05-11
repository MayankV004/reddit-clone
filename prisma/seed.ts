// seed.ts
import { PrismaClient } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid'; // Make sure to install this: npm install uuid @types/uuid

const prisma = new PrismaClient();

async function main() {
  try {
    // Create a user with a generated ID
    const userId = uuidv4();
    const user = await prisma.user.upsert({
      where: { username: 'alice' },
      update: {},
      create: {
        id: userId, // Your schema requires an ID to be provided
        username: 'alice',
        email: 'alice@example.com',
      },
    });
    
    console.log('Created user:', user);

    // Create a community with the creator relationship
    const community = await prisma.community.create({
      data: { 
        name: 'nextjs',
        description: 'A community for Next.js enthusiasts',
        creatorId: user.id, // This establishes the relationship with the user
      },
    });
    
    console.log('Created community:', community);

    // Create a subscription for the user to their own community
    const subscription = await prisma.subscription.create({
      data: {
        userId: user.id,
        communityId: community.id,
      }
    });

    console.log('Created subscription:', subscription);

    // Create a sample post
    const post = await prisma.post.create({
      data: {
        title: 'Getting Started with Next.js',
        content: 'Next.js is a fantastic React framework for production.',
        userId: user.id,
        communityId: community.id,
      }
    });

    console.log('Created post:', post);

  } catch (error) {
    console.error('Error during seeding:', error);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error('Failed to seed database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });