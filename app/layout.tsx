import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Image Background Remover - Free AI Tool",
  description:
    "Remove image backgrounds instantly with AI. Free, no signup required. Perfect for product photos, portraits, and more.",
  keywords: [
    "image background remover",
    "remove background from image",
    "background eraser",
    "AI background remover",
    "free background remover",
  ],
  openGraph: {
    title: "Image Background Remover - Free AI Tool",
    description:
      "Remove image backgrounds instantly with AI. Free, no signup required.",
    type: "website",
    url: "https://your-domain.com",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Image Background Remover",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Image Background Remover - Free AI Tool",
    description:
      "Remove image backgrounds instantly with AI. Free, no signup required.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased bg-gray-50 text-gray-900">{children}</body>
    </html>
  );
}
