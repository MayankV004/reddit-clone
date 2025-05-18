import { Suspense } from "react";
import HomePage from "./HomePage";
import { getRecentPosts } from "./actions/postActions";
import { getPopularCommunities } from "./actions/communityActions";
import { getCurrentUser } from "@/lib/session";

export default async function Home() {
  const recentPosts = await getRecentPosts();
  const popularCommunities = await getPopularCommunities();
  const currentUser = await getCurrentUser();
  // const postByVote = await getPopularPosts();

  // console.log("vote", postByVote);

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <HomePage 
        initialPosts={recentPosts} 
        popularCommunities={popularCommunities} 
        currentUser={currentUser ? { id: currentUser.id } : null} 
      />
    </Suspense>
  );
}