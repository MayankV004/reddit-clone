'use client';
import { useState } from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { toast } from 'sonner';

interface VoteButtonsProps {
  postId?: string;
  commentId?: string;
  initialVoteScore: number;
  initialVote: number; // 1, -1, or 0
  isLoggedIn: boolean;
  orientation?: 'vertical' | 'horizontal';
  size?: 'sm' | 'md' | 'lg';
}

export default function VoteButtons({
  postId,
  commentId,
  initialVoteScore,
  initialVote,
  isLoggedIn,
  orientation = 'vertical',
  size = 'md',
}: VoteButtonsProps) {
  const [voteScore, setVoteScore] = useState(initialVoteScore);
  const [userVote, setUserVote] = useState(initialVote);
  const [isLoading, setIsLoading] = useState(false);

  // Determine icon size based on the size prop
  const iconSize = {
    sm: 14,
    md: 18,
    lg: 22
  }[size];

  // CSS classes for different orientations
  const containerClasses = orientation === 'vertical' 
    ? 'flex flex-col items-center space-y-1' 
    : 'flex flex-row items-center space-x-2';

  async function handleVote(value: number) {
    if (!isLoggedIn) {
      toast('You must be logged in to vote');
      return;
    }

    if (isLoading) return;
    if (!postId && !commentId) return;

    try {
      setIsLoading(true);
      
     
      const newVoteValue = userVote === value ? 0 : value;
      
     
      let vote = 0;
      if (userVote === 0) {
     
        vote = value;
      } else if (newVoteValue === 0) {
      
        vote = -userVote;
      } else {
        
        vote = 2 * value;
      }
      
    
      setVoteScore(prev => prev + vote);
      setUserVote(newVoteValue);

      const response = await fetch('/api/votes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          postId,
          commentId,
          value: newVoteValue,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        console.error('Vote error:', error);
        throw new Error('Failed to cast vote');
      }
      
    } catch (error) {
      console.error('Vote error:', error);
     
      setVoteScore(initialVoteScore);
      setUserVote(initialVote);
      toast('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }

 
  const buttonSize = {
    sm: 'p-0.5',
    md: 'p-1',
    lg: 'p-1.5'
  }[size];
  
  const textSize = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base'
  }[size];

  return (
    <div className={containerClasses}>
      <button
        className={`${buttonSize} rounded transition-colors ${
          userVote === 1 ? 'text-orange-500' : 'text-gray-400 hover:text-gray-600'
        }`}
        onClick={() => handleVote(1)}
        disabled={isLoading}
        aria-label="Upvote"
      >
        <ChevronUp size={iconSize} />
      </button>
      
      <span className={`${textSize} font-medium ${
        userVote === 1 ? 'text-orange-500' :
        userVote === -1 ? 'text-purple-500' : 'text-gray-600'
      }`}>
        {voteScore}
      </span>
      
      <button
        className={`${buttonSize} rounded transition-colors ${
          userVote === -1 ? 'text-purple-500' : 'text-gray-400 hover:text-gray-600'
        }`}
        onClick={() => handleVote(-1)}
        disabled={isLoading}
        aria-label="Downvote"
      >
        <ChevronDown size={iconSize} />
      </button>
    </div>
  );
}