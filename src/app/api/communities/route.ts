import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/session";


const communitySchema = z.object({
  name: z
    .string()
    .min(3, { message: 'Community name must be at least 3 characters' })
    .max(21, { message: 'Community name must be at most 21 characters' })
    .regex(/^[a-zA-Z0-9_]+$/, { 
      message: 'Community name can only contain letters, numbers, and underscores' 
    }),
  description: z.string().max(300).optional(),
  // image: z.string().url().optional(),
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

        const user = await requireAuth();
        const userId  = user.id;

        // Check if the user is authenticated
        if(!userId) {
            return NextResponse.json({
                error:"Unauthorized",
            }, { status: 401 });
        }

        const body = await req.json();
        // console.log("Request Body:", body);
        // Validation
        const validateResult = communitySchema.safeParse(body);
        if(!validateResult.success){
            return NextResponse.json(
                {error: validateResult.error.errors}, 
                { status: 400 });
        }       
        
        const { name , description } = validateResult.data;
        console.log("Validated Data:", validateResult.data);
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
            description,
            // imageUrl: image,
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