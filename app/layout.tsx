import type { Metadata } from "next";
import "./globals.css";
import AppShell from "@/components/ui/AppShell";
import { Toaster } from "react-hot-toast";


export const metadata: Metadata = {
  title: "Ali Ramazan Portfolio",
  description: "Ali Ramazan's Portfolio",
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" }
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
      <body className="overflow-x-hidden">
        <AppShell>
          {children}
        </AppShell>
        <Toaster position="top-center" toastOptions={{ duration: 4000, style: { borderRadius: 8 } }} />
      </body>
    </html>
  );
}