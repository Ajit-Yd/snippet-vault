import Link from "next/link";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { getNumberedSubheadings } from "@/lib/index-numbering";
import { IndexSubheadingRow } from "@/components/index/index-subheading-row";
import { ChevronLeft } from "@/components/icons/client-icons";

interface PageProps {
  params: Promise<{ headingNumber: string }>;
}

export default async function HeadingDetailPage({ params }: PageProps) {
  const session = await auth.api.getSession({ headers: await headers() });
  const userId = session?.user?.id;
  if (!userId) return null;

  const { headingNumber } = await params;
  const num = parseInt(headingNumber, 10);

  if (isNaN(num) || num < 1) notFound();

  const categories = await db.category.findMany({
    where: { userId },
    orderBy: { createdAt: "asc" },
  });

  const category = categories[num - 1];
  if (!category) notFound();

  const subheadings = await getNumberedSubheadings(userId, num);

  return (
    <div className="p-6">
      <div className="mb-6">
        <Link
          href="/index"
          className="mb-3 inline-flex items-center gap-1 text-xs text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300"
        >
          <ChevronLeft className="h-3 w-3" />
          Back to Index
        </Link>
        <h1 className="text-lg font-semibold text-neutral-900 dark:text-neutral-50">
          {category.name}
        </h1>
        <p className="text-sm text-neutral-500">
          Section {num} &middot; {subheadings.length} snippet
          {subheadings.length !== 1 ? "s" : ""}
        </p>
      </div>

      {subheadings.length === 0 ? (
        <p className="mt-16 text-center text-sm text-neutral-400">
          No snippets in this category yet.
        </p>
      ) : (
        <div className="space-y-2">
          {subheadings.map((item) => (
            <IndexSubheadingRow
              key={item.snippetId}
              number={item.number}
              title={item.title}
              content={item.content}
            />
          ))}
        </div>
      )}
    </div>
  );
}
