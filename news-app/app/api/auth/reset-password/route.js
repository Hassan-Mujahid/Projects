import { NextResponse } from "next/server";
import dbConnect from "../../../../lib/mongodb";
import User from "../../../../models/users";
import ResetToken from "../../../../models/ResetToken";
import { saltAndHashPassword } from "../../../../utils/password";
import { sendEmail } from "../../../../lib/mail";
import mongoose from "mongoose";

export async function POST(req) {
  try {
    await dbConnect();
    const { token, password } = await req.json();

    // Find valid token
    const resetToken = await ResetToken.findOne({ token });

    if (!resetToken) {
      return NextResponse.json(
        { error: "Invalid or expired reset token" },
        { status: 400 }
      );
    }

    // Find user
    const user = await User.findById(resetToken.userId);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Hash new password
    const hashedPassword = await saltAndHashPassword(password);

    // Update user's password
    await User.findByIdAndUpdate(user._id, {
      password: hashedPassword,
    });

    // Delete used token
    await ResetToken.deleteOne({
      _id: new mongoose.Types.ObjectId(resetToken._id),
    });

    // Send confirmation email
    await sendEmail({
      to: user.email,
      subject: "Password Reset Successful",
      html: `
        <h1>Password Reset Successful</h1>
        <p>Your password has been successfully reset.</p>
        <p>If you didn't make this change, please contact support immediately.</p>
      `,
    });

    return NextResponse.json({
      message: "Password reset successful",
    });
  } catch (error) {
    console.error("Reset password error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
