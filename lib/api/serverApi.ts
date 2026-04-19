import { cookies } from "next/headers";
import { api } from "./api";
import type { Note } from "@/types/note";
import type { User } from "@/types/user";
import type { FetchNotesParams, FetchNotesResponse } from "./clientApi";

const withServerCookies = async () => ({
  headers: {
    Cookie: (await cookies()).toString(),
  },
});

export const fetchNotes = async (
  params: FetchNotesParams = {},
): Promise<FetchNotesResponse> => {
  const response = await api.get<FetchNotesResponse>("/notes", {
    ...(await withServerCookies()),
    params: {
      page: params.page ?? 1,
      perPage: params.perPage ?? 12,
      search: params.search || undefined,
      tag: params.tag || undefined,
    },
  });

  return response.data;
};

export const fetchNoteById = async (id: string): Promise<Note> => {
  const response = await api.get<Note>(
    `/notes/${id}`,
    await withServerCookies(),
  );
  return response.data;
};

export const getMe = async (): Promise<User> => {
  const response = await api.get<User>("/users/me", await withServerCookies());
  return response.data;
};

export const checkSession = async () => {
  const response = await api.get<User | null>(
    "/auth/session",
    await withServerCookies(),
  );

  return response;
};
