"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import axios from "axios";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ButtonLoading } from "@/components/ui/loadingButton";

const registrationSchema = z.object({
  name: z.string().min(1, "Username is required"),
  email: z.string().email("Invalid email address").min(1, "Email is required"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters long")
    .min(1, "Password is required"),
});

export default function RegisterPage() {
  const router = useRouter();
  const [isHidden, setIsHidden] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registrationSchema),
  });

  // Handle form submission for register
  const handleRegister = async (data) => {
    setIsLoading(true);

    try {
      const res = await axios.post("/api/auth/register", data, {
        headers: { "Content-Type": "application/json" },
      });

      // console.log(res, "res");
      if (res.status === 200 || res.statusText === "OK") {
        toast("Register successfully");
        router.push("/auth/login");
      }
    } catch (error) {
      // console.log(error, "error");
      const errorMessage =
        error.response?.data?.message || "Uh oh! Something went wrong.";
      toast(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen flex items-center justify-center">
      <Card className="mx-auto max-w-md">
        <CardHeader>
          <CardTitle className="text-xl">Sign Up</CardTitle>
          <CardDescription>
            Enter your information to create an account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(handleRegister)}>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="username">Username</Label>
                <Input id="username" placeholder="Max" {...register("name")} />
                {errors.name && (
                  <p className="text-red-500 text-sm">{errors.name.message}</p>
                )}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  {...register("email")}
                />
                {errors.email && (
                  <p className="text-red-500 text-sm">{errors.email.message}</p>
                )}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={isHidden ? "password" : "text"}
                    placeholder="******"
                    {...register("password")}
                  />
                  {isHidden ? (
                    <AiOutlineEyeInvisible
                      className="absolute right-3 top-[10px] cursor-pointer text-black dark:text-white"
                      onClick={() => setIsHidden(!isHidden)}
                    />
                  ) : (
                    <AiOutlineEye
                      className="absolute right-3 top-[10px] cursor-pointer text-black dark:text-white"
                      onClick={() => setIsHidden(!isHidden)}
                    />
                  )}
                </div>
                {errors.password && (
                  <p className="text-red-500 text-sm">
                    {errors.password.message}
                  </p>
                )}
              </div>

              {isLoading ? (
                <ButtonLoading />
              ) : (
                <Button type="submit" className="w-full">
                  Create an account
                </Button>
              )}
            </div>
          </form>
          <div className="mt-4 text-center text-sm">
            Already have an account?{" "}
            <Link href="/auth/login" className="underline">
              Sign in
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
