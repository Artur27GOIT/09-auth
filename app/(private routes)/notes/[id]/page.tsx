import type { Metadata } from "next";
import { fetchNoteById } from "@/lib/api/serverApi";

type PageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id } = await params;
  const note = await fetchNoteById(id);

  return {
    title: note.title,
    description: `${note.content.slice(0, 120)}...`,
    openGraph: {
      title: note.title,
      description: `${note.content.slice(0, 120)}...`,
      url: `https://your-domain.vercel.app/notes/${id}`,
      images: ["https://ac.goit.global/fullstack/react/notehub-og-meta.jpg"],
    },
  };
}

export default async function NotePage({ params }: PageProps) {
  const { id } = await params;
  const note = await fetchNoteById(id);

  return (
    <div>
      <h1>{note.title}</h1>
      <p>{note.content}</p>
    </div>
  );
}
