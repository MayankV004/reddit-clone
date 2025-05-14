import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { z } from "zod";
import { requireAuth } from "@/lib/session";
const voteSchema = z
  .object({
    postId: z.string(),
    value: z.number().min(-1).max(1),
    commentId: z.string().optional(),
  })
  .refine(
    (data) => {
      return (
        (!!data.postId && !data.commentId) || (!data.postId && !!data.commentId)
      );
    },
    { message: "Either postId or commentId must be provided" }
  );

export async function POST(req: Request) {
  try {
   const user = await requireAuth();
    const userId = user.id;
    const body = await req.json();
    // Validation
    const validateResult = voteSchema.safeParse(body);
    if (!validateResult.success) {
      return NextResponse.json(
        { error: validateResult.error.errors },
        { status: 400 }
      );
    }
    const { postId, value, commentId } = validateResult.data;

    if (postId) {
      const post = await prisma.post.findUnique({
        where: {
          id: postId,
        },
      });
      if (!post) {
        return NextResponse.json({ error: "Post not found" }, { status: 404 });
      }
    }

    const existingVote = await prisma.vote.findUnique({
      where: {
        userId_postId: {
          userId,
          postId,
        },
      },
    });

    if (value === 0) {
      // Remove Vote
      if (existingVote) {
        await prisma.vote.delete({
          where: {
            userId_postId: {
              userId,
              postId,
            },
          },
        });
        return NextResponse.json({ message: "Vote Removed" }, { status: 200 });
      }
    } else if (existingVote && existingVote.value !== value) {
      // Update Vote
      const updatedVote = await prisma.vote.update({
        where: {
          userId_postId: {
            userId,
            postId,
          },
        },
        data: {
          value: value - 1,
        },
      });
      return NextResponse.json(updatedVote, { status: 200 });
    } else {
      // create Vote
      const vote = await prisma.vote.create({
        data: {
          value,
          user: {
            connect: {
              id: userId,
            },
          },
          post: {
            connect: {
              id: postId,
            },
          },
        },
      });
      return NextResponse.json(vote, { status: 200 });
    }
  } catch (error) {
    console.error("Error handling vote:", error);
    return NextResponse.json(
      { error: "Failed to process vote" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

export async function GET(req: Request) {
  try {
    const user = await requireAuth();

    const userId = user.id;
    const url = new URL(req.url);
    const postId = url.searchParams.get("postId");
    const commentId = url.searchParams.get("commentId");

    if (!postId && !commentId) {
      return NextResponse.json(
        { error: "Either postId or commentId must be provided" },
        { status: 400 }
      );
    }

    let vote;

    if (postId) {
      vote = await prisma.vote.findUnique({
        where: {
          userId_postId: {
            userId,
            postId,
          },
        },
      });
    } else if (commentId) {
      vote = await prisma.vote.findUnique({
        where: {
          userId_commentId: {
            userId,
            commentId,
          },
        },
      });
    }

    return NextResponse.json(vote || { value: 0 }, { status: 200 });
  } catch (error) {
    console.error("Error fetching vote:", error);
    return NextResponse.json(
      { error: "Failed to fetch vote" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
