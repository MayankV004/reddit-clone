'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

export default function CreateCommunityForm() {
  const router = useRouter();
  const {data: session , status} = useSession();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(()=> {
    if(status === 'unauthenticated')
    {
      router.push("/login");
    }
  } , [status , router])


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    if (name.length < 3 || name.length > 21) {
      setError('Community name must be between 3 and 21 characters');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/communities', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name ,description}),
      });

      const data = await response.json();

      if (!response.ok) {

        if (response.status === 401) {
          router.push(`/login?callbackUrl=${encodeURIComponent('/communities')}`);
          return;
        }
        throw new Error(data.error || 'Something went wrong');
      }
      //reset form
      setName('');
      setDescription('');
    
      router.push(`/r/${data.slug}`);
      router.refresh();
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Failed to create community');
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  if (status === 'loading') {
    return (
      <div className="bg-white shadow rounded-lg p-6 max-w-md mx-auto dark:bg-zinc-900 dark:shadow-md dark:border-1">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div className="h-10 bg-gray-200 rounded mb-4"></div>
          <div className="h-24 bg-gray-200 rounded mb-4"></div>
          <div className="h-10 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }


  if (status === 'unauthenticated') {
    return null; 
  }

  return (
    <div className="bg-white shadow rounded-lg p-6 max-w-md mx-auto dark:bg-zinc-900 dark:shadow-md dark:border-1">
      <h2 className="text-xl font-bold mb-4">Create a Community</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="name" className="block text-sm font-medium text-zinc-500 mb-1">
            Name
          </label>
          <div className="flex items-center">
            <span className="bg-gray-100 border border-r-0 border-zinc-600 rounded-l-md px-3 py-2 text-zinc-200 dark:bg-zinc-900">
              r/
            </span>
            <input
              type="text"
              id="name"
              name="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="community_name"
              className="flex-1 border border-zinc-600 rounded-r-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
              required
              minLength={3}
              maxLength={21}
            />
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Community names must be between 3-21 characters and can only contain letters, numbers, and underscores.
          </p>
        </div>
        <div className='mb-4'>
          <label htmlFor="description" className="block text-sm font-medium text-zinc-500 mb-1">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}

            rows={3}
            className="w-full border border-zinc-600 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-orange-500"
            placeholder="Describe your community"
          ></textarea>
        </div>
        <div>

        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-500 rounded-md text-sm">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 rounded-full font-thin transition-colors disabled:bg-orange-300"
        >
          {isLoading ? 'Creating...' : 'Create Community'}
        </button>
      </form>
    </div>
  );
}