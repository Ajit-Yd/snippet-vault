"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { auth } from "./auth";
import { db } from "./db";

async function getSessionUserId() {
  const session = await auth.api.getSession({ headers: await headers() });
  const userId = session?.user?.id;

  if (!userId) {
    throw new Error("Unauthorized");
  }

  return userId;
}

async function getSnippetForUser(snippetId: string, userId: string) {
  const snippet = await db.snippet.findFirst({
    where: { id: snippetId, userId },
  });

  if (!snippet) {
    throw new Error("Snippet not found");
  }

  return snippet;
}

async function resolveCategoryId(userId: string, categoryId: string, newCategoryName: string) {
  if (categoryId === "__new__") {
    if (!newCategoryName || !newCategoryName.trim()) {
      throw new Error("Please enter a name for the new category");
    }
    const category = await db.category.create({
      data: { name: newCategoryName.trim(), userId },
    });
    return category.id;
  }

  if (categoryId) {
    return categoryId;
  }

  const generalCategory = await db.category.findFirst({
    where: { userId, name: "General" },
  });

  if (generalCategory) {
    return generalCategory.id;
  }

  const createdCategory = await db.category.create({
    data: { name: "General", userId },
  });

  return createdCategory.id;
}

function normalizeTags(tagsRaw: string) {
  return tagsRaw
    ? tagsRaw.split(",").map((tag) => tag.trim()).filter(Boolean)
    : [];
}

export async function createSnippet(formData: FormData) {
  const userId = await getSessionUserId();
  const title = formData.get("title") as string;
  const content = formData.get("content") as string;
  const categoryId = formData.get("categoryId") as string;
  const newCategoryName = formData.get("newCategoryName") as string;
  const tagsRaw = formData.get("tags") as string;

  if (!title || !content) {
    throw new Error("Missing required fields");
  }

  const finalCategoryId = await resolveCategoryId(userId, categoryId, newCategoryName);
  const tags = normalizeTags(tagsRaw);

  const snippet = await db.snippet.create({
    data: {
      title,
      content,
      userId,
      categoryId: finalCategoryId,
      tags: {
        create: await Promise.all(
          tags.map(async (tagName) => {
            const tag =
              (await db.tag.findFirst({ where: { name: tagName } })) ||
              (await db.tag.create({ data: { name: tagName } }));
            return { tagId: tag.id };
          })
        ),
      },
    },
  });

  revalidatePath("/");
  return snippet;
}

export async function updateSnippet(formData: FormData) {
  const userId = await getSessionUserId();
  const id = formData.get("id") as string;
  const title = formData.get("title") as string;
  const content = formData.get("content") as string;
  const categoryId = formData.get("categoryId") as string;
  const newCategoryName = formData.get("newCategoryName") as string;
  const tagsRaw = formData.get("tags") as string;

  if (!id) throw new Error("Missing snippet id");
  if (!title || !content) throw new Error("Missing required fields");

  await getSnippetForUser(id, userId);
  const finalCategoryId = await resolveCategoryId(userId, categoryId, newCategoryName);
  const tags = normalizeTags(tagsRaw);

  await db.snippetTag.deleteMany({ where: { snippetId: id } });

  const snippet = await db.snippet.update({
    where: { id },
    data: {
      title,
      content,
      categoryId: finalCategoryId,
      tags: {
        create: await Promise.all(
          tags.map(async (tagName) => {
            const tag =
              (await db.tag.findFirst({ where: { name: tagName } })) ||
              (await db.tag.create({ data: { name: tagName } }));
            return { tagId: tag.id };
          })
        ),
      },
    },
  });

  revalidatePath("/");
  return snippet;
}

export async function toggleFavorite(id: string) {
  const userId = await getSessionUserId();
  const snippet = await getSnippetForUser(id, userId);

  const updated = await db.snippet.update({
    where: { id: snippet.id },
    data: { isFavorite: !snippet.isFavorite },
  });

  revalidatePath("/");
  return updated;
}

export async function softDeleteSnippet(id: string) {
  const userId = await getSessionUserId();
  await getSnippetForUser(id, userId);

  await db.snippet.update({
    where: { id },
    data: { isDeleted: true },
  });

  revalidatePath("/");
}

export async function restoreSnippet(id: string) {
  const userId = await getSessionUserId();
  await getSnippetForUser(id, userId);

  await db.snippet.update({
    where: { id },
    data: { isDeleted: false },
  });

  revalidatePath("/");
  revalidatePath("/trash");
}

export async function permanentDeleteSnippet(id: string) {
  const userId = await getSessionUserId();
  await getSnippetForUser(id, userId);

  await db.snippetTag.deleteMany({ where: { snippetId: id } });
  await db.snippet.delete({ where: { id } });
  revalidatePath("/");
  revalidatePath("/trash");
}

export async function upsertNote(content: string) {
  const userId = await getSessionUserId();
  const existing = await db.note.findFirst({ where: { userId } });

  if (existing) {
    return db.note.update({
      where: { id: existing.id },
      data: { content },
    });
  }

  return db.note.create({
    data: { userId, content },
  });
}

export async function createCategory(name: string) {
  const userId = await getSessionUserId();
  return db.category.create({
    data: { name, userId },
  });
}
