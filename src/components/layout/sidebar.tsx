import Link from "next/link";
import { NavItem } from "./nav-item";
import {
  LayoutGrid,
  Heart,
  Clock,
  List,
  FileText,
  Trash2,
  Bookmark,
  LogOut,
} from "@/components/icons/client-icons";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function Sidebar() {
  const session = await auth.api.getSession({ headers: await headers() });
  const userId = session?.user?.id;

  // categories removed: not rendering user categories in the sidebar

  return (
    <aside className="flex h-full flex-col border-r border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-950">
      <div className="flex items-center gap-2 border-b border-neutral-200 px-4 py-4 dark:border-neutral-800">
        <Bookmark className="h-5 w-5 text-neutral-900 dark:text-neutral-50" />
        <span className="text-sm font-semibold text-neutral-900 dark:text-neutral-50">
          Snippet Vault
        </span>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto p-3">
        <NavItem href="/dashboard" icon={<LayoutGrid className="h-4 w-4" />} label="All Snippets" />
        <NavItem href="/favorites" icon={<Heart className="h-4 w-4" />} label="Favorites" />
        <NavItem href="/recent" icon={<Clock className="h-4 w-4" />} label="Recent" />
        <NavItem href="/index" icon={<List className="h-4 w-4" />} label="Index" />
        <NavItem href="/notepad" icon={<FileText className="h-4 w-4" />} label="Notepad" />
        <NavItem href="/trash" icon={<Trash2 className="h-4 w-4" />} label="Trash" />

        {/* categories intentionally omitted */}
      </nav>
    </aside>
  );
}
