"use client";

import React, { useOptimistic } from "react";
import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import { toggleFavorite } from "@/lib/actions";

interface FavoriteButtonProps {
  snippetId: string;
  isFavorite: boolean;
}

export function FavoriteButton({ snippetId, isFavorite }: FavoriteButtonProps) {
  const [optimisticFav, setOptimisticFav] = useOptimistic(isFavorite);

  async function handleToggle() {
    React.startTransition(() => setOptimisticFav(!optimisticFav));
    await toggleFavorite(snippetId);
  }

  return (
    <button
      onClick={handleToggle}
      className={cn(
        "inline-flex items-center rounded-md p-1 transition-colors",
        optimisticFav
          ? "text-red-500 hover:bg-red-50 dark:hover:bg-red-950"
          : "text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700 dark:hover:bg-neutral-800 dark:hover:text-neutral-300"
      )}
      title={optimisticFav ? "Remove from favorites" : "Add to favorites"}
    >
      <Heart
        className={cn("h-3.5 w-3.5", optimisticFav && "fill-current")}
      />
    </button>
  );
}
