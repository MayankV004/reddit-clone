import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/session";
import { z } from "zod";

const commentSchema = z.object({
    postId: z.string(),
    text: z.string().min(3).max(5000),
    parentId: z.string().optional(),
})

export async function POST(req : Request)
{
    try{
       const user = await requireAuth();

        const userId = user.id;
        const body = await req.json();

        //Valication
        const validateResult = commentSchema.safeParse(body);
        if(!validateResult.success)
        {
            return NextResponse.json({error :" Invalid Data"}, {status : 422});
        }

        const {postId, text, parentId} = validateResult.data;
        // Checking if post Exists
        const post = await prisma.post.findUnique({
            where : {
                id : postId
            }
        });

        if(!post)
        {
            return NextResponse.json({error : "Post Not Found"} , {status : 404});
        }
        if(parentId)
        {
            const parentComment = await prisma.comment.findUnique({
                where : {
                    id : parentId
                }
            })

            if(!parentComment)
            {
                return NextResponse.json({error : "Parent Comment Not Found"} , {status : 404});
            }
        }

        // create Comment
        const comment = await prisma.comment.create({
            data:{
                text,
                user:{
                    connect:{
                        id:userId
                    }
                },
                post:{
                    connect:{
                        id:postId
                    }
                },
                ...(parentId && {
                    parent:{
                        connect:{
                            id:parentId
                        }
                    }
                }),

            },
            include:{
                user:{
                    select:{
                        id:true,
                        username:true,
                        image:true
                    }
                },
                votes:true,
                _count:{
                    select:{
                        children:true
                    }
                }
            }

        })
        return NextResponse.json(comment, {status : 201});
    }catch(error){
        console.log("[COMMENT_POST]", error);
        return NextResponse.json({error : "Internal Server Error"}, {status : 500});
    }finally{
        await prisma.$disconnect();
    }
}

export async function GET(req : Request)
{   
    try {

       const url = new URL(req.url);

        const postId = url.searchParams.get("postId");
        const parentId = url.searchParams.get("parentId");

        if(!postId && !parentId)
        {
            return NextResponse.json({error : "Either postId or parentId is required"}, {status : 400});
        }

        const comments = await prisma.comment.findMany({
            where: {
                
                ...(postId && {postId}),
                ...(parentId && {parentId}),
            },
            include: {
                user:{
                    select:{
                        id:true,
                        username:true,
                        image:true
                    }
                },
                votes: true,
                _count: {
                    select: {
                        children: true
                    }
                },
                
            },
            orderBy: {
                    createdAt: "desc"
                }
        })

        return NextResponse.json(comments, { status: 200 });
    } catch (error) {
        console.log("[COMMENT_GET]", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
        
    }
    finally{
        await prisma.$disconnect();
    }

}