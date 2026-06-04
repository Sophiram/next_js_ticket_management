import type { Metadata } from "next";
import { Noto_Sans_Khmer } from "next/font/google";
import "./globals.css";

const khmerFont = Noto_Sans_Khmer({
  subsets: ["khmer"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-khmer",
});

export const metadata: Metadata = {
  title: "Rammiez Ticket System",
  description: "Queue Management System Built with Next.js",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="km" className={`${khmerFont.variable}`}>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}