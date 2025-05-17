import { prisma } from "@/lib/prisma";
import { notFound } from 'next/navigation';
import { Metadata } from "next";

// Use the correct type definition for layout params
interface CommunityLayoutParams {
  params: {
    slug: string;
  };
  children: React.ReactNode;
}

async function getCommunityBySlug(slug: string) {
  try {
    const community = await prisma.community.findUnique({
      where: {
        slug,
      },
    });
    
    return community;
  } catch (error) {
    console.error('Error fetching community:', error);
    return null;
  } finally {
    await prisma.$disconnect();
  }
}

export const metadata: Metadata = {
  title: "Community-Reddit",
  description: "Community Page",
  icons: {
    icon: "/reddit_favicon.png",
  },
};

export default async function CommunityLayout({
  children,
  params,
}: CommunityLayoutParams) {
  const { slug } = params;
  const community = await getCommunityBySlug(slug);
  // console.log("Community Layout", community);
  
  if (!community) {
    return notFound();
  }
  
  return (
    <div>
      {children}
    </div>
  );
}