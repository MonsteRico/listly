import { Providers } from "@/components/Providers";
import { TopNav } from "@/components/TopNav";
import { Toaster } from "@/components/ui/sonner";
import "@/styles/globals.css";
import { Metadata, Viewport } from "next";

import { Inter } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Listly",
  description: "Share lists with your friends easily",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
  manifest: "/manifest.json",
  
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  minimumScale: 1,
  maximumScale: 1,
  userScalable: false,
  interactiveWidget: "overlays-content"
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`font-sans ${inter.variable} m-5 bg-slate-300 dark:bg-slate-800`}>
        <Providers>
          <TopNav />
          {children}
          <Toaster position="top-center" />
        </Providers>
      </body>
    </html>
  );
}
