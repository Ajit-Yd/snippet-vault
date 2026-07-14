"use client";

import { useState, useRef, useEffect } from "react";
import { Save } from "lucide-react";
import { upsertNote } from "@/lib/actions";

interface NotepadEditorProps {
  initialContent: string;
}

export function NotepadEditor({ initialContent }: NotepadEditorProps) {
  const [content, setContent] = useState(initialContent);
  const [saved, setSaved] = useState(true);
  const timerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  function handleChange(value: string) {
    setContent(value);
    setSaved(false);

    if (timerRef.current) clearTimeout(timerRef.current);

    timerRef.current = setTimeout(async () => {
      try {
        await upsertNote(value);
        setSaved(true);
      } catch {
        // silently fail
      }
    }, 800);
  }

  return (
    <div className="relative flex h-full flex-col">
      <div className="flex items-center justify-between border-b border-neutral-200 px-4 py-2 dark:border-neutral-800">
        <h2 className="text-sm font-medium text-neutral-900 dark:text-neutral-50">
          Notepad
        </h2>
        <span className="inline-flex items-center gap-1 text-xs text-neutral-400">
          <Save className="h-3 w-3" />
          {saved ? "Saved" : "Saving..."}
        </span>
      </div>
      <textarea
        value={content}
        onChange={(e) => handleChange(e.target.value)}
        placeholder="Write anything here..."
        className="flex-1 resize-none border-0 bg-transparent p-4 text-sm text-neutral-900 outline-none placeholder:text-neutral-400 dark:text-neutral-50 dark:placeholder:text-neutral-500"
      />
    </div>
  );
}
