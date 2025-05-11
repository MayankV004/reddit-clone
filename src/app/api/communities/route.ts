import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";

const communitySchema = z.object({
  name: z.string().min(3).max(21),
  
});

export async function GET() { // to fetch all Communities
  try {
    const communities = await prisma.community.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
    return NextResponse.json(communities, { status: 200 });
  } catch (error) {
    console.error("Error fetching communities:", error);
    return NextResponse.json(
      { error: "Failed to fetch communities" },
      { status: 500 }
    );
  }
}

//Create a new Community
export async function POST(req: Request)
{
  try {

      const session = await getServerSession(authOptions)

      if(!session || !session.user || !session.user.id)
      {
         return NextResponse.json({error : "Unauthorized"} , {status :401});
      }
        const userId  = session?.user.id;

        // Check if the user is authenticated
        if(!userId) {
            return NextResponse.json({
                error:"Unauthorized",
            }, { status: 401 });
        }

        const body = await req.json();

        // Validation
        const validateResult = communitySchema.safeParse(body);
        if(!validateResult.success){
            return NextResponse.json(
                {error: validateResult.error.errors}, 
                { status: 400 });
        }       
        
        const { name } = validateResult.data;
        const slug = name.toLowerCase().replace(/\s+/g, "-");
        const existingCommunity = await prisma.community.findFirst({
            where: { 
                OR: [
                    { name },
                    { slug },
                ],
            },
        });
        
        if(existingCommunity)
        {
          return NextResponse.json({error : "Community Already Exist"
          },{status:409});
        }

        const community = await prisma.community.create({
          data: {
            name,
            slug,
            creator: { connect: { id: userId } }, // Link creator field with the user's ID
          },
        });
        return NextResponse.json(community);

    } catch (error) {
        console.error("Error creating community:", error);
        return NextResponse.json(
          { error: "Failed to create community" },
          { status: 500 }
        );
    }
    finally {
        await prisma.$disconnect();
    }
}