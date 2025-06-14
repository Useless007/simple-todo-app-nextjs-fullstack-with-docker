import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Todo App - จัดการงานอย่างมีประสิทธิภาพ",
  description: "Todo app ที่มีการจัดการวันที่ ลำดับความสำคัญ และคุณสมบัติครบครัน",
  icons: {
    icon: [
      {
        url: '/favicon.svg',
        type: 'image/svg+xml',
        sizes: '16x16',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
        sizes: '32x32',
      },
    ],
    apple: [
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
        sizes: '180x180',
      },
    ],
    shortcut: '/icon.svg',
  },
  manifest: '/manifest.json',
  themeColor: '#1f2937',
  viewport: 'width=device-width, initial-scale=1',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th">
      <head>
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/icon.svg" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
