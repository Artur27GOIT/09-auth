import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import type { Metadata } from "next";
import { queryClient } from "@/lib/queryClient";
import { fetchNotes } from "@/lib/api/serverApi";
import NotesClient from "./Notes.client";

type PageProps = {
  params: Promise<{ slug?: string[] }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const tag = slug?.[0] || "all";

  return {
    title: `Notes filtered by: ${tag}`,
    description: `Browse notes filtered by ${tag}.`,
    openGraph: {
      title: `Notes filtered by: ${tag}`,
      description: `Browse notes filtered by ${tag}.`,
      url: `https://your-domain.vercel.app/notes/filter/${tag}`,
      images: ["https://ac.goit.global/fullstack/react/notehub-og-meta.jpg"],
    },
  };
}

export default async function NotesByTagPage({ params }: PageProps) {
  const { slug } = await params;
  const tag = slug?.[0] || "all";

  await queryClient.prefetchQuery({
    queryKey: ["notes", tag, 1, ""],
    queryFn: () => fetchNotes({ tag: tag === "all" ? undefined : tag }),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotesClient tag={tag} />
    </HydrationBoundary>
  );
}
