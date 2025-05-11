'use client';

import { useState } from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface VoteButtonsProps {
  postId: string;
  initialVoteScore: number;
  initialVote: number; // 1, -1, or 0
  isLoggedIn: boolean;
}

export default function VoteButtons({
  postId,
  initialVoteScore,
  initialVote,
  isLoggedIn,
}: VoteButtonsProps) {
  const [voteScore, setVoteScore] = useState(initialVoteScore);
  const [userVote, setUserVote] = useState(initialVote);
  const [isLoading, setIsLoading] = useState(false);

  async function handleVote(value: number) {
    if (!isLoggedIn) {
      toast.error('You must be logged in to vote');
      return;
    }

    if (isLoading) return;

    try {
      setIsLoading(true);
      
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
          postId,
          value: voteValue,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to cast vote');
      }

    } catch (error) {
      // Revert on error
      setVoteScore(initialVoteScore);
      setUserVote(initialVote);
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex flex-col items-center space-y-2">
      <button
        className={`p-1 rounded ${
          userVote === 1 ? 'text-orange-500' : 'text-gray-400 hover:text-gray-600'
        }`}
        onClick={() => handleVote(1)}
        disabled={isLoading}
        aria-label="Upvote"
      >
        <ChevronUp className="w-5 h-5" />
      </button>
      
      <span className={`text-xs font-medium ${
        userVote === 1 ? 'text-orange-500' : 
        userVote === -1 ? 'text-blue-500' : 'text-gray-600'
      }`}>
        {voteScore}
      </span>
      
      <button
        className={`p-1 rounded ${
          userVote === -1 ? 'text-blue-500' : 'text-gray-400 hover:text-gray-600'
        }`}
        onClick={() => handleVote(-1)}
        disabled={isLoading}
        aria-label="Downvote"
      >
        <ChevronDown className="w-5 h-5" />
      </button>
    </div>
  );
}