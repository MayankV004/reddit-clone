import {prisma} from "@/lib/prisma"
import { notFound } from 'next/navigation';
import { Metadata } from "next";

interface LayoutProps {
  children: React.ReactNode;
  params: {
    slug: string;
  };
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

export async function generateMetadata({ params }: { params: { slug: string } }):Promise<Metadata> {
  const resParams = await Promise.resolve(params)
  const community = await getCommunityBySlug(resParams.slug);
  
  if (!community) {
    return {
      title: 'Community Not Found',
    };
  }

  return {
    title: `r/${community.slug} - Reddit Clone`,
    description: `Community page for r/${community.slug}`,
  };
}

export default async function CommunityLayout({ children, params }: LayoutProps) {
  const resParams = await Promise.resolve(params)
  const { slug } = resParams;
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