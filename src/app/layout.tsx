import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "mndrn - Mandarin Study Tracker",
  description: "Track your Mandarin study sessions",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
