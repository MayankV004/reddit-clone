import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { requireAuth } from "@/lib/session";
import { getPopularPosts, getRecentPosts } from "@/app/actions/postActions";


const postSchema = z.object({
  title: z.string().min(3).max(100),
  content: z.string().min(3).max(5000),
});

export async function GET(req: Request) {
  try {

    const url = new URL(req.url); 
    const sort = url.searchParams.get("sort") || "recent"

    let posts;
    if (sort === "votes") {
      // orderBy = {
      //   votes: {
      //     _count: "desc",
      //   },
      // };
      posts = await getPopularPosts()
    } else {
      // orderBy = {
      //   createdAt: "desc",
      // };
      posts = await getRecentPosts();
    }



    // const posts = await prisma.post.findMany({
    //   orderBy,
    //   include: {
    //     community: {
    //       select: {
    //         name: true,
    //         slug: true,
    //         id: true,
    //       },
    //     },
    //     user: {
    //       select: {
    //         username: true,
    //         image: true,
    //         id: true,
    //       },
    //     },
    //     votes: true,
    //     _count: {
    //       select: {
    //         comments: true,
    //         votes: true,
    //       },
    //     },
    //   },
    // });
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
    const user = await requireAuth()

    const userId = user.id;
   
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
