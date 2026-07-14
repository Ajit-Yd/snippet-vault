"use client";

import { useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createSnippet, updateSnippet } from "@/lib/actions";

interface Category {
  id: string;
  name: string;
}

interface CreateSnippetDialogProps {
  categories: Category[];
  editData?: {
    id: string;
    title: string;
    content: string;
    categoryId: string;
    tags: string;
  };
  children?: ReactNode;
}

export function CreateSnippetDialog({
  categories,
  editData,
  children,
}: CreateSnippetDialogProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState(editData?.title ?? "");
  const [content, setContent] = useState(editData?.content ?? "");
  const [categoryId, setCategoryId] = useState(editData?.categoryId ?? "");
  const [newCategoryName, setNewCategoryName] = useState("");
  const [tags, setTags] = useState(editData?.tags ?? "");
  const [pending, setPending] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setPending(true);

    const formData = new FormData();
    formData.set("title", title);
    formData.set("content", content);
    formData.set("categoryId", categoryId);
    formData.set("tags", tags);
    if (newCategoryName) formData.set("newCategoryName", newCategoryName);

    try {
      if (editData) {
        formData.set("id", editData.id);
        await updateSnippet(formData);
      } else {
        await createSnippet(formData);
      }
      setOpen(false);
      setTitle("");
      setContent("");
      setCategoryId("");
      setNewCategoryName("");
      setTags("");
      router.refresh();
    } catch (err) {
      console.error(err);
    } finally {
      setPending(false);
    }
  }

  function renderTrigger() {
  return (
    <span
      onClick={() => setOpen(true)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          setOpen(true);
        }
      }}
      role="button"
      tabIndex={0}
      className="contents"
    >
      {children ?? (
        <Button variant="outline" className="gap-2">
          <Plus className="h-4 w-4" />
          New Snippet
        </Button>
      )}
    </span>
  );
}

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {renderTrigger()}
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {editData ? "Edit Snippet" : "New Snippet"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Input
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Textarea
              placeholder="Paste your snippet content here..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={6}
              required
            />
          </div>
          <div className="flex gap-3">
            <div className="flex-1 space-y-2">
              <Select
                value={categoryId}
                onValueChange={(val) => setCategoryId(val ?? "")}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.name}
                    </SelectItem>
                  ))}
                  <SelectItem value="__new__">+ Create new category</SelectItem>
                </SelectContent>
              </Select>
              {categoryId === "__new__" && (
                <Input
                  placeholder="New category name"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  className="mt-1"
                />
              )}
            </div>
          </div>
          <div className="space-y-2">
            <Input
              placeholder="Tags (comma-separated)"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={pending}>
              {pending
                ? "Saving..."
                : editData
                  ? "Update Snippet"
                  : "Create Snippet"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
