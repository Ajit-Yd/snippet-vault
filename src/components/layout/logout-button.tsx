"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { authClient } from "@/lib/auth-client";

export function LogoutButton() {
  const router = useRouter();

  async function handleLogout() {
    await authClient.signOut();
    router.push("/");
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      className="text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200"
      aria-label="Log out"
    >
      <LogOut className="h-4 w-4" />
    </button>
  );
}