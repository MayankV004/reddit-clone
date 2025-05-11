import {prisma} from '@/lib/prisma';
 
export async function getCommunities() {
    
  try {
    const communities = await prisma.community.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        _count: {
          select: {
            posts: true,
          },
        },
      },
    });
    return communities;
  } catch (error) {
    console.error('Error fetching communities:', error);
    return [];
  } finally {
    await prisma.$disconnect();
  }
}