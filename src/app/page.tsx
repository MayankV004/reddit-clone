import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import PostFeed from '@/components/PostFeed';

async function getRecentPosts() {

  
  try {
    const posts = await prisma.post.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        community: true,
        
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
    console.error('Error fetching recent posts:', error);
    return [];
  } finally {
    await prisma.$disconnect();
  }
}

async function getPopularCommunities() {
  
  
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
        createdAt: 'desc', // For now just order by creation date
      },
      take: 5, // Limit to 5 communities
    });

    return communities;
  } catch (error) {
    console.error('Error fetching popular communities:', error);
    return [];
  } finally {
    await prisma.$disconnect();
  }
}

export default async function HomePage() {
  const recentPosts = await getRecentPosts();
  // console.log(recentPosts)
  const popularCommunities = await getPopularCommunities();

  return (
    <div className="container mx-auto max-w-5xl px-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 mt-4">
          <h1 className="text-2xl font-bold mb-4 ">Recent Posts</h1>
          
          {recentPosts.length > 0 ? (
            <PostFeed posts={recentPosts} />
          ) : (
            <div className="bg-white rounded-md shadow p-6 text-center">
              <p className="text-gray-500">No posts yet.</p>
              <Link 
                href="/communities" 
                className="mt-4 inline-block text-blue-500 hover:underline"
              >
                Join a community to see posts
              </Link>
            </div>
          )}
        </div>
        
        <div>
          <div className="bg-white rounded-md shadow p-4 mb-6">
            <h2 className="text-lg font-semibold mb-3">Popular Communities</h2>
            
            {popularCommunities.length > 0 ? (
              <div className="space-y-2">
                {popularCommunities.map((community) => (
                  <Link 
                    key={community.id}
                    href={`/r/${community.slug}`}
                    className="block p-2 hover:bg-gray-50 rounded-md transition-colors"
                  >
                    <div className="font-medium">r/{community.slug}</div>
                    <div className="text-xs text-gray-500">
                      {community._count.posts} posts
                    </div>
                  </Link>
                ))}
                
                <Link 
                  href="/communities"
                  className="block text-blue-500 text-sm mt-3 hover:underline"
                >
                  View all communities
                </Link>
              </div>
            ) : (
              <div className="text-center text-gray-500 py-2">
                <p>No communities yet</p>
                <Link 
                  href="/communities" 
                  className="mt-2 inline-block text-blue-500 hover:underline"
                >
                  Create the first community
                </Link>
              </div>
            )}
          </div>
          
          <div className="bg-white rounded-md shadow p-4">
            <h2 className="text-lg font-semibold mb-3">About Reddit Clone</h2>
            <p className="text-gray-600 mb-4">
              Welcome to our Reddit Clone MVP! This platform allows you to create and join communities, 
              share posts, and engage in discussions.
            </p>
            
            <Link 
              href="/communities"
              className="block w-full bg-blue-500 hover:bg-blue-600 text-white text-center py-2 rounded-md transition-colors"
            >
              Browse Communities
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}