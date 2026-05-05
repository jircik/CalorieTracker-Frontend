"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/store/auth";
import Landing from "./_landing/Landing";

export default function RootPage() {
  const router = useRouter();
  const { token, hydrated } = useAuth();

  useEffect(() => {
    if (hydrated && token) router.replace("/dashboard");
  }, [hydrated, token, router]);

  if (!hydrated || token) {
    return (
      <div className="flex min-h-screen items-center justify-center text-slate-500">
        Loading…
      </div>
    );
  }

  return <Landing />;
}
