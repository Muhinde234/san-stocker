import type { Metadata } from "next";
import { Mulish } from "next/font/google";
import "./globals.css";
import { QueryProvider } from "@/providers/query-provider";

const mulish = Mulish({
  variable: "--font-mulish",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SAN Stocker",
  description: "Sign in to your SAN Stocker account",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${mulish.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}
