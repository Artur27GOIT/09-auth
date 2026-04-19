"use server";

import { createNote, type CreateNotePayload } from "@/lib/api/clientApi";
import { redirect } from "next/navigation";

export async function createNoteAction(formData: FormData) {
  const payload: CreateNotePayload = {
    title: formData.get("title") as string,
    content: formData.get("content") as string,
    tag: formData.get("tag") as CreateNotePayload["tag"],
  };

  await createNote(payload);

  redirect("/notes");
}
