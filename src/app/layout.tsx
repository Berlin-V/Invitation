import type { Metadata } from "next";
import { Cormorant_Garamond, Inter, Allura } from "next/font/google";
import "./globals.css";
import { COUPLE, SITE, WEDDING_DATE } from "@/constants";
import GlobalConfetti from "@/components/GlobalConfetti";
import CursorRibbon from "@/components/CursorRibbon";
import BackgroundMusic from "@/components/BackgroundMusic";
import ShootingStars from "@/components/ShootingStars";

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
  title: SITE.title,
  description: SITE.description,
  openGraph: {
    title: `${COUPLE.groom} & ${COUPLE.bride} — Wedding`,
    description: WEDDING_DATE.display,
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
        <GlobalConfetti />
        <CursorRibbon />
        <BackgroundMusic />
        <ShootingStars />
        {children}
      </body>
    </html>
  );
}
