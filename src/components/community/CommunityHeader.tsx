"use client"

import { Community } from "@/types"
import { useSession } from "next-auth/react"
import Link from "next/link";
import { useState } from "react";
import CreatePostForm from "./CreatePostForm"
interface CommunityHeaderProps {
  community: Community;
}

export default function CommunityHeader({community} : CommunityHeaderProps){
    const {data : session, status} = useSession();
    const [isPostOpen , setIsPostOpen] = useState(false);
    const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric'
    });
  };

    
    return (
        <div className="bg-white shadow rounded-md p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <img
            src={community.imageUrl || "/Reddit_Logo.webp"}
            alt={community.name}
            className="w-12 h-12 rounded-full mr-4"
          />
          <div>
          <h1 className="text-2xl font-bold">r/{community.slug}</h1>
          <p className="text-sm text-gray-500">
            Created on {formatDate(new Date(community.createdAt))}
          </p>
          <p className="text-sm text-gray-500">
            {community.description}
          </p>
          </div>
          
        </div>
        
        <div>
          {status === "authenticated" ? (
            <button
              onClick={() => 
                {
                  

                  setIsPostOpen(true)
                 
                }}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Create Post
            </button>
          ) : (
            <Link
              href="/sign-in"
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Sign in to Post
            </Link>
          )}
        </div>
      </div>

      {isPostOpen && (
        <div className="mt-4">
          <CreatePostForm 
            communityId={community.id} 
            onClose={() => setIsPostOpen(false)} 
          />
        </div>
      )}
    </div>
    )

}