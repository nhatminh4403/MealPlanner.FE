import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import "./globals.css";
import { ThemeProvider } from "@/libs/ThemeProvider";
import { LocalizationProvider } from "@/libs/localization";
import { NotificationProvider } from "@/libs/NotificationProvider";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Toaster } from "sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Meal Planner",
  description: "Your personalized dashboard and recipe management system",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var stored = localStorage.getItem('theme');
                  if (stored === 'dark' || (!stored && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                    document.documentElement.classList.add('dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-zinc-50 text-zinc-900 transition-colors duration-300 dark:bg-black dark:text-zinc-50`}
      >
        <ThemeProvider>
          <LocalizationProvider>
            <NotificationProvider>
              <div className="relative flex min-h-screen flex-col font-sans">
                <div className="bg-gradient-mesh pointer-events-none fixed inset-0 z-0" />
                <div className="relative z-10 flex flex-1 flex-col">
                  <Header />
                  <main className="flex-1">{children}</main>

                  <Footer />
                  <Toaster
                    position="bottom-right"
                    visibleToasts={3}
                    toastOptions={{
                      style: {
                        background:
                          "linear-gradient(135deg, rgba(37, 99, 235, 0.32), rgba(5, 150, 105, 0.32))",
                        backdropFilter: "blur(16px)",
                        WebkitBackdropFilter: "blur(16px)",
                        color: "white",
                        border: "1px solid rgba(255,255,255,0.1)",
                        borderRadius: "1rem",
                        boxShadow: "0 20px 25px -5px rgba(0,0,0,0.3)",
                      },
                    }}
                  />
                </div>
              </div>
            </NotificationProvider>
          </LocalizationProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
