"use client";

import { useAuth } from "@/lib/AuthContext";
import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";

function Protected({ children }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && !user) {
      const encoded = encodeURIComponent(pathname);
      router.push(`/user/signin?returnUrl=${encoded}`);
    }
  }, [user, loading, pathname, router]);

  if (loading) {
    return (
      <div className="flex justify-center mt-10">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (!user) return null;

  return <>{children}</>;
}

export default function Layout({ children }) {
  return <Protected>{children}</Protected>;
}
