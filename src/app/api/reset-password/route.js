import User from "@/models/User";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { connectToDatabase } from "../../../../lib/mongodb";

export async function POST(req) {
  const { email, newPassword } = await req.json();

  if (!email || !newPassword) {
    return NextResponse.json(
      { message: "Email and password are required" },
      { status: 400 }
    );
  }

  try {
    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update user password in the database
    await connectToDatabase();
    await User.findOneAndUpdate({ email }, { password: hashedPassword });

    return NextResponse.json({
      message: "Password reset successful",
    });
  } catch (error) {
    console.error("Password reset error:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
