import type { Metadata } from "next";
import { Figtree } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";

const figtree = Figtree({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-figtree",
});

export const metadata: Metadata = {
  title: "WeSpend",
  description: "Expense tracking application",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider
      publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}
      appearance={{
        variables: {
          colorPrimary: "#15994e",
          fontFamily: figtree.style.fontFamily,
        },
      }}
    >
      <html lang="en" className={`${figtree.variable} light`}>
        <head>
          <link rel="icon" href="/favicon.ico" />
        </head>
        <body className="antialiased bg-gray-50">
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
