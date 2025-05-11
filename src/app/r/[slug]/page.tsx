import { prisma } from "@/lib/prisma";
import CommunityHeader from "@/components/community/CommunityHeader";
import { notFound } from "next/navigation";
import PostFeed from "@/components/PostFeed";
import { Post } from "@/types";

interface PageProps {
  params: {
    slug: string;
  };
}

async function getCommunity(slug: string) {
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
              },
            },
            user: {
              select: {
                username: true,
                // image: true,
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
export default async function CommunityPage({ params }: PageProps) {
  const resParams = await Promise.resolve(params);

  const { slug } = resParams;
  const community = await getCommunity(slug);

  if (!community) {
    return notFound();
  }

  if (!community.slug) {
    return notFound();
  }
  // console.log("Community", community.posts);

  const Formattedposts = community.posts.map((post) => ({
    ...post,
    createdAt: new Date(post.createdAt),
    updatedAt: new Date(post.updatedAt),
    community: { id: community.id, name: community.name, slug: community.slug },
  })) as Post[];

  return (
    <div className="container mx-auto max-w-5xl pt-6">
      <CommunityHeader
        community={{ ...community, slug: community.slug as string }}
      />

      <div className="mt-6">
        <h2 className="text-lg font-semibold mb-4">Posts</h2>
        {community.posts.length === 0 ? (
          <div className="p-6 bg-white rounded-md shadow">
            <p className="text-center text-gray-500">No posts yet</p>
          </div>
        ) : (
          <PostFeed posts={Formattedposts} />
        )}
      </div>
    </div>
  );
}
