import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
export async function getPostData(id: string) {
  const post = await prisma.post.findUnique({
    where: {
      id,
    },
    include: {
      user: {
        select: {
          id: true,
          username: true,
          image: true,
        },
      },
      community: {
        select: {
          id: true,
          name: true,
          slug: true,
          imageUrl: true,
        },
      },
      comments: {
        where: {
          parentId: null,
        },
        include: {
          user: {
            select: {
              id: true,
              username: true,
              image: true,
            },
          },
          votes: true,
          _count: {
            select: {
              children: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
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
  });

  return post;
}

export async function getVoteStatus(postId: string) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.id) {
    return null;
  }

  const vote = await prisma.vote.findUnique({
    where: {
      userId_postId: {
        userId: session.user.id,
        postId,
      },
    },
  });

  return vote;
}

export async function getRecentPosts() {
  try {
    const posts = await prisma.post.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        community:{
          select: {
            id: true,
            name: true,
            slug: true,
            imageUrl: true,
            createdAt: true,
            description: true,
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
      take: 10, // Limit to 10 most recent posts
    });

    return posts;
  } catch (error) {
    console.error("Error fetching recent posts:", error);
    return [];
  } finally {
    await prisma.$disconnect();
  }
}