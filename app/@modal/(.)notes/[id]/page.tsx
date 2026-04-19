import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { fetchNoteById } from "@/lib/api/serverApi";
import NotePreviewClient from "./NotePreview.client";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function NotePreviewPage({ params }: PageProps) {
  const { id } = await params;

  await queryClient.prefetchQuery({
    queryKey: ["note", id],
    queryFn: () => fetchNoteById(id),
  });

  const dehydratedState = dehydrate(queryClient);

  return (
    <HydrationBoundary state={dehydratedState}>
      <NotePreviewClient id={id} />
    </HydrationBoundary>
  );
}
