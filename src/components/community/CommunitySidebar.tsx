'use client';

import { useSession } from "next-auth/react";
import CreateCommunityForm from "@/components/CreateCommunityForm";
import { useRouter } from "next/navigation";


export function CommunitySidebar() {
  const { data: session, status } = useSession();
  const router = useRouter();


  if (status === 'unauthenticated') {
    return (
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-bold mb-4">Create a Community</h2>
        <p className="text-gray-600 mb-4">
          You need to be logged in to create a community.
        </p>
        <button
          onClick={() => router.push(`/login`)}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md font-medium transition-colors"
        >
          Log In
        </button>
      </div>
    );
  }

  // Show loading state
  if (status === 'loading') {
    return (
      <div className="bg-white shadow rounded-lg p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div className="h-24 bg-gray-200 rounded mb-4"></div>
          <div className="h-10 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  // Show form for authenticated users
  return <CreateCommunityForm />;
}