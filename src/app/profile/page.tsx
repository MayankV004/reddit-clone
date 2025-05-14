import { requireAuth } from "@/lib/session";
import ProfileHeader from "@/components/profile/ProfileHeader";
import ProfileTabs from "@/components/profile/ProfileTabs";
import { prisma } from "@/lib/prisma";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Your Profile | Reddit Clone",
  description: "View and edit your profile, posts, and communities",
};

export default async function ProfilePage() {
  const user = await requireAuth();
  
  const userData = await prisma.user.findUnique({
    where: { id: user.id },
    include: {
      posts: {
        include: {
          community: true,
          votes: true,
          comments: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      },
      subscriptions: {
        include: {
          community: true,
        },
      },
    },
  });

  if (!userData) {
    throw new Error("User not found");
  }

  return (
    <div className="container max-w-4xl mx-auto py-6 px-4 sm:px-6">
      <ProfileHeader user={userData} />
      <ProfileTabs user={userData} />
    </div>
  );
}