import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { SnippetCard } from "@/components/snippets/snippet-card";
export const dynamic = "force-dynamic";

export default async function FavoritesPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  const userId = session?.user?.id;
  if (!userId) return null;

  const snippets = await db.snippet.findMany({
    where: { userId, isDeleted: false, isFavorite: true },
    include: {
      category: { select: { id: true, name: true } },
      tags: { include: { tag: true } },
    },
    orderBy: { updatedAt: "desc" },
  });

  return (
    <div className="p-6">
      <h1 className="mb-6 text-lg font-semibold text-neutral-900 dark:text-neutral-50">
        Favorites
      </h1>
      {snippets.length === 0 ? (
        <p className="mt-16 text-center text-sm text-neutral-400">
          No favorites yet. Star a snippet to see it here.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {snippets.map((snippet) => (
            <SnippetCard
              key={snippet.id}
              id={snippet.id}
              title={snippet.title}
              content={snippet.content}
              categoryName={snippet.category.name}
              tags={snippet.tags}
              isFavorite={snippet.isFavorite}
              createdAt={snippet.createdAt}
              updatedAt={snippet.updatedAt}
            />
          ))}
        </div>
      )}
    </div>
  );
}
