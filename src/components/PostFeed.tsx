// "use client";

// import Link from "next/link";
// import { formatDistanceToNow } from "date-fns/formatDistanceToNow";
// import {
//   ChevronUp,
//   ChevronDown,
//   MessageSquare,
//   Share2,
//   Bookmark,
// } from "lucide-react";
// import { useState } from "react";
// import { Post, Vote } from "@/types";

// interface PostFeedProps {
//   posts: Post[];
// }

// const VoteButton = ({
//   icon: Icon,
//   active,
//   onClick,
//   activeColor,
// }: {
//   icon: any;
//   active: boolean;
//   onClick: (e: React.MouseEvent) => void;
//   activeColor: string;
// }) => (
//   <button
//     onClick={onClick}
//     className={`rounded-full p-1 transition-all duration-200 hover:bg-gray-100 dark:hover:bg-zinc-800 focus:outline-none ${
//       active ? `text-${activeColor}-500` : "text-gray-400"
//     }`}
//   >
//     <Icon size={18} />
//   </button>
// );

// export default function PostFeed({ posts }: PostFeedProps) {
//   const [votedPosts, setVotedPosts] = useState<Record<string, string | null>>(
//     {}
//   );

//   const formatDate = (date: Date) => {
//     return formatDistanceToNow(new Date(date), { addSuffix: true });
//   };

//   const calculateVote = (votes: Vote[]) => {
//     const upvotes = votes.filter((vote) => vote.value === 1).length;
//     const downvotes = votes.filter((vote) => vote.value === -1).length;
//     return upvotes - downvotes;
//   };

//   const handleVote = (
//     e: React.MouseEvent,
//     postId: string,
//     voteType: string
//   ) => {
//     e.stopPropagation();

//     setVotedPosts((prev) => ({
//       ...prev,
//       [postId]: voteType === prev[postId] ? null : voteType,
//     }));
//   };

//   return (
//     <div className="space-y-4">
//       {posts.map((post) => {
//         const voteCount = calculateVote(post.votes);
//         const currentVote = votedPosts[post.id];

//         return (
//           <div key={post.id} className="group relative mt-2">
//             <div className="bg-white dark:bg-zinc-800 rounded-lg border border-gray-200 dark:border-zinc-700 hover:border-blue-200 dark:hover:border-orange-700 transition-all duration-200 shadow-sm hover:shadow-md overflow-hidden">
//               <div className="flex">
//                 {/* Vote sidebar */}
//                 <div className="flex flex-col items-center justify-start py-4 px-2 bg-gray-50 dark:bg-zinc-900">
//                   <VoteButton
//                     icon={ChevronUp}
//                     active={currentVote === "up"}
//                     onClick={(e) => handleVote(e, post.id, "up")}
//                     activeColor="blue"
//                   />
//                   <span
//                     className={`text-sm font-semibold my-1 ${
//                       currentVote === "up"
//                         ? "text-blue-500"
//                         : currentVote === "down"
//                         ? "text-red-500"
//                         : "text-gray-700 dark:text-gray-300"
//                     }`}
//                   >
//                     {voteCount +
//                       (currentVote === "up"
//                         ? 1
//                         : currentVote === "down"
//                         ? -1
//                         : 0)}
//                   </span>
//                   <VoteButton
//                     icon={ChevronDown}
//                     active={currentVote === "down"}
//                     onClick={(e) => handleVote(e, post.id, "down")}
//                     activeColor="red"
//                   />
//                 </div>

//                 {/* Post content */}
//                 <div className="flex-1 p-4">
//                   <div className="flex items-center text-xs space-x-2">
//                     {post.community && (
//                       <Link
//                         href={`/r/${post.community.slug}`}
//                         onClick={(e) => e.stopPropagation()}
//                         className="font-semibold text-blue-600 dark:text-orange-500 hover:underline"
//                       >
//                         r/{post.community.name}
//                       </Link>
//                     )}
//                     <span className="text-gray-500 dark:text-gray-400">•</span>
//                     <span className="text-gray-500 dark:text-gray-400">
//                       Posted by u/{post.user?.username}
//                     </span>
//                     <span className="text-gray-500 dark:text-gray-400">•</span>
//                     <span className="text-gray-500 dark:text-gray-400">
//                       {formatDate(post.createdAt)}
//                     </span>
//                   </div>

//                   <Link
//                     href={`/r/${
//                       post.community?.slug || post.communityId
//                     }/post/${post.id}`}
//                   >
//                     <h3 className="text-lg font-medium mt-2 mb-2 text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer">
//                       {post.title}
//                     </h3>

//                     <p className="text-gray-700 dark:text-gray-300 line-clamp-3 mb-3">
//                       {post.content}
//                     </p>
//                   </Link>

//                   <div className="flex items-center gap-4 text-gray-500 text-sm pt-2 border-t border-gray-100 dark:border-zinc-700">
//                     <Link
//                       href={`/r/${
//                         post.community?.slug || post.communityId
//                       }/post/${post.id}`}
//                       className="flex items-center gap-1 py-1 px-2 rounded-full hover:bg-gray-100 dark:hover:bg-zinc-700 transition-colors"
//                     >
//                       <MessageSquare size={16} />
//                       <span>{post._count?.comments || 0} comments</span>
//                     </Link>

//                     <button
//                       onClick={(e) => {
//                         e.preventDefault();
                        
//                       }}
//                       className="flex items-center gap-1 py-1 px-2 rounded-full hover:bg-gray-100 dark:hover:bg-zinc-700 transition-colors"
//                     >
//                       <Share2 size={16} />
//                       <span>Share</span>
//                     </button>

//                     <button
//                       onClick={(e) => {
//                         e.preventDefault();
                        
//                       }}
//                       className="flex items-center gap-1 py-1 px-2 rounded-full hover:bg-gray-100 dark:hover:bg-zinc-700 transition-colors"
//                     >
//                       <Bookmark size={16} />
//                       <span>Save</span>
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         );
//       })}

//       {posts.length === 0 && (
//         <div className="bg-white dark:bg-zinc-800 rounded-lg shadow p-8 text-center border border-gray-200 dark:border-zinc-700">
//           <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
//             No posts yet
//           </h3>
//           <p className="text-gray-500 dark:text-gray-400">
//             Be the first to share something with this community!
//           </p>
//         </div>
//       )}
//     </div>
//   );
// }


"use client";

import Link from "next/link";
import { formatDistanceToNow } from "date-fns/formatDistanceToNow";
import {
  MessageSquare,
  Share2,
  Bookmark,
} from "lucide-react";
import { toast } from "sonner";
import { Post } from "@/types";
import VoteButtons from "@/components/posts/VoteButtons"; // Update with your actual path

interface PostFeedProps {
  posts: Post[];
  currentUser?: { id: string } | null;
}

export default function PostFeed({ posts, currentUser }: PostFeedProps) {
  const formatDate = (date: Date) => {
    return formatDistanceToNow(new Date(date), { addSuffix: true });
  };

  const calculateVoteScore = (votes: any[]) => {
    return votes.reduce((acc, vote) => acc + vote.value, 0);
  };

  const getUserVoteValue = (votes: any[], userId?: string) => {
    if (!userId) return 0;
    const userVote = votes.find(vote => vote.userId === userId);
    return userVote ? userVote.value : 0;
  };

  return (
    <div className="space-y-4">
      {posts.map((post) => {
        const voteScore = calculateVoteScore(post.votes);
        const userVoteValue = getUserVoteValue(post.votes, currentUser?.id);
        
        return (
          <div key={post.id} className="group relative mt-2">
            <div className="bg-white dark:bg-zinc-800 rounded-lg border border-gray-200 dark:border-zinc-700 hover:border-blue-200 dark:hover:border-orange-700 transition-all duration-200 shadow-sm hover:shadow-md overflow-hidden">
              <div className="flex">
                {/* Vote sidebar */}
                <div className="flex flex-col items-center justify-start py-4 px-2 bg-gray-50 dark:bg-zinc-900">
                  <VoteButtons
                    postId={post.id}
                    initialVoteScore={voteScore}
                    initialVote={userVoteValue}
                    isLoggedIn={!!currentUser}
                  />
                </div>

                {/* Post content */}
                <div className="flex-1 p-4">
                  <div className="flex items-center text-xs space-x-2">
                    {post.community && (
                      <Link
                        href={`/r/${post.community.slug}`}
                        onClick={(e) => e.stopPropagation()}
                        className="font-semibold text-blue-600 dark:text-orange-500 hover:underline"
                      >
                        r/{post.community.name}
                      </Link>
                    )}
                    <span className="text-gray-500 dark:text-gray-400">•</span>
                    <span className="text-gray-500 dark:text-gray-400">
                      Posted by u/{post.user?.username}
                    </span>
                    <span className="text-gray-500 dark:text-gray-400">•</span>
                    <span className="text-gray-500 dark:text-gray-400">
                      {formatDate(post.createdAt)}
                    </span>
                  </div>

                  <Link
                    href={`/r/${
                      post.community?.slug || post.communityId
                    }/post/${post.id}`}
                  >
                    <h3 className="text-lg font-medium mt-2 mb-2 text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer">
                      {post.title}
                    </h3>

                    <p className="text-gray-700 dark:text-gray-300 line-clamp-3 mb-3">
                      {post.content}
                    </p>
                  </Link>

                  <div className="flex items-center gap-4 text-gray-500 text-sm pt-2 border-t border-gray-100 dark:border-zinc-700">
                    <Link
                      href={`/r/${
                        post.community?.slug || post.communityId
                      }/post/${post.id}`}
                      className="flex items-center gap-1 py-1 px-2 rounded-full hover:bg-gray-100 dark:hover:bg-zinc-700 transition-colors"
                    >
                      <MessageSquare size={16} />
                      <span>{post._count?.comments || 0} comments</span>
                    </Link>

                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        navigator.clipboard.writeText(
                          `${window.location.origin}/r/${
                            post.community?.slug || post.communityId
                          }/post/${post.id}`
                        );
                        toast("Link copied to clipboard!");
                      }}
                      className="flex items-center gap-1 py-1 px-2 rounded-full hover:bg-gray-100 dark:hover:bg-zinc-700 transition-colors"
                    >
                      <Share2 size={16} />
                      <span>Share</span>
                    </button>

                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        // Save functionality
                      }}
                      className="flex items-center gap-1 py-1 px-2 rounded-full hover:bg-gray-100 dark:hover:bg-zinc-700 transition-colors"
                    >
                      <Bookmark size={16} />
                      <span>Save</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })}

      {posts.length === 0 && (
        <div className="bg-white dark:bg-zinc-800 rounded-lg shadow p-8 text-center border border-gray-200 dark:border-zinc-700">
          <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
            No posts yet
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            Be the first to share something with this community!
          </p>
        </div>
      )}
    </div>
  );
}