import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const pathname = req.nextUrl.pathname;
    const slug = pathname.split('/').pop();
    
    if (!slug) {
      return NextResponse.json(
        { error: "Invalid slug parameter" },
        { status: 400 }
      );
    }
    
    const post = await prisma.post.findUnique({
      where: {
        slug,
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            image: true,
          },
        },
        community: {
          select: {
            id: true,
            name: true,
            slug: true,
            imageUrl: true,
          },
        },
        comments: {
          where: {
            parentId: null,
          },
          include: {
            user: {
              select: {
                id: true,
                username: true,
                image: true,
              },
            },
            votes: true,
            _count: {
              select: {
                children: true,
              },
            },
          },
          orderBy: {
            createdAt: "desc",
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
    
    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }
    
    return NextResponse.json(post, { status: 200 });
  } catch (error) {
    console.error("Error fetching post:", error);
    return NextResponse.json(
      { error: "Failed to fetch post" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}