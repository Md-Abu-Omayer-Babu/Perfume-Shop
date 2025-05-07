import { NextRequest, NextResponse } from "next/server";
import { hash } from "bcrypt";
import { connectToDatabase } from "@/lib/mongodb/mongodb";
import UserModel from "@/models/user.model";

export async function POST(req: NextRequest) {
  try {
    const { name, email, password } = await req.json();

    // Validate input
    if (!name || !email || !password) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { message: "Password must be at least 6 characters long" },
        { status: 400 }
      );
    }

    // Connect to database
    await connectToDatabase();

    // Check if user already exists
    const existingUser = await UserModel.findOne({ email });

    if (existingUser) {
      return NextResponse.json(
        { message: "User with this email already exists" },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await hash(password, 12);

    // Create user
    const newUser = await UserModel.create({
      name,
      email,
      password: hashedPassword,
      role: "user",
    });

    // Return success without sending the password
    const user = {
      id: newUser._id.toString(),
      name: newUser.name,
      email: newUser.email,
    };

    return NextResponse.json(
      { message: "User registered successfully", user },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Registration error:", error.message);
    return NextResponse.json(
      { message: "Error registering user" },
      { status: 500 }
    );
  }
}