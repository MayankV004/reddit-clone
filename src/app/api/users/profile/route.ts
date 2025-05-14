import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/session";

export async function PATCH(req: NextRequest) {
  try {

   const user  = await requireAuth()
    
    const userId = user.id;
    const { name, username, email, image } = await req.json();
    
    // Validate the data
    if (!username) {
      return NextResponse.json(
        { message: "Username is required" },
        { status: 400 }
      );
    }
    
    // Check if username is taken (only if it's different from current username)
    if (username !== user.username) {
      const existingUser = await prisma.user.findUnique({
        where: { username },
      });
      
      if (existingUser) {
        return NextResponse.json(
          { message: "Username is already taken" },
          { status: 409 }
        );
      }
    }
    
    // Check if email is taken (only if provided and different from current email)
    if (email && email !== user.email) {
      const existingUser = await prisma.user.findUnique({
        where: { email },
      });
      
      if (existingUser) {
        return NextResponse.json(
          { message: "Email is already taken" },
          { status: 409 }
        );
      }
    }
    
    // Update user profile in the database
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        name,
        username,
        email,
        image,
      },
    });
    
    return NextResponse.json({
      message: "Profile updated successfully",
      user: {
        id: updatedUser.id,
        name: updatedUser.name,
        username: updatedUser.username,
        email: updatedUser.email,
        image: updatedUser.image,
      }
    });
    
  } catch (error) {
    console.error("Error updating profile:", error);
    return NextResponse.json(
      { message: "An error occurred while updating your profile" },
      { status: 500 }
    );
  }
}