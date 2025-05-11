import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { nanoid } from "nanoid";
import bcrypt from "bcrypt";

export async function POST(req: NextRequest) {
  try {
    const { username, email, password } = await req.json();

    // Validation
    if (!username || !email || !password) {
      return NextResponse.json({ error: "Missing Fields" }, { status: 400 });
    }

    //check if user exists
    // By email
    const isExistUserByEmail = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (isExistUserByEmail) {
      return NextResponse.json(
        { error: "Email already in use" },
        { status: 409 }
      );
    }
    // By username

    const isExistUserByUsername = await prisma.user.findUnique({
      where: {
        username,
      },
    });

    if (isExistUserByUsername) {
      return NextResponse.json(
        { error: "Username already in use" },
        { status: 409 }
      );
    }

    // if Nothing above is true then we hashpassword and Create User

    //Hash
    const hashPassword = await bcrypt.hash(password, 10);

    //Create User

    const user = await prisma.user.create({
      data: {
        id: nanoid(),
        username,
        email,
        password: hashPassword,
      },
    });

    // removeing password from Response to protect sensitive info going to frontend

    const { password: _, ...userWithoutPassword } = user;

    return NextResponse.json(
      {
        user: userWithoutPassword,
        message: "User Created Successfully",
      },
      { status: 201 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Something went Wrong" },
      { status: 500 }
    );
  }
}
