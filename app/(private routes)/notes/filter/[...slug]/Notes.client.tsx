"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { fetchNotes } from "@/lib/api/clientApi";
import NoteList from "@/components/NoteList/NoteList";
import Pagination from "@/components/Pagination/Pagination";
import SearchBox from "@/components/SearchBox/SearchBox";

function useDebounce<T>(value: T, delay = 300) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);

  return debounced;
}

export default function NotesClient({ tag }: { tag: string }) {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  const debouncedSearch = useDebounce(search, 300);

  const { data, isLoading, error } = useQuery({
    queryKey: ["notes", tag, page, debouncedSearch],
    queryFn: () =>
      fetchNotes({
        tag: tag === "all" ? "" : tag,
        page,
        search: debouncedSearch,
        perPage: 12,
      }),
  });

  if (isLoading) return <p>Loading...</p>;
  if (error || !data) return <p>Something went wrong.</p>;

  return (
    <div>
      <Link href="/notes/action/create">Create note +</Link>

      <SearchBox
        value={search}
        onChange={(value) => {
          setSearch(value);
          setPage(1);
        }}
      />

      {data.notes && data.notes.length > 0 && (
        <>
          <NoteList notes={data.notes} />

          <Pagination
            pageCount={data.totalPages}
            forcePage={page - 1}
            onPageChange={(selected) => setPage(selected + 1)}
          />
        </>
      )}
    </div>
  );
}
