import type { Metadata } from "next";
import "./globals.css";
import AppShell from "@/components/ui/AppShell";
import { Toaster } from "react-hot-toast";
import { LanguageProvider } from "@/contexts/LanguageContext";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.arytechsolutions.com"),
  title: {
    default: "ARY Tech Solutions – Webentwicklung & Digitale Lösungen",
    template: "%s | ARY Tech Solutions",
  },
  description:
    "Professionelle Webentwicklung, SEO-Optimierung und digitale Lösungen von ARY Tech Solutions. Moderne Websites mit Next.js, React und TypeScript.",
  openGraph: {
    type: "website",
    locale: "de_DE",
    url: "https://www.arytechsolutions.com",
    siteName: "ARY Tech Solutions",
    title: "ARY Tech Solutions – Webentwicklung & Digitale Lösungen",
    description:
      "Professionelle Webentwicklung, SEO-Optimierung und digitale Lösungen von ARY Tech Solutions.",
    images: [
      {
        url: "/ali-ramazan-yildirim-white.png",
        width: 1200,
        height: 630,
        alt: "ARY Tech Solutions",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ARY Tech Solutions – Webentwicklung & Digitale Lösungen",
    description:
      "Professionelle Webentwicklung, SEO-Optimierung und digitale Lösungen.",
    images: ["/ali-ramazan-yildirim-white.png"],
  },
  alternates: {
    canonical: "https://www.arytechsolutions.com",
  },
  icons: {
    icon: [
      { url: "/ali-ramazan-yildirim-white-favicon.svg", type: "image/svg+xml" },
    ],
    shortcut: [
      { url: "/ali-ramazan-yildirim-white-favicon.svg", type: "image/svg+xml" },
    ],
    apple: [
      { url: "/ali-ramazan-yildirim-white-favicon.svg", type: "image/svg+xml" },
    ],
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
