"use client";

import { CopyButton } from "./copy-button";
import { FavoriteButton } from "./favorite-button";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { timeAgo, truncate } from "@/lib/utils";
import { softDeleteSnippet } from "@/lib/actions";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Pencil, Trash2 } from "lucide-react";
import { CreateSnippetDialog } from "./create-snippet-dialog";

interface SnippetCardProps {
  id: string;
  title: string;
  content: string;
  categoryName: string;
  categoryId?: string;
  categories?: { id: string; name: string }[];
  tags: { tag: { id: string; name: string } }[];
  isFavorite: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export function SnippetCard({
  id,
  title,
  content,
  categoryName,
  categoryId,
  categories = [],
  tags,
  isFavorite,
  updatedAt,
}: SnippetCardProps) {
  const router = useRouter();
  const tagText = tags.map((entry) => entry.tag.name).join(", ");

  async function handleDelete() {
    await softDeleteSnippet(id);
    router.refresh();
  }
  return (
    <div className="group relative flex flex-col rounded-lg border border-border bg-card p-4 transition-shadow hover:shadow-sm">
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs text-neutral-400 dark:text-neutral-500">
              {categoryName}
            </span>
            <span className="text-xs text-neutral-300">·</span>
            <span className="text-xs text-neutral-400 dark:text-neutral-500">
              {timeAgo(updatedAt)}
            </span>
          </div>
          <h3 className="text-sm font-medium text-neutral-900 truncate dark:text-neutral-50">
            {title}
          </h3>
        </div>
        <div className="flex items-center gap-0.5 shrink-0">
          <CreateSnippetDialog
            categories={categories}
            editData={{
              id,
              title,
              content,
              categoryId: categoryId ?? "",
              tags: tagText,
            }}
          >
            <Button variant="ghost" size="icon-sm" title="Edit snippet">
              <Pencil className="h-3.5 w-3.5" />
            </Button>
          </CreateSnippetDialog>
          <Button
            variant="ghost"
            size="icon-sm"
            title="Delete snippet"
            onClick={handleDelete}
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
          <FavoriteButton snippetId={id} isFavorite={isFavorite} />
          <CopyButton content={content} />
        </div>
      </div>
      <p className="mt-2 text-sm text-neutral-500 line-clamp-2 dark:text-neutral-400">
        {truncate(content, 120)}
      </p>
      {tags.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1">
          {tags.map((st) => (
            <Link
              key={st.tag.id}
              href={`/?tag=${encodeURIComponent(st.tag.name)}`}
            >
              <Badge
                variant="secondary"
                className="text-xs font-normal cursor-pointer hover:bg-neutral-200 dark:hover:bg-neutral-700"
              >
                {st.tag.name}
              </Badge>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
