import { TopNav } from "@/components/TopNav";
import { Toaster } from "@/components/ui/sonner";
import "@/styles/globals.css";

import { Inter } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata = {
  title: "Listly",
  description: "Share lists with your friends easily",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`font-sans ${inter.variable} bg-slate-300 m-5`}>
        <TopNav />
        {children}
        <Toaster position="top-center" />
      </body>
    </html>
  );
}
