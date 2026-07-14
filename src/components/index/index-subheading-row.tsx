"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface IndexSubheadingRowProps {
  number: string;
  title: string;
  content: string;
}

export function IndexSubheadingRow({
  number,
  title,
  content,
}: IndexSubheadingRowProps) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = content;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  }

  return (
    <button
      onClick={handleCopy}
      className="flex w-full items-center gap-3 rounded-lg border border-border bg-card px-4 py-3 text-left transition-colors hover:bg-accent"
    >
      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-muted text-xs font-medium text-muted-foreground">
        {number}
      </span>
      <span className="flex-1 text-sm font-medium text-neutral-900 dark:text-neutral-50">
        {title}
      </span>
      {copied ? (
        <span className="inline-flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400">
          <Check className="h-3 w-3" />
          Copied
        </span>
      ) : (
        <Copy className="h-4 w-4 shrink-0 text-neutral-400" />
      )}
    </button>
  );
}
