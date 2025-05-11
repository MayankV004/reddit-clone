import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { z } from "zod";
import { connect } from "http2";

const postSchema = z.object({
  title: z.string().min(3).max(100),
  content: z.string().min(3).max(5000),
});

export async function GET() {
  try {
    const posts = await prisma.post.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        community: {
          select: {
            name: true,
            slug: true,
            id: true,
          },
        },
        votes: true,
        _count: {
          select: {
            comments: true,
            votes: true,
          },
        },
      },
    });
    return NextResponse.json(posts, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch posts" },
      { status: 500 }
    );
  }
}

//post Creation
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    // checking session
    if (!session || !session.user || !session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session?.user.id;
   
    const body = await req.json();

    // validation
    const validateResult = postSchema.safeParse(body);
    if (!validateResult.success) {
      return NextResponse.json(
        { error: validateResult.error.errors },
        { status: 400 }
      );
    }
    const { title, content  } = validateResult.data;
    const slugText = title.toLowerCase().replace(/\s+/g, "-");
    const randomSuffix = Math.random().toString(36).substring(2, 7);
    const uniqueSlug = `${slugText}-${randomSuffix}`;

    // creating post

    const post = await prisma.post.create({
      data: {
        title,
        content,
        slug: uniqueSlug,
        community: {
          connect: {
            id: body.communityId,
          },
        },
       user:{
        connect:{
            id: userId,
        }
       }
        
      },
    });

    return NextResponse.json(post, { status: 201 });
  } catch (error) {
    console.error("Error in creating post", error);
    return NextResponse.json(
      { error: "Failed to create post" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
