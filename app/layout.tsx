import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";

const font = Outfit({ subsets: ["latin"], weight: ['400', '600', '700', '800'] });

export const metadata: Metadata = {
  title: "Ringo",
  description: "Telegram Mini App Donut Clicker",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={font.className}>{children}</body>
    </html>
  );
}
