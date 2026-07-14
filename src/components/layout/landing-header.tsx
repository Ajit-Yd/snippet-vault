"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/layout/theme-toggle";

export function LandingHeader() {
  return (
    <header className="flex items-center justify-between px-6 py-4">
      <span className="text-sm font-semibold text-neutral-900 dark:text-neutral-50">
        Snippet Vault
      </span>
      <div className="flex items-center gap-2">
        <ThemeToggle />
        <Link href="/login">
          <Button variant="ghost">Log in</Button>
        </Link>
        <Link href="/signup">
          <Button>Sign up</Button>
        </Link>
      </div>
    </header>
  );
}