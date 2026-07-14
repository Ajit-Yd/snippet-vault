import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { TrashItem } from "./trash-item";

export default async function TrashPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  const userId = session?.user?.id;
  if (!userId) return null;

  const snippets = await db.snippet.findMany({
    where: { userId, isDeleted: true },
    include: {
      category: { select: { id: true, name: true } },
    },
    orderBy: { updatedAt: "desc" },
  });

  return (
    <div className="p-6">
      <h1 className="mb-6 text-lg font-semibold text-neutral-900 dark:text-neutral-50">
        Trash
      </h1>
      {snippets.length === 0 ? (
        <p className="mt-16 text-center text-sm text-neutral-400">
          Trash is empty.
        </p>
      ) : (
        <div className="space-y-2">
          {snippets.map((snippet) => (
            <TrashItem
              key={snippet.id}
              id={snippet.id}
              title={snippet.title}
              categoryName={snippet.category.name}
            />
          ))}
        </div>
      )}
    </div>
  );
}
