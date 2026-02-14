import type { Metadata } from "next";
import "./globals.css";
import { BackgroundFX } from "@/components/BackgroundFX";
import { TooltipProvider } from "@/components/TooltipProvider";
import { Nav } from "@/components/Nav";

export const metadata: Metadata = {
  title: "Country Signals | Macro indicators from World Bank",
  description: "Personal project exploring macro indicators across countries. World Bank data, min-max scoring, levers vs. headwinds. For development econ curious.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased" suppressHydrationWarning>
        <TooltipProvider>
          <BackgroundFX />
          <Nav />
          {children}
        </TooltipProvider>
      </body>
    </html>
  );
}
