import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { ClientThemeProvider } from "@/components/ClientThemeProvider";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
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
          colorPrimary: "#10b981",
          fontFamily: poppins.style.fontFamily,
        },
      }}
    >
      <html lang="en" className={poppins.variable}>
        <head>
          <link rel="icon" href="/favicon.ico" />
        </head>
        <body className="antialiased bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
          <ClientThemeProvider>
            {children}
          </ClientThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
