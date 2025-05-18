import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import Navbar from "@/components/Navbar";
import AuthProvider from "@/components/AuthProvider";
import { Toaster } from "@/components/ui/sonner";
import Sidebar from "@/components/Sidebar";
import ProgressProvider from "@/components/ProgressProvider";
import { Suspense } from "react";
export const metadata: Metadata = {
  title: "Reddit - The hear of the internet",
  description: "A Reddit Clone built with Next.js",
  icons: {
    icon: "/reddit_favicon.png",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="dark:bg-zinc-900 bg-white text-zinc-900 dark:text-zinc-100 antialiased overflow-hidden">
        <Suspense>

        <ProgressProvider />
        </Suspense>
        <AuthProvider>
          <Toaster />
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <Navbar />
            <div className="flex h-[calc(100vh-64px)]">
              <Sidebar />

              <main className="flex-1 overflow-auto">{children}</main>
            </div>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
