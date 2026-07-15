import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { SearchBar } from "@/components/dashboard/search-bar";
import { CreateSnippetDialog } from "@/components/snippets/create-snippet-dialog";
import { SnippetCard } from "@/components/snippets/snippet-card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface DashboardPageProps {
  searchParams: Promise<{ q?: string; scope?: string }>;
}

export default async function DashboardPage({ searchParams }: DashboardPageProps) {
  const session = await auth.api.getSession({ headers: await headers() });
  const userId = session?.user?.id;
  if (!userId) return null;

  const params = await searchParams;
  const query = typeof params.q === "string" ? params.q.trim() : "";
  const scope = typeof params.scope === "string" ? params.scope : "title";

  const [snippets, categories] = await Promise.all([
    db.snippet.findMany({
      where: { userId, isDeleted: false },
      include: {
        category: { select: { id: true, name: true } },
        tags: { include: { tag: true } },
      },
      orderBy: { updatedAt: "desc" },
    }),
    db.category.findMany({
      where: { userId },
      orderBy: { createdAt: "asc" },
    }),
  ]);

  const filteredSnippets = snippets.filter((snippet) => {
    if (!query) return true;

    const searchText = query.toLowerCase();
    if (scope === "content") {
      return snippet.content.toLowerCase().includes(searchText);
    }

    if (scope === "tags") {
      return snippet.tags.some((entry) =>
        entry.tag.name.toLowerCase().includes(searchText)
      );
    }

    return snippet.title.toLowerCase().includes(searchText);
  });

  return (
    <div className="p-6">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-lg font-semibold text-neutral-900 dark:text-neutral-50">
            Workspace
          </h1>
          <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
            Keep your best text close.
          </p>
        </div>
        <CreateSnippetDialog
          categories={categories.map((category) => ({
            id: category.id,
            name: category.name,
          }))}
        >
          <Button variant="outline" className="gap-2">
            <Plus className="h-4 w-4" />
            New snippet
          </Button>
        </CreateSnippetDialog>
      </div>

      <div className="mb-6">
        <SearchBar />
      </div>

      {filteredSnippets.length === 0 ? (
        <div className="mt-16 text-center">
          <p className="text-sm text-neutral-400">
            No snippets yet. Create your first one!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {filteredSnippets.map((snippet) => (
            <SnippetCard
              key={snippet.id}
              id={snippet.id}
              title={snippet.title}
              content={snippet.content}
              categoryName={snippet.category.name}
              categoryId={snippet.category.id}
              categories={categories.map((category) => ({
                id: category.id,
                name: category.name,
              }))}
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
