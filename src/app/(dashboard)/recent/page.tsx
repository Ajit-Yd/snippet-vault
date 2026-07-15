import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { SnippetCard } from "@/components/snippets/snippet-card";
export const dynamic = "force-dynamic";

export default async function RecentPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  const userId = session?.user?.id;
  if (!userId) return null;

  const snippets = await db.snippet.findMany({
    where: { userId, isDeleted: false },
    include: {
      category: { select: { id: true, name: true } },
      tags: { include: { tag: true } },
    },
    orderBy: { updatedAt: "desc" },
    take: 20,
  });

  return (
    <div className="p-6">
      <h1 className="mb-6 text-lg font-semibold text-neutral-900 dark:text-neutral-50">
        Recent
      </h1>
      {snippets.length === 0 ? (
        <p className="mt-16 text-center text-sm text-neutral-400">
          No snippets yet.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {snippets.map((snippet) => (
            <SnippetCard
              key={snippet.id}
              {...snippet}
              categoryName={snippet.category.name}
            />
          ))}
        </div>
      )}
    </div>
  );
}
