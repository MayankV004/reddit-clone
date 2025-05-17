"use client";

import { useState } from "react";
import Link from "next/link";
import PostFeed from "@/components/PostFeed";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Post , Community } from "@/types";

interface HomePageProps {
  initialPosts: Post[];
  popularCommunities: Community[];
  currentUser: { id: string } | null;
}

export default function HomePage({ 
  initialPosts, 
  popularCommunities, 
  currentUser
}: HomePageProps) {
  const [posts, setPosts] = useState<Post[]>(initialPosts);
const [sortOption, setSortOption] = useState<string>("Recent Posts");
const [isLoading, setIsLoading] = useState<boolean>(false);

// console.log(popularCommunities)

  const handleSortChange = async (value:string) => {
    setIsLoading(true);
    setSortOption(value);
    
    try {
      const sortParam = value === "Votes" ? "votes" : "recent";
      const response = await fetch(`/api/posts?sort=${sortParam}`);
      
      if (!response.ok) {
        throw new Error(`Error fetching posts: ${response.statusText}`);
      }
      
      const data = await response.json();
      setPosts(data);
    } catch (error) {
      console.error("Error sorting posts:", error);
      
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto max-w-5xl px-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 mt-4">
          <h1 className="text-2xl font-bold mb-4">
            {sortOption === "Votes" ? "Popular Posts" : "Recent Posts"}
          </h1>

          <div className="mb-4">
            <Select value={sortOption} onValueChange={handleSortChange}>
              <SelectTrigger className="w-[130px]">
                <SelectValue placeholder="Sort" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Recent Posts">Recent Posts</SelectItem>
                <SelectItem value="Votes">Votes</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {isLoading ? (
            <div className="bg-white rounded-md shadow p-6 text-center dark:bg-zinc-900">
              <p className="text-gray-500">Loading posts...</p>
            </div>
          ) : posts.length > 0 ? (
            <PostFeed posts={posts} currentUser={currentUser} />
          ) : (
            <div className="bg-white rounded-md shadow p-6 text-center dark:bg-zinc-900">
              <p className="text-gray-500">No posts yet.</p>
              <Link
                href="/communities"
                className="mt-4 inline-block text-blue-500 hover:underline"
              >
                Join a community to see posts
              </Link>
            </div>
          )}
        </div>

        <div>
          <div className="bg-white rounded-md shadow p-4 mb-6 dark:bg-zinc-900 dark:shadow-md dark:border-1 mt-4">
            <h2 className="text-lg font-semibold mb-3">Popular Communities</h2>

            {popularCommunities.length > 0 ? (
              <div className="space-y-2">
                {popularCommunities.map((community) => (
                  <Link
                    key={community.id}
                    href={`/r/${community.slug}`}
                    className="block p-2 hover:bg-gray-50 rounded-md transition-colors dark:hover:bg-zinc-800"
                  >
                    <div className="font-medium">r/{community.slug}</div>
                    <div className="text-xs text-gray-500">
                      {community._count?.posts} posts
                    </div>
                  </Link>
                ))}

                <Link
                  href="/communities"
                  className="block text-orange-500 text-sm mt-3 hover:underline"
                >
                  View all communities
                </Link>
              </div>
            ) : (
              <div className="text-center text-zinc-500 py-2">
                <p>No communities yet</p>
                <Link
                  href="/communities"
                  className="mt-2 inline-block text-blue-500 hover:underline"
                >
                  Create the first community
                </Link>
              </div>
            )}
          </div>

          <div className="dark:bg-zinc-900 bg-white rounded-md shadow p-4 fixed bottom-2 text-xs text-zinc-500 flex flex-col items-start">
            <div className="flex items-center gap-2">
              <Link href="#" className="hover:underline">
                Reddit Rules
              </Link>
              <Link href="#" className="hover:underline">
                Privacy Policy
              </Link>
              <Link href="#" className="hover:underline">
                User Agreement
              </Link>
            </div>
            <div>
              <p className="text-center text-gray-500 text-xs mt-2 hover:underline">
                Reddit, Inc © 2025 All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}