import Link from 'next/link';
import {prisma} from "@/lib/prisma"
import { getServerSession } from 'next-auth/next';
import { authOptions } from "@/lib/auth" ;
import UserMenu from '@/components/UserMenu';
import CreateCommunityForm from '@/components/CreateCommunityForm';

async function getCommunities() {
    
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

export default async function CommunitiesPage() {
  const communities = await getCommunities();
  const session = await getServerSession(authOptions);
  
  return (
    <div className="container mx-auto max-w-5xl py-8 px-4">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Communities</h1>
        <div className="flex items-center gap-4">
          <UserMenu session={session} />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="p-4 border-b">
              <h2 className="text-xl font-semibold">Browse Communities</h2>
            </div>
            {communities.length === 0 ? (
              <div className="p-6 text-center text-gray-500">
                No communities found. Be the first to create one!
              </div>
            ) : (
              <div className="divide-y">
                {communities.map((community) => (
                  <Link 
                    key={community.id} 
                    href={`/r/${community.slug}`}
                    className="block p-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">r/{community.slug}</h3>
                        <p className="text-sm text-gray-500">
                          {community._count.posts} posts • Created {new Date(community.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-blue-500 text-sm font-medium">View</div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
        <div>
          <div className="sticky top-6">
            <CreateCommunityForm />
          </div>
        </div>
      </div>
    </div>
  );
}