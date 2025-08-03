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
      <html lang="en" className={`${poppins.variable} light`}>
        <head>
          <link rel="icon" href="/favicon.ico" />
          <script
            dangerouslySetInnerHTML={{
              __html: `
                (function() {
                  try {
                    var theme = localStorage.getItem('theme-storage');
                    if (theme) {
                      var parsed = JSON.parse(theme);
                      if (parsed.state && parsed.state.theme) {
                        document.documentElement.classList.remove('light', 'dark');
                        document.documentElement.classList.add(parsed.state.theme);
                        if (parsed.state.theme === 'dark') {
                          document.body.classList.remove('bg-gray-50');
                          document.body.classList.add('bg-gray-900');
                        } else {
                          document.body.classList.remove('bg-gray-900');
                          document.body.classList.add('bg-gray-50');
                        }
                      }
                    }
                  } catch (e) {}
                })();
              `,
            }}
          />
        </head>
        <body className="antialiased bg-gray-50 transition-colors duration-200">
          <ClientThemeProvider>
            {children}
          </ClientThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
