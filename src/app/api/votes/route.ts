import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/session";
import { z } from "zod";

// Improved schema with proper validation
const voteSchema = z.object({
  postId: z.string().optional(),
  commentId: z.string().optional(),
  value: z.number().min(-1).max(1).int(),
}).refine(
  data => (!!data.postId && !data.commentId) || (!data.postId && !!data.commentId),
  { message: "Exactly one of postId or commentId must be provided" }
);

export async function POST(req: Request) {
  try {
    // Get authenticated user
    const user = await requireAuth();
    const userId = user.id;

    // Parse and validate request body
    const body = await req.json();
    const validateResult = voteSchema.safeParse(body);
    
    if (!validateResult.success) {
      return NextResponse.json(
        { error: validateResult.error.errors },
        { status: 400 }
      );
    }
    
    const { postId, commentId, value } = validateResult.data;

    // Determine if we're voting on a post or comment
    if (postId) {
      return handlePostVote(userId, postId, value);
    } else {
      return handleCommentVote(userId, commentId!, value);
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

async function handlePostVote(userId: string, postId: string, value: number) {
  // Check if post exists
  const post = await prisma.post.findUnique({
    where: { id: postId }
  });
  
  if (!post) {
    return NextResponse.json({ error: "Post not found" }, { status: 404 });
  }

  // Find existing vote
  const existingVote = await prisma.vote.findUnique({
    where: {
      userId_postId: { userId, postId }
    }
  });

  // Process the vote based on value and existing vote
  if (value === 0) {
    // Remove vote if it exists
    if (existingVote) {
      await prisma.vote.delete({
        where: {
          userId_postId: { userId, postId }
        }
      });
      return NextResponse.json({ message: "Vote removed" }, { status: 200 });
    }
    return NextResponse.json({ message: "No vote to remove" }, { status: 200 });
  } else if (existingVote) {
    // Update existing vote if value is different
    if (existingVote.value !== value) {
      const updatedVote = await prisma.vote.update({
        where: {
          userId_postId: { userId, postId }
        },
        data: { value }
      });
      return NextResponse.json(updatedVote, { status: 200 });
    }
    return NextResponse.json(existingVote, { status: 200 });
  } else {
    // Create new vote
    const newVote = await prisma.vote.create({
      data: {
        value,
        user: { connect: { id: userId } },
        post: { connect: { id: postId } }
      }
    });
    return NextResponse.json(newVote, { status: 201 });
  }
}

async function handleCommentVote(userId: string, commentId: string, value: number) {
  // Check if comment exists
  const comment = await prisma.comment.findUnique({
    where: { id: commentId }
  });
  
  if (!comment) {
    return NextResponse.json({ error: "Comment not found" }, { status: 404 });
  }

  // Find existing vote
  const existingVote = await prisma.vote.findUnique({
    where: {
      userId_commentId: { userId, commentId }
    }
  });

  // Process the vote based on value and existing vote
  if (value === 0) {
    // Remove vote if it exists
    if (existingVote) {
      await prisma.vote.delete({
        where: {
          userId_commentId: { userId, commentId }
        }
      });
      return NextResponse.json({ message: "Vote removed" }, { status: 200 });
    }
    return NextResponse.json({ message: "No vote to remove" }, { status: 200 });
  } else if (existingVote) {
    // Update existing vote if value is different
    if (existingVote.value !== value) {
      const updatedVote = await prisma.vote.update({
        where: {
          userId_commentId: { userId, commentId }
        },
        data: { value }
      });
      return NextResponse.json(updatedVote, { status: 200 });
    }
    return NextResponse.json(existingVote, { status: 200 });
  } else {
    // Create new vote
    const newVote = await prisma.vote.create({
      data: {
        value,
        user: { connect: { id: userId } },
        comment: { connect: { id: commentId } }
      }
    });
    return NextResponse.json(newVote, { status: 201 });
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

    // Find the vote
    let vote;
    if (postId) {
      vote = await prisma.vote.findUnique({
        where: {
          userId_postId: { userId, postId }
        }
      });
    } else {
      if (!commentId) {
        return NextResponse.json(
          { error: "commentId must be provided" },
          { status: 400 }
        );
      }
      vote = await prisma.vote.findUnique({
        where: {
          userId_commentId: { userId, commentId }
        }
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