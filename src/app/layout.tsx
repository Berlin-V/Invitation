import type { Metadata } from "next";
import { Cormorant_Garamond, Inter, Allura } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-inter",
  display: "swap",
});

const allura = Allura({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-allura",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Berlin & Jerlin Ashika — Wedding, December 9–10, 2026",
  description: "Join us as we celebrate the union of Berlin & Jerlin Ashika on December 9–10, 2026, in Tamil Nadu, India.",
  openGraph: {
    title: "Berlin & Jerlin Ashika — Wedding",
    description: "December 9–10, 2026 · Tamil Nadu, India",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${inter.variable} ${allura.variable}`}
    >
      <body className="bg-bg text-text antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
