import type { Metadata } from "next";
import { Outfit, DM_Sans } from "next/font/google";
import "./globals.css";

const outfitFont = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  display: "swap",
});

const dmSansFont = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Trexy Web | The Dark Tech Meme Platform",
  description: "Next-gen tech meme platform rebuilt for the web.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${outfitFont.variable} ${dmSansFont.variable} h-full antialiased hidden-scrollbar dark`}
      style={{ colorScheme: "dark" }}
    >
      <body className="min-h-full flex flex-col font-sans selection:bg-accent/30 selection:text-white">
        {children}
      </body>
    </html>
  );
}
