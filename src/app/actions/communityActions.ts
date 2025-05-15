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

export async function getPopularCommunities() {
  try {
    const communities = await prisma.community.findMany({
      include: {
        _count: {
          select: {
            posts: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc", 
      },
      take: 5, // Limit to 5 communities
    });

    return communities;
  } catch (error) {
    console.error("Error fetching popular communities:", error);
    return [];
  } finally {
    await prisma.$disconnect();
  }
}