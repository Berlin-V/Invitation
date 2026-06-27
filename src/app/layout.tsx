import type { Metadata } from "next";
import "./globals.css";
import Navigation from "@/components/Navigation";
import ChatBot from "@/components/ChatBot";
import Providers from "@/components/Providers";

export const metadata: Metadata = {
  title: "Berlin & Jerlin Ashika | Wedding — December 10, 2026",
  description: "Join us for the wedding celebration of Berlin & Jerlin Ashika on December 10, 2026.",
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
