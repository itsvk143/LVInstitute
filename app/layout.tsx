import type { Metadata } from "next";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { QueryProvider } from "@/components/providers/QueryProvider";
import { Toaster } from "sonner";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "LV Institute — Student Management Dashboard",
    template: "%s | LV Institute",
  },
  description:
    "Premium Student Management & Academic Progress Dashboard for LV Institute. Track student progress, chapters, revisions, marks, attendance, and more.",
  keywords: ["LV Institute", "student dashboard", "academic progress", "CBSE", "ICSE", "NEET", "JEE"],
  authors: [{ name: "LV Institute" }],
  openGraph: {
    title: "LV Institute Dashboard",
    description: "Premium Student Management & Academic Progress Dashboard",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body className="min-h-screen bg-background font-sans antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <QueryProvider>
            {children}
            <Toaster
              position="top-right"
              richColors
              closeButton
              toastOptions={{
                classNames: {
                  toast: "font-sans",
                },
              }}
            />
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
