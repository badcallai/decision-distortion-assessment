import type { Metadata } from "next";
import { Archivo, Roboto } from "next/font/google";
import "./globals.css";

// Body font — matches lfbholdings.com.
const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

// Heading + wordmark font — matches lfbholdings.com.
const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Decision Distortion Self-Assessment",
  description:
    "A short self-assessment that profiles where the four Decision Distortion forces are most active in your organization.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${roboto.variable} ${archivo.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
