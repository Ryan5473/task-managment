import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "FlowMate - Streamline Your Workflow",
    template: "%s | FlowMate",
  },
  description: "A modern, intuitive Kanban board application with automation features to streamline your project management and boost productivity.",
  keywords: ["kanban", "project management", "task management", "productivity", "workflow", "automation"],
  authors: [{ name: "FlowMate Team" }],
  creator: "FlowMate",
  publisher: "FlowMate",
  applicationName: "FlowMate",
  category: "productivity",
  openGraph: {
    type: "website",
    title: "FlowMate - Streamline Your Workflow",
    description: "A modern, intuitive Kanban board application with automation features to streamline your project management and boost productivity.",
    siteName: "FlowMate",
  },
  twitter: {
    card: "summary_large_image",
    title: "FlowMate - Streamline Your Workflow",
    description: "A modern, intuitive Kanban board application with automation features to streamline your project management and boost productivity.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-background font-sans`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster 
            position="bottom-right"
            theme="system"
            richColors
            closeButton
            duration={4000}
            toastOptions={{
              style: {
                background: "hsl(var(--background))",
                color: "hsl(var(--foreground))",
                border: "1px solid hsl(var(--border))",
              },
            }}
          />
        </ThemeProvider>
      </body>
    </html>
  );
}
