import { NextResponse } from "next/server";
import User from "../../../../models/users"; // Use @ alias instead of relative paths
import ResetToken from "../../../../models/ResetToken";
import dbConnect from "../../../../lib/mongodb";
import { sendEmail } from "../../../../lib/mail";
import crypto from "crypto";

export async function POST(req) {
  try {
    await dbConnect();
    const { email } = await req.json();

    const user = await User.findOne({ email: email.toLowerCase() });

    // Generate token even if user doesn't exist (security through obscurity)
    const resetToken = crypto.randomBytes(32).toString("hex");

    if (user) {
      // Delete any existing tokens for this user
      await ResetToken.deleteMany({ userId: user._id });

      // Create new reset token
      await ResetToken.create({
        userId: user._id,
        token: resetToken,
      });

      // Create reset URL
      const resetUrl = `${process.env.NEXTAUTH_URL}/reset-password?token=${resetToken}`;

      // Send email
      await sendEmail({
        to: user.email,
        subject: "Password Reset Request",
        html: `
          <h1>Password Reset</h1>
          <p>You requested a password reset for your account.</p>
          <p>Click <a href="${resetUrl}">here</a> to reset your password.</p>
          <p>If you didn't request this, please ignore this email.</p>
          <p>This link will expire in 1 hour.</p>
        `,
      });
    }

    // Always return success (don't reveal if email exists)
    return NextResponse.json({
      message:
        "If an account exists with this email, you will receive password reset instructions.",
    });
  } catch (error) {
    console.error("Password reset error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
