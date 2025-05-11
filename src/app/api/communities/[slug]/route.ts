import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

interface Params {
  params: {
    slug: string;
  };
}

export async function GET(req: Request, { params }: Params) {
  const { slug } = params;
  try {
    const community = await prisma.community.findUnique({
      where: {
        slug,
      },
      include: {
        posts: {
          orderBy: {
            createdAt: "desc",
          },
          include: {
            votes: true,
            _count: {
              select: {
                comments: true,
                votes: true,
              },
            },
          },
        },
      },
    });
    if (!community) {
      return NextResponse.json(
        {
          error: "Community Not Found",
        },
        {
          status: 404,
        }
      );
    }
    return NextResponse.json(community);
  } catch (error) {
    console.error(
      "failed to fetch community in api/community/[slug]/route  ",
      error
    );
    return NextResponse.json(
      { error: "Failed to fetch community" },
      { status: 500 }
    );
  }finally{
    await prisma.$disconnect();
  }
}
