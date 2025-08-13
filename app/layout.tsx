import type { Metadata } from "next";
import "./globals.css";
import AppShell from "@/components/ui/AppShell";
import Head from "next/head";
import { Toaster } from "react-hot-toast";


export const metadata: Metadata = {
  title: "Ali Ramazan Portfolio",
  description: "Ali Ramazan's Portfolio",
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico", rel: "alternate icon" },
    ],
    shortcut: "/ali-ramazan-yildirim-white.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <Head>
        <title>Ali Ramazan- Full-Stack Developer</title>
        <meta
          name="description"
          content="Experienced Full-Stack Web Developer proficient in frontend, backend, and database management."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <body className="overflow-x-hidden">
        <AppShell>
          {children}
        </AppShell>
        <Toaster position="top-center" toastOptions={{ duration: 4000, style: { borderRadius: 8 } }} />
      </body>
    </html>
  );
}