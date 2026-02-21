import type { Metadata } from "next";
import { Inter, Amiri } from "next/font/google";
import "./globals.css";

const inter = Inter({ 
  subsets: ["latin"],
  variable: '--font-inter',
});

const amiri = Amiri({ 
  weight: ['400', '700'],
  subsets: ["latin"],
  variable: '--font-amiri',
});

export const metadata: Metadata = {
  title: "Noor-e-Ramadan - Your Islamic Companion",
  description: "Real-time Islamic companion app for Ramadan with prayer times, Quran tracker, and AI assistant",
  keywords: ["Ramadan", "Islamic", "Prayer Times", "Quran", "Iftar", "Sehri"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" dir="ltr">
      <body className={`${inter.variable} ${amiri.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
