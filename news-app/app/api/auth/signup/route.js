"use server";

import { NextResponse, NextRequest } from "next/server";
import mongoose from "mongoose";
import User from "../../../../models/users.js";

import bcrypt from "bcryptjs";
import { signUpSchema } from "../../../../lib/zod.js";

export async function POST(req, res) {
  if (req.method !== "POST") {
    return NextResponse.json({ message: "Method not allowed" });
  }

  const { username, email, password } = await req.json();
  console.log("Request coming:", { username, email, password });

  let validation = signUpSchema.safeParse({
    username,
    email,
    password,
  });

  if (!validation.success) {
    const error = validation.error.format();
    let errorMessage = "";
    if (error.username) {
      errorMessage = error.username._errors[0];
    } else if (error.email) {
      errorMessage = error.email._errors[0];
    } else if (error.password) {
      errorMessage = error.password._errors[0];
    }

    return NextResponse.json({ success: false, message: errorMessage });
  }

  // const client = await clientPromise;
  // const db = client;
  const db = await mongoose.connect(process.env.MONGODB_URI);
  if (db) {
    console.log("Connected to MongoDB");
  } else {
    console.log("Failed to connect to MongoDB");
  }

  const existingUsername = await User.findOne({
    username: username.toLowerCase(),
  });

  if (existingUsername) {
    return NextResponse.json({
      success: false,
      message: "Username already exists",
    });
  }

  const existingUser = await User.findOne({
    email: email.toLowerCase(),
  });

  if (existingUser) {
    return NextResponse.json({
      success: false,
      message: "Email already exists",
    });
  }

  const hashedPassword = bcrypt.hashSync(password, 12);

  const user = await User.create({
    username: username.toLowerCase(),
    email: email.toLowerCase(),
    password: hashedPassword,
  });

  return NextResponse.json({
    success: true,
    message: "User created successfully",
    userId: user._id,
  });
}

export async function GET(req, res) {
  console.log("I am getting called!");
  // return res.status(200).json({ message: "Hello from Next.js!" });
  return NextResponse.json({ message: "Hello from Next.js!" });
}
