import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google"; // 1. Import Fonts
import "./globals.css";
import { cn } from "@/lib/utils"; // Assumes you have the Shadcn utility

// 2. Configure Inter (The UI Font)
const fontSans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

// 3. Configure JetBrains Mono (The Code Font)
const fontMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "Sandbox402 | x402 Dev Studio",
  description: "Debug, Simulate, and Orchestrate Agentic Payments on Cronos.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark"> 
      <body
        // 4. Apply the fonts globally
        className={cn(
          "min-h-screen bg-slate-950 font-sans antialiased text-slate-100 selection:bg-cyan-500/30",
          fontSans.variable,
          fontMono.variable
        )}
      >
        {children}
      </body>
    </html>
  );
}