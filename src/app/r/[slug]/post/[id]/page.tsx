
import { getPostData, getVoteStatus } from "@/app/actions/postActions";
import { notFound } from "next/navigation";
import { formatDistanceToNow } from "date-fns/formatDistanceToNow";
import { MessageSquare} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import VoteButtons from "@/components/posts/VoteButtons";
import CommentSection from "@/components/comments/CommentSection";
import { requireAuth } from "@/lib/session";
interface PostPageProps {
  params: {
    id: string;
    slug: string;
  };
}
async function PostPage({ params }: PostPageProps) {
  
  const { id } = params;
  const post = await getPostData(id);

  if (!post) {
    return notFound();
  }
 
  const user = await requireAuth();
  const userId = user?.id;
  const userVote = user?.id ? await getVoteStatus(post.id) : null;
  const voteScore = post.votes.reduce((acc, vote) => acc + vote.value, 0);
  const createdAt = formatDistanceToNow(new Date(post.createdAt), {
    addSuffix: true,
  });
  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="flex items-center space-x-2 mb-4">
        <Link
          href={`/r/${post.community.slug}`}
          className="flex items-center gap-2 hover:underline"
        >
          <Image
            src={post.community.imageUrl || "/Reddit_Logo.webp"}
            alt={post.community.name}
            width={24}
            height={24}
            className="rounded-full"
          />

          <span className="font-medium text-sm">r/{post.community.name}</span>
        </Link>
        <span className="text-gray-500 text-xs">•</span>
        <div className="flex items-center text-xs text-gray-500">
          <span>Posted by u/{post.user.username}</span>
          <span className="ml-2">{createdAt}</span>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow dark:bg-zinc-800 border dark:border-zinc-700">
        <div className="flex">
          {/* Vote section */}
          <div className="bg-gray-50 p-2 rounded-l-lg dark:bg-zinc-900">
            <VoteButtons
              postId={post.id}
              initialVoteScore={voteScore}
              initialVote={userVote?.value || 0}
              isLoggedIn={!!user}
            />
          </div>

          {/* Post content section */}
          <div className="p-4 flex-1">
            <h1 className="text-xl font-semibold mb-3">{post.title}</h1>

            {post.content && (
              <div className="prose max-w-none mb-4">{post.content}</div>
            )}

            {post.imageUrl && (
              <div className="my-4">
                <Image
                  src={post.imageUrl}
                  alt="Post image"
                  width={800}
                  height={500}
                  className="rounded-md max-h-[500px] object-contain"
                />
              </div>
            )}

            <div className="flex items-center space-x-4 text-gray-500 text-sm mt-4">
              <div className="flex items-center">
                <MessageSquare className="w-4 h-4 mr-1" />
                <span>{post._count.comments} comments</span>

              </div>
              
            </div>
          </div>
        </div>
        
      </div>

      {/* Comments section */}
      <div className="mt-6">
        <CommentSection
          postId={post.id}
          comments={post.comments}
          isLoggedIn={!!user}
          userId={userId}
        />
      </div>
    </div>
  );
}

export default PostPage;
