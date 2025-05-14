// components/profile/ProfileHeader.tsx
"use client";

import { useState } from "react";
import Image from "next/image";
import { User, Subscription, Post } from "@prisma/client";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { CalendarIcon, FileText, Users, Pencil } from "lucide-react";
import { format } from "date-fns";
import EditProfileModal from "./EditProfileModal";

// Define full type including relations
interface ProfileWithRelations extends User {
  subscriptions: Array<Subscription & { 
    community: { name: string, imageUrl?: string | null } 
  }>;
  posts: Post[];
}

interface ProfileHeaderProps {
  user: ProfileWithRelations;
}

export default function ProfileHeader({ user }: ProfileHeaderProps) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  
  // Function to get user's initials for avatar fallback
  const getUserInitials = () => {
    if (user.name) {
      return user.name.slice(0, 2).toUpperCase();
    }
    return user.username.slice(0, 2).toUpperCase();
  };

  return (
    <>
      <Card className="mb-6 overflow-hidden">
        <div className="h-32 bg-gradient-to-r from-blue-500 to-purple-600" />
        
        <CardContent className="relative pt-0">
          <div className="flex flex-col sm:flex-row items-start sm:items-end sm:justify-between -mt-12 mb-4">
            <div className="flex items-end">
              <div className="rounded-full border-4 border-white dark:border-zinc-800 shadow-lg overflow-hidden bg-white dark:bg-zinc-800">
                {user.image ? (
                  <Image 
                    src={user.image} 
                    alt={user.username} 
                    width={96} 
                    height={96}
                    className="h-24 w-24 object-cover"
                  />
                ) : (
                  <div className="h-24 w-24 flex items-center justify-center bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-200 text-2xl font-bold">
                    {getUserInitials()}
                  </div>
                )}
              </div>
              
              <div className="hidden sm:block ml-4 mb-2">
                <h1 className="text-2xl font-bold">
                  {user.name || user.username}
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  @{user.username}
                </p>
              </div>
            </div>
            
            <Button 
              variant="outline" 
              size="sm" 
              className="mt-4 sm:mt-0 gap-2"
              onClick={() => setIsEditModalOpen(true)}
            >
              <Pencil className="h-4 w-4" />
              Edit Profile
            </Button>
          </div>
          
          <div className="sm:hidden mb-4">
            <h1 className="text-2xl font-bold">
              {user.name || user.username}
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              @{user.username}
            </p>
          </div>
          
          <div className="flex flex-wrap gap-6 text-sm text-gray-500 dark:text-gray-400">
            {user.email && (
              <div>
                <span className="font-medium text-gray-900 dark:text-gray-200">Email:</span> {user.email}
              </div>
            )}
            
            <div className="flex items-center gap-1">
              <CalendarIcon className="h-4 w-4" />
              Joined {format(new Date(user.createdAt), "MMMM yyyy")}
            </div>
            
            <div className="flex items-center gap-1">
              <FileText className="h-4 w-4" />
              {user.posts.length} {user.posts.length === 1 ? "Post" : "Posts"}
            </div>
            
            <div className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              {user.subscriptions.length} {user.subscriptions.length === 1 ? "Community" : "Communities"}
            </div>
          </div>
        </CardContent>
      </Card>
      
      {isEditModalOpen && (
        <EditProfileModal 
          user={user} 
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
        />
      )}
    </>
  );
}