import type { Metadata } from "next";
import "./globals.css";

import AuthProvider from "@/components/AuthProvider/AuthProvider";
import Footer from "@/components/Footer/Footer";
import Header from "@/components/Header/Header";
import TanStackProvider from "@/components/TanStackProvider/TanStackProvider";

export const metadata: Metadata = {
  title: "NoteHub — Smart Notes Manager",
  description:
    "NoteHub — застосунок для створення, пошуку та керування нотатками.",
  openGraph: {
    title: "NoteHub — Smart Notes Manager",
    description:
      "Створюйте, фільтруйте та керуйте нотатками у зручному інтерфейсі.",
    url: "https://your-domain.vercel.app",
    images: ["https://ac.goit.global/fullstack/react/notehub-og-meta.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <TanStackProvider>
          <AuthProvider>
            <Header />
            {children}
            <Footer />
          </AuthProvider>
        </TanStackProvider>
      </body>
    </html>
  );
}
