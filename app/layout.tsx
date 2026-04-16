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
      <head>
        <script src="https://telegram.org/js/telegram-web-app.js" async></script>
      </head>
      <body className={font.className}>{children}</body>
    </html>
  );
}
