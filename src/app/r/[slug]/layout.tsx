import { notFound } from 'next/navigation';
import { Metadata } from "next";
import { getCommunity } from "@/app/actions/communityActions";

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
}: {
  children: React.ReactNode;
  params: { slug: string };
}) {
  const { slug } = params;
  if(!slug){
    return notFound();
  }
  const community = await getCommunity(slug);
  
  if (!community) {
    return notFound();
  }
  
  return (
    <div>
      {children}
    </div>
  );
}