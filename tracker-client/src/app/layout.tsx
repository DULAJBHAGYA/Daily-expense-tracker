import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: "WeSpend",
  description: "Expense tracking application",
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider appearance={{
      variables: {
        colorPrimary: "#10b981",
        fontFamily: poppins.style.fontFamily,
      }
    }}>
      <html lang="en" className={poppins.variable}>
        <head><link rel="icon" href="/favicon.ico" /></head>
        <body className={`antialiased bg-gray-50`}>{children}</body>
      </html>
    </ClerkProvider>
  );
}