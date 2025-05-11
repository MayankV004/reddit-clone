'use client';

import Link from 'next/link';
import { Community } from '@/types';
import { formatDistanceToNow } from 'date-fns/formatDistanceToNow';

interface CommunityCardProps {
  community: Community & {
    _count?: {
      posts: number;
    };
  };
}

export default function CommunityCard({ community }: CommunityCardProps) {
  return (
    <div className="bg-white rounded-md shadow p-4">
      <h2 className="text-lg font-semibold mb-2">r/{community.slug}</h2>
      
      <div className="text-sm text-gray-500 mb-4">
        <div>
          {community._count?.posts || 0} posts
        </div>
        <div>
          Created {formatDistanceToNow(new Date(community.createdAt), { addSuffix: true })}
        </div>
      </div>

      <Link
        href={`/r/${community.slug}`}
        className="block text-center bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-md transition-colors"
      >
        View Community
      </Link>
    </div>
  );
}