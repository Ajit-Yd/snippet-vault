import Link from "next/link";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { getNumberedHeadings } from "@/lib/index-numbering";

export default async function IndexPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  const userId = session?.user?.id;
  if (!userId) return null;

  const headings = await getNumberedHeadings(userId);

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-lg font-semibold text-neutral-900 dark:text-neutral-50">
          Index
        </h1>
        <p className="text-sm text-neutral-500">
          Numbered overview of all categories and snippets
        </p>
      </div>
      {headings.length === 0 ? (
        <p className="mt-16 text-center text-sm text-neutral-400">
          No categories yet. Create snippets with categories to build your index.
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {headings.map((heading) => (
            <Link
              key={heading.categoryId}
              href={`/index/${heading.number}`}
              className="flex flex-col rounded-lg border border-border bg-card p-4 transition-colors hover:bg-accent"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-md bg-muted text-xs font-bold text-muted-foreground">
                {heading.number}
              </span>
              <h3 className="mt-3 text-sm font-medium text-neutral-900 dark:text-neutral-50">
                {heading.name}
              </h3>
              <p className="mt-1 text-xs text-neutral-400">
                {heading.snippetCount} snippet{heading.snippetCount !== 1 ? "s" : ""}
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
