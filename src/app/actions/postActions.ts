import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
export async function getPostData(slug: string) {
  const post = await prisma.post.findUnique({
    where: {
      slug,
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