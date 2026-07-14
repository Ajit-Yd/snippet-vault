import { db } from "./db";

export async function getNumberedHeadings(userId: string) {
  const categories = await db.category.findMany({
    where: { userId },
    include: {
      _count: {
        select: {
          snippets: {
            where: { isDeleted: false },
          },
        },
      },
    },
    orderBy: { createdAt: "asc" },
  });

  return categories.map((cat, idx) => ({
    number: idx + 1,
    name: cat.name,
    snippetCount: cat._count.snippets,
    categoryId: cat.id,
  }));
}

export async function getNumberedSubheadings(
  userId: string,
  headingNumber: number
) {
  const categories = await db.category.findMany({
    where: { userId },
    orderBy: { createdAt: "asc" },
  });

  const category = categories[headingNumber - 1];
  if (!category) return [];

  const snippets = await db.snippet.findMany({
    where: {
      userId,
      categoryId: category.id,
      isDeleted: false,
    },
    orderBy: { createdAt: "asc" },
  });

  return snippets.map((snippet, idx) => ({
    number: `${headingNumber}.${idx + 1}`,
    title: snippet.title,
    content: snippet.content,
    snippetId: snippet.id,
  }));
}
