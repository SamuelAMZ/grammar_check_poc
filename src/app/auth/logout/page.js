"use client";

import { toast } from "sonner";
import { useState } from "react";
import { signOut } from "next-auth/react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { ButtonLoading } from "@/components/ui/loadingButton";

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);

  // Handle form submission
  const handleLogout = async () => {
    setIsLoading(true);

    try {
      signOut();
      toast("Logout successfully");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen flex items-center justify-center">
      <Card className="sm:col-span-2" x-chunk="dashboard-05-chunk-0">
        <CardHeader className="pb-3 text-center">
          <CardTitle>Are you absolutely sure?</CardTitle>
          <CardDescription className="text-balance max-w-lg leading-relaxed">
            This action cannot be undone. Logging out will end your current
            session.
          </CardDescription>
        </CardHeader>
        <CardFooter className="flex gap-4 justify-center mt-4">
          <Button asChild variant="outline">
            <Link href="/">Cancel</Link>
          </Button>
          {isLoading ? (
            <ButtonLoading />
          ) : (
            <Button onClick={handleLogout}>Continue</Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
