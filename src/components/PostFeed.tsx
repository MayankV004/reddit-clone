'use client';
import Link from 'next/link';
import {formatDistanceToNow }from 'date-fns/formatDistanceToNow';
import { ChevronUp, ChevronDown, MessageSquare } from 'lucide-react';
import  {Post , Vote , Community , User}  from '@/types';
interface PostFeedProps {
  posts: Post[]; 
}

export default function PostFeed({ posts }: PostFeedProps) {
  const formatDate = (date: Date) => {
    return formatDistanceToNow(new Date(date), { addSuffix: true });
  };
  const calculateVote = (votes: Vote[]) =>{
    const upvotes = votes.filter(vote => vote.value === 1).length;
    const downvotes = votes.filter(vote => vote.value === -1).length;
    return upvotes - downvotes;
  }
  return (
    <div className="space-y-4">
      {posts.map((post) => ( 
        
        <Link key={post.id} href={`/r/${post.community?.slug || post.communityId}/post/${post.id}`}>
          <div className="bg-white rounded-md shadow hover:shadow-md transition-shadow p-4 flex gap-4">
            {/* Vote buttons */}
            <div className="flex flex-col items-center gap-1">
              <button className="text-gray-400 hover:text-blue-500 focus:outline-none">
                <ChevronUp size={20} />
              </button>
              <span className="text-sm font-medium">
                {calculateVote(post.votes)}
              </span>
              <button className="text-gray-400 hover:text-red-500 focus:outline-none">
                <ChevronDown size={20} />
              </button>
            </div>

            {/* Post content */}
            <div className="flex-1">
              <div className="flex items-center text-xs text-gray-500 mb-2">
                <span>Posted by u/{post.user?.username}</span>
                <span className="mx-1">•</span>
                <span>{formatDate(post.createdAt)}</span>
              </div>
              
              <h3 className="text-lg font-medium mb-2">{post.title}</h3>
              <p className="text-gray-800 mb-3 line-clamp-3">{post.content}</p>
              
              <div className="flex items-center gap-4 text-gray-500 text-sm">
                <div className="flex items-center gap-1">
                  <MessageSquare size={16} />
                  <span>{post._count?.comments || 0} comments</span>
                </div>
              </div>
            </div>
          </div>
        </Link>
      ))}

      {posts.length === 0 && (
        <div className="bg-white rounded-md shadow p-8 text-center">
          <p className="text-gray-500">No posts yet.</p>
        </div>
      )}
    </div>
  );
}