import type { Metadata } from "next";
import "./globals.css";
import Navigation from "@/components/Navigation";
import ChatBot from "@/components/ChatBot";
import Providers from "@/components/Providers";
import { SITE } from "@/lib/config";

export const metadata: Metadata = {
  title: SITE.title,
  description: SITE.description,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-[#1A0A0F] text-[#FFF8F0]">
        <Providers>
          <Navigation />
          <main className="flex-1">{children}</main>
          <ChatBot />
        </Providers>
      </body>
    </html>
  );
}
