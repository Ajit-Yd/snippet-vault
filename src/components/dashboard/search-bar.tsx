"use client";

import { useRef, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";

export function SearchBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const inputRef = useRef<HTMLInputElement>(null);
  const query = searchParams.get("q") ?? "";
  const scope = searchParams.get("scope") ?? "title";

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "/" && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        inputRef.current?.focus();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  function handleSearch(value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set("q", value);
    } else {
      params.delete("q");
    }
    params.delete("scope");
    router.push(`/?${params.toString()}`);
  }

  function handleScopeChange(newScope: string) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("scope", newScope);
    if (query) params.set("q", query);
    router.push(`/?${params.toString()}`);
  }

  function handleClear() {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("q");
    params.delete("scope");
    router.push(`/?${params.toString()}`);
  }

  return (
    <div className="relative flex items-center gap-2">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
        <Input
          ref={inputRef}
          placeholder='Search snippets... (press "/")'
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          className="h-9 pl-9 pr-8 text-sm"
        />
        {query && (
          <button
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>
      <select
        value={scope}
        onChange={(e) => handleScopeChange(e.target.value)}
        className="h-9 rounded-lg border border-border bg-background px-2 text-xs text-muted-foreground"
      >
        <option value="title">Title</option>
        <option value="content">Content</option>
        <option value="tags">Tags</option>
      </select>
    </div>
  );
}
