import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { NotepadEditor } from "@/components/notepad/notepad-editor";

export default async function NotepadPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  const userId = session?.user?.id;
  if (!userId) return null;

  const existing = await db.note.findFirst({ where: { userId } });
  const initialContent = existing?.content ?? "";

  return (
    <div className="flex h-full flex-col">
      <NotepadEditor initialContent={initialContent} />
    </div>
  );
}
