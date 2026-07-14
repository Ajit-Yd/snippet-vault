import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { LogoutButton } from "@/components/layout/logout-button";

export async function DashboardHeader() {
  const session = await auth.api.getSession({ headers: await headers() });

  return (
    <header className="flex items-center justify-end gap-3 border-b border-neutral-200 px-6 py-3 dark:border-neutral-800">
      <ThemeToggle />
      <div className="flex items-center gap-2">
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-neutral-200 text-xs font-medium text-neutral-600 dark:bg-neutral-700 dark:text-neutral-300">
          {session?.user?.name?.charAt(0)?.toUpperCase() || "U"}
        </span>
        <span className="hidden text-sm text-neutral-600 dark:text-neutral-300 sm:inline">
          {session?.user?.name || session?.user?.email}
        </span>
        <LogoutButton />
      </div>
    </header>
  );
}