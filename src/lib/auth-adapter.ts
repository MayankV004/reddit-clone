import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import { nanoid } from "nanoid";
import { Adapter, AdapterUser } from "next-auth/adapters";



interface OAuthUserData {
  name?: string | null;
  email?: string | null;
  image?: string | null;
  emailVerified?: Date | null;
}


export const customPrismaAdapter: Adapter = {
  ...PrismaAdapter(prisma),
  

  createUser: async (userData: OAuthUserData): Promise<AdapterUser> => {
  
    const username = userData.email ? 
      userData.email.split('@')[0].replace(/[^a-zA-Z0-9]/g, '') : 
      `user_${nanoid(6)}`;
    
   
    const user = await prisma.user.create({
      data: {
        id: nanoid(), 
        username: username,
        name: userData.name || null,
        email: userData.email || null,
        emailVerified: userData.emailVerified,
        image: userData.image || null,
      },
    });
    
    return user as AdapterUser;
  }
};