import CommunityHeader from "@/components/community/CommunityHeader";
import { notFound } from "next/navigation";
import PostFeed from "@/components/PostFeed";
import { getCommunity } from "@/app/actions/communityActions";
import { getCurrentUser} from "@/lib/session";
type PageProps = {
  params :{
    slug:string
  }
}

export default async function CommunityPage({ params }: PageProps) {
  
  const { slug } = params;
  const community = await getCommunity(slug);
  const user = await getCurrentUser();

  if (!community) {
    return notFound();
  }

  if (!community.slug) {
    return notFound();
  }

  return (
    <div className="container mx-auto max-w-5xl pt-6">
      <CommunityHeader
        community={community}
      />

      <div className="mt-6">
        <h2 className="text-lg font-semibold mb-4">Posts</h2>
        {community.posts.length === 0 ? (
          <div className="p-6 bg-white rounded-md shadow dark:bg-zinc-900 dark:shadow-md dark:border-1">
            <p className="text-center text-zinc-500">No posts yet</p>
          </div>
        ) : (
          <PostFeed posts={community.posts} currentUser={user} />
        )}
      </div>
    </div>
  );
}
