'use client';

import { useSession } from "next-auth/react";
import CreateCommunityForm from "@/components/CreateCommunityForm";
import { useRouter } from "next/navigation";


export function CommunitySidebar() {
  const { data: session, status } = useSession();
  const router = useRouter();


  if (status === 'unauthenticated') {
    return (
      <div className="bg-white shadow rounded-lg p-6 dark:bg-zinc-900 border-1 dark:shadow-md">
        <h2 className="text-xl font-bold mb-4 text-zinc-500">Create a Community</h2>
        <p className="text-zinc-500 mb-4">
          You need to be logged in to create a community.
        </p>
        <button
          onClick={() => router.push(`/login`)}
          className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 rounded-full font-thin transition-colors"
        >
          Log In
        </button>
      </div>
    );
  }

  // Show loading state
  if (status === 'loading') {
    return (
      <div className="bg-white shadow rounded-lg p-6 dark:bg-zinc-900 border-1 dark:shadow-md">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-3/4 mb-4 dark:bg-zinc-600  "></div>
          <div className="h-24 bg-gray-200 rounded mb-4 dark:bg-zinc-600 "></div>
          <div className="h-10 bg-gray-200 rounded dark:bg-zinc-600 "></div>
        </div>
      </div>
    );
  }

  // Show form for authenticated users
  return <CreateCommunityForm />;
}