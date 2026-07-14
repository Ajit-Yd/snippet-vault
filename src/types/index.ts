export interface SnippetWithRelations {
  id: string;
  title: string;
  content: string;
  categoryId: string;
  category: { id: string; name: string };
  userId: string;
  tags: { tag: { id: string; name: string } }[];
  isFavorite: boolean;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CategoryWithCount {
  id: string;
  name: string;
  _count: { snippets: number };
}

export interface HeadingItem {
  number: number;
  name: string;
  snippetCount: number;
  categoryId: string;
}

export interface SubheadingItem {
  number: string;
  title: string;
  content: string;
  snippetId: string;
}
