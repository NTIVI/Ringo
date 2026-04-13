import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";

export const metadata: Metadata = {
  title: "YourWin Casino",
  description: "Premium Telegram Mini App Casino",
};

import { AppProvider } from "@/context/AppProvider";
import { TopBar } from "@/components/TopBar";
import { BottomNav } from "@/components/BottomNav";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0" />
      </head>
      <body>
        <AppProvider>
          <div className="app-container">
            <TopBar />
            <main className="main-content">
              {children}
            </main>
            <BottomNav />
          </div>
        </AppProvider>
        <Script src="https://telegram.org/js/telegram-web-app.js" strategy="beforeInteractive" />
      </body>
    </html>
  );
}
