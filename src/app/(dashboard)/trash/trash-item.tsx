"use client";

import { useRouter } from "next/navigation";
import { Trash2, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { restoreSnippet, permanentDeleteSnippet } from "@/lib/actions";

interface TrashItemProps {
  id: string;
  title: string;
  categoryName: string;
}

export function TrashItem({ id, title, categoryName }: TrashItemProps) {
  const router = useRouter();

  async function handleRestore() {
    await restoreSnippet(id);
    router.refresh();
  }

  async function handlePermanentDelete() {
    if (confirm("Permanently delete this snippet? This cannot be undone.")) {
      await permanentDeleteSnippet(id);
      router.refresh();
    }
  }

  return (
    <div className="flex items-center justify-between rounded-lg border border-border bg-card px-4 py-3">
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-neutral-900 truncate dark:text-neutral-50">
          {title}
        </p>
        <p className="text-xs text-neutral-400">{categoryName}</p>
      </div>
      <div className="flex items-center gap-2 ml-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleRestore}
          className="gap-1 text-xs"
        >
          <RotateCcw className="h-3 w-3" />
          Restore
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={handlePermanentDelete}
          className="gap-1 text-xs text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950"
        >
          <Trash2 className="h-3 w-3" />
          Delete
        </Button>
      </div>
    </div>
  );
}
