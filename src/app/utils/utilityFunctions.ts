import { formatDistanceToNow } from "date-fns/formatDistanceToNow";


export const formatDate = (date: Date) => {
  return formatDistanceToNow(new Date(date), { addSuffix: true });
};

export const calculateVoteScore = (votes: any[]) => {
  return votes.reduce((acc, vote) => acc + vote.value, 0);
};

export const getUserVote = (votes: any[], userId?: string) => {
  if (!userId) return 0;
  const userVote = votes.find((vote) => vote.userId === userId);
  return userVote ? userVote.value : 0;
};

export function getTotalVotes(votes: { value: number }[]): number {
  return votes.reduce((total, vote) => total + vote.value, 0);
}
