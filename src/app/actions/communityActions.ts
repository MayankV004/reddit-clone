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

export async function getCommunity(slug: string) {
  try {
    const community = await prisma.community.findUnique({
      where: {
        slug,
      },
      include: {
        posts: {         
          orderBy: {
            createdAt: "desc",
          },
          include: {
            community: {
              select: {
                name: true,
                slug: true,
                id: true,
                description: true,
                createdAt: true,
                imageUrl: true,
                
              },

            },
            user: {
              select: {
                username: true,
                image: true,
                id: true,
              },
            },
            votes: true,
            _count: {
              select: {
                comments: true,
                votes: true,
              },
            },
          },
        },
      },
    });
    return community;
  } catch (error) {
    console.error("Error in fetching Community", error);
    return null;
  } finally {
    await prisma.$disconnect();
  }
}