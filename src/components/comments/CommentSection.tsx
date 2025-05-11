'use client';

import { useState } from 'react';
import { formatDistanceToNow } from 'date-fns/formatDistanceToNow';
import Image from 'next/image';
import { ChevronUp, ChevronDown, Reply, MoreHorizontal } from 'lucide-react';
import { toast } from 'react-hot-toast';

type Comment = {
  id: string;
  text: string;
  createdAt: Date;
  user: {
    id: string;
    username: string;
    image: string | null;
  };
  votes: {
    id: string;
    value: number;
    userId: string;
  }[];
  _count: {
    children: number;
  };
};

interface CommentSectionProps {
  postId: string;
  comments: Comment[];
  isLoggedIn: boolean;
  userId?: string;
}

export default function CommentSection({
  postId,
  comments,
  isLoggedIn,
  userId,
}: CommentSectionProps) {
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [commentsList, setCommentsList] = useState<Comment[]>(comments);

  async function handleSubmitComment(e: React.FormEvent) {
    e.preventDefault();
    
    if (!isLoggedIn) {
      toast.error('You must be logged in to comment');
      return;
    }
    
    if (!newComment.trim()) {
      toast.error('Comment cannot be empty');
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      const response = await fetch('/api/comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          postId,
          text: newComment,
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to submit comment');
      }
      
      const createdComment = await response.json();
      
      // Add new comment to the list
      setCommentsList([createdComment, ...commentsList]);
      setNewComment(''); // Clear input
      toast.success('Comment posted successfully');
      
    } catch (error) {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }

  function getTotalVotes(votes: { value: number }[]) {
    return votes.reduce((total, vote) => total + vote.value, 0);
  }

  function getUserVote(votes: { userId: string; value: number }[]) {
    if (!userId) return 0;
    const userVote = votes.find(vote => vote.userId === userId);
    return userVote ? userVote.value : 0;
  }

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h2 className="text-lg font-medium mb-4">Comments</h2>
      
      {/* Comment form */}
      <form onSubmit={handleSubmitComment} className="mb-6">
        <textarea
          className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px]"
          placeholder={isLoggedIn ? "What are your thoughts?" : "Log in to leave a comment"}
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          disabled={!isLoggedIn || isSubmitting}
        ></textarea>
        
        <div className="flex justify-end mt-2">
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded-md font-medium disabled:opacity-50"
            disabled={!isLoggedIn || isSubmitting || !newComment.trim()}
          >
            {isSubmitting ? 'Posting...' : 'Comment'}
          </button>
        </div>
      </form>
      
      {/* Comments list */}
      <div className="space-y-4">
        {commentsList.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No comments yet. Be the first to comment!</p>
        ) : (
          commentsList.map(comment => (
            <CommentItem 
              key={comment.id} 
              comment={comment} 
              postId={postId}
              isLoggedIn={isLoggedIn}
              userId={userId}
            />
          ))
        )}
      </div>
    </div>
  );
}

interface CommentItemProps {
  comment: Comment;
  postId: string;
  isLoggedIn: boolean;
  userId?: string;
}

function CommentItem({ comment, postId, isLoggedIn, userId }: CommentItemProps) {
  const [isReplying, setIsReplying] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [showReplies, setShowReplies] = useState(false);
  const [replies, setReplies] = useState<Comment[]>([]);
  const [isLoadingReplies, setIsLoadingReplies] = useState(false);
  const [userVote, setUserVote] = useState(userId ? getUserVote(comment.votes) : 0);
  const [voteScore, setVoteScore] = useState(getTotalVotes(comment.votes));

  async function fetchReplies() {
    if (comment._count.children === 0) return;
    
    try {
      setIsLoadingReplies(true);
      const response = await fetch(`/api/comments?parentId=${comment.id}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch replies');
      }
      
      const data = await response.json();
      setReplies(data);
      setShowReplies(true);
      
    } catch (error) {
      toast.error('Failed to load replies');
    } finally {
      setIsLoadingReplies(false);
    }
  }

  async function handleSubmitReply(e: React.FormEvent) {
    e.preventDefault();
    
    if (!isLoggedIn) {
      toast.error('You must be logged in to reply');
      return;
    }
    
    if (!replyText.trim()) {
      toast.error('Reply cannot be empty');
      return;
    }
    
    try {
      const response = await fetch('/api/comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          postId,
          parentId: comment.id,
          text: replyText,
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to submit reply');
      }
      
      const createdReply = await response.json();
      
      // Update reply count and add reply to list if replies are shown
      if (showReplies) {
        setReplies([createdReply, ...replies]);
      } else {
        comment._count.children += 1;
        fetchReplies(); // Fetch and show replies
      }
      
      setReplyText('');
      setIsReplying(false);
      toast.success('Reply posted successfully');
      
    } catch (error) {
      toast.error('Something went wrong. Please try again.');
    }
  }

  async function handleVote(value: number) {
    if (!isLoggedIn) {
      toast.error('You must be logged in to vote');
      return;
    }

    try {
      // If clicking the same button, remove the vote
      const voteValue = userVote === value ? 0 : value;
      
      // Optimistically update UI
      if (userVote === value) {
        // Remove vote
        setVoteScore(voteScore - value);
        setUserVote(0);
      } else {
        // Add new vote or change existing vote
        setVoteScore(voteScore - userVote + value);
        setUserVote(value);
      }

      // Send request to API
      const response = await fetch('/api/votes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          commentId: comment.id,
          value: voteValue,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to cast vote');
      }

    } catch (error) {
      // Revert on error
      setVoteScore(getTotalVotes(comment.votes));
      setUserVote(userId ? getUserVote(comment.votes) : 0);
      toast.error('Something went wrong. Please try again.');
    }
  }

  const timeAgo = formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true });

  return (
    <div className="border-l-2 border-gray-200 pl-4 ml-2">
      <div className="flex items-start gap-3">
        {/* User avatar */}
        <div className="flex-shrink-0">
          {comment.user.image ? (
            <Image 
              src={comment.user.image} 
              alt={comment.user.username} 
              width={32} 
              height={32} 
              className="rounded-full"
            />
          ) : (
            <div className="w-8 h-8 bg-gray-200 rounded-full" />
          )}
        </div>
        
        <div className="flex-1">
          {/* Comment header */}
          <div className="flex items-center text-sm mb-1">
            <span className="font-medium mr-2">{comment.user.username}</span>
            <span className="text-gray-500 text-xs">{timeAgo}</span>
          </div>
          
          {/* Comment content */}
          <div className="text-sm mb-2">{comment.text}</div>
          
          {/* Comment actions */}
          <div className="flex items-center gap-4 text-xs text-gray-500">
            {/* Vote buttons */}
            <div className="flex items-center gap-1">
              <button 
                onClick={() => handleVote(1)}
                className={`p-1 ${userVote === 1 ? 'text-orange-500' : 'hover:text-gray-700'}`}
              >
                <ChevronUp className="w-3 h-3" />
              </button>
              <span className={`${
                userVote === 1 ? 'text-orange-500' : 
                userVote === -1 ? 'text-blue-500' : ''
              }`}>
                {voteScore}
              </span>
              <button 
                onClick={() => handleVote(-1)}
                className={`p-1 ${userVote === -1 ? 'text-blue-500' : 'hover:text-gray-700'}`}
              >
                <ChevronDown className="w-3 h-3" />
              </button>
            </div>
            
            {/* Reply button */}
            <button 
              onClick={() => isLoggedIn && setIsReplying(!isReplying)}
              className="flex items-center gap-1 hover:text-gray-700"
              disabled={!isLoggedIn}
            >
              <Reply className="w-3 h-3" />
              Reply
            </button>

            {/* Show replies button */}
            {comment._count.children > 0 && !showReplies && (
              <button 
                onClick={fetchReplies}
                className="flex items-center gap-1 hover:text-gray-700"
                disabled={isLoadingReplies}
              >
                {isLoadingReplies ? 'Loading...' : `Show ${comment._count.children} replies`}
              </button>
            )}
            
            {/* Hide replies button */}
            {showReplies && replies.length > 0 && (
              <button 
                onClick={() => setShowReplies(false)}
                className="flex items-center gap-1 hover:text-gray-700"
              >
                Hide replies
              </button>
            )}
          </div>
          
          {/* Reply form */}
          {isReplying && (
            <form onSubmit={handleSubmitReply} className="mt-3">
              <textarea
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm min-h-[80px]"
                placeholder="Write a reply..."
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
              ></textarea>
              
              <div className="flex justify-end gap-2 mt-2">
                <button
                  type="button"
                  className="px-3 py-1 text-sm text-gray-600 rounded-md hover:bg-gray-100"
                  onClick={() => setIsReplying(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3 py-1 text-sm bg-blue-500 text-white rounded-md disabled:opacity-50"
                  disabled={!replyText.trim()}
                >
                  Reply
                </button>
              </div>
            </form>
          )}
          
          {/* Replies */}
          {showReplies && replies.length > 0 && (
            <div className="mt-3 space-y-4">
              {replies.map(reply => (
                <CommentItem 
                  key={reply.id} 
                  comment={reply} 
                  postId={postId}
                  isLoggedIn={isLoggedIn}
                  userId={userId}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function getUserVote(votes: { userId: string; value: number }[], userId?: string) {
  if (!userId) return 0;
  const userVote = votes.find(vote => vote.userId === userId);
  return userVote ? userVote.value : 0;
}

function getTotalVotes(votes: { value: number }[]) {
  return votes.reduce((total, vote) => total + vote.value, 0);
}