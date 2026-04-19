"use client";

import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { fetchNoteById } from "@/lib/api/clientApi";

export default function NoteDetailsClient({ id }: { id: string }) {
  const router = useRouter();

  const { data, isLoading, error } = useQuery({
    queryKey: ["note", id],
    queryFn: () => fetchNoteById(id),
    refetchOnMount: false,
  });

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (error || !data) {
    return <p>Something went wrong.</p>;
  }

  return (
    <div>
      <button type="button" onClick={() => router.back()}>
        Close
      </button>

      <h1>{data.title}</h1>
      <p>{data.content}</p>
      <p>Tag: {data.tag}</p>
      <p>Created at: {new Date(data.createdAt).toLocaleString()}</p>
    </div>
  );
}
