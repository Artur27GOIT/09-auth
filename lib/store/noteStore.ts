import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { NoteTag } from "@/types/note";

export const initialDraft: {
  title: string;
  content: string;
  tag: NoteTag;
} = {
  title: "",
  content: "",
  tag: "Todo",
};

interface NoteDraftState {
  draft: {
    title: string;
    content: string;
    tag: NoteTag;
  };
  setDraft: (note: Partial<NoteDraftState["draft"]>) => void;
  clearDraft: () => void;
}

export const useNoteStore = create<NoteDraftState>()(
  persist(
    (set) => ({
      draft: initialDraft,

      setDraft: (note) =>
        set((state) => ({
          draft: {
            ...state.draft,
            ...note,
          },
        })),

      clearDraft: () => set({ draft: initialDraft }),
    }),
    {
      name: "note-draft",
    },
  ),
);
