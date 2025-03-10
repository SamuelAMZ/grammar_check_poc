// import { connectToDatabase } from "../../../../lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import { connectToDatabase } from "../../../../lib/mongodb";

export async function POST(req) {
  const { email, password } = await req.json();

  await connectToDatabase();
  const existingUser = await User.findOne({ email });
  if (existingUser)
    return Response.json({ error: "Email already in use" }, { status: 400 });

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = new User({ email, password: hashedPassword });

  await newUser.save();
  return Response.json({ message: "User registered successfully" });
}
