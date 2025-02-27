import { connectToDatabase } from "@/lib/mongodb";

// instrumentation.ts
export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    try {
      await connectToDatabase();
      console.log("Database connected during instrumentation");
    } catch (error) {
      console.error(
        "Failed to connect to database during instrumentation:",
        error
      );
    }
  }
}
