
"use client";
import { User, Post, Community, Subscription, Vote, Comment } from "@prisma/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import Image from "next/image";
import { formatDistanceToNow } from "date-fns/formatDistanceToNow";
import { MessageSquare, ThumbsUp, ArrowUp, ArrowDown } from "lucide-react";

// Define the types with all relations
interface PostWithRelations extends Post {
  community: Community;
  votes: Vote[];
  comments: Comment[];
}

interface ProfileWithRelations extends User {
  subscriptions: Array<Subscription & { 
    community: Community;
  }>;
  posts: PostWithRelations[];
}

interface ProfileTabsProps {
  user: ProfileWithRelations;
}

export default function ProfileTabs({ user }: ProfileTabsProps) {
  // Calculate vote score for a post
  const getVoteScore = (post: PostWithRelations) => {
    return post.votes.reduce((acc, vote) => acc + vote.value, 0);
  };

  // Function to get community initials for fallback
  const getCommunityInitials = (name: string) => {
    return name.slice(0, 2).toUpperCase();
  };

  return (
    <Tabs defaultValue="posts" className="w-full">
      <TabsList className="grid w-full grid-cols-2 mb-6">
        <TabsTrigger value="posts">My Posts</TabsTrigger>
        <TabsTrigger value="communities">My Communities</TabsTrigger>
      </TabsList>

      <TabsContent value="posts" className="space-y-4">
        {user.posts.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center text-gray-500 dark:text-gray-400">
              <p className="text-lg">You haven't created any posts yet.</p>
              <Link href="/submit" className="text-blue-500 hover:underline block mt-2">
                Create your first post
              </Link>
            </CardContent>
          </Card>
        ) : (
          user.posts.map((post) => (
            <Card key={post.id} className="overflow-hidden hover:shadow-md transition-shadow">
              <Link href={`/r/${post.community.name}/post/${post.slug || post.id}`}>
                <CardContent className="p-4">
                  <div className="flex flex-col space-y-3">
                    {/* Post header with community and timestamp */}
                    <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                      <div className="flex items-center">
                        {post.community.imageUrl ? (
                          <div className="h-5 w-5 rounded-full overflow-hidden mr-1.5">
                            <Image 
                              src={post.community.imageUrl} 
                              alt={post.community.name} 
                              width={20} 
                              height={20}
                              className="object-cover"
                            />
                          </div>
                        ) : (
                          <div className="h-5 w-5 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-200 flex items-center justify-center text-xs font-bold mr-1.5">
                            {getCommunityInitials(post.community.name)}
                          </div>
                        )}
                        <span className="font-medium">r/{post.community.name}</span>
                      </div>
                      <span>•</span>
                      <span>{formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}</span>
                    </div>
                    
                    {/* Post title */}
                    <h3 className="text-lg font-semibold">{post.title}</h3>
                    
                    {/* Post image if exists */}
                    {post.imageUrl && (
                      <div className="relative h-48 rounded-md overflow-hidden bg-gray-100 dark:bg-zinc-800">
                        <Image 
                          src={post.imageUrl} 
                          alt={post.title} 
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}
                    
                    {/* Post content preview */}
                    {post.content && (
                      <p className="text-gray-700 dark:text-gray-300 line-clamp-2">
                        {post.content}
                      </p>
                    )}
                    
                    {/* Post stats */}
                    <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                      <div className="flex items-center space-x-1">
                        <ThumbsUp className="h-4 w-4" />
                        <span>{getVoteScore(post)} votes</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <MessageSquare className="h-4 w-4" />
                        <span>{post.comments.length} comments</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Link>
            </Card>
          ))
        )}
      </TabsContent>

      <TabsContent value="communities" className="space-y-4">
        {user.subscriptions.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center text-gray-500 dark:text-gray-400">
              <p className="text-lg">You haven't joined any communities yet.</p>
              <Link href="/communities" className="text-blue-500 hover:underline block mt-2">
                Browse communities
              </Link>
            </CardContent>
          </Card>
        ) : (
          user.subscriptions.map(({ community }) => (
            <Card key={community.id} className="overflow-hidden hover:shadow-md transition-shadow">
              <Link href={`/r/${community.name}`}>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    {/* Community image */}
                    {community.imageUrl ? (
                      <div className="h-12 w-12 rounded-full overflow-hidden flex-shrink-0">
                        <Image 
                          src={community.imageUrl} 
                          alt={community.name} 
                          width={48} 
                          height={48}
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <div className="h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-200 flex items-center justify-center text-lg font-bold flex-shrink-0">
                        {getCommunityInitials(community.name)}
                      </div>
                    )}
                    
                    {/* Community info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold truncate">r/{community.name}</h3>
                      {community.description && (
                        <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
                          {community.description}
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Link>
            </Card>
          ))
        )}
      </TabsContent>
    </Tabs>
  );
}