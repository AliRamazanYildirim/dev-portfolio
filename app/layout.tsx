import type { Metadata } from "next";
import "./globals.css";
import AppShell from "@/components/ui/AppShell";
import { Toaster } from "react-hot-toast";
import { LanguageProvider } from "@/contexts/LanguageContext";

export const metadata: Metadata = {
  title: "Ali Ramazan Portfolio",
  description: "Ali Ramazan's Portfolio",
  icons: {
    icon: [{ url: "/icon.svg", type: "image/svg+xml" }],
    shortcut: "/ali-ramazan-yildirim-white.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning={true}
      className="h-full w-full overflow-x-hidden"
    >
      <body className="min-h-screen w-full overflow-x-hidden">
        <LanguageProvider>
          <AppShell>{children}</AppShell>
        </LanguageProvider>
        <Toaster
          position="top-center"
          toastOptions={{
            duration: 4000,
            style: { borderRadius: 8, maxWidth: 600 },
          }}
        />
      </body>
    </html>
  );
}
