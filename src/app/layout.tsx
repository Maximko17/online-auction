import type { Metadata } from "next";
import { Inter as FontSans } from "next/font/google";
import "../styles/globals.css";
import { cn } from "@/lib/utils";
import Navbar from "@/components/navbar";
import { Toaster } from "@/components/ui/toast/toaster";
import { Footer } from "@/components/footer";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "BidZone - Online Auction",
  description: "Online Auction",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={cn(
          "h-full min-h-screen bg-background font-sans antialiased",
          fontSans.variable,
        )}
      >
        <Navbar />
        <div className="container max-w-7xl mx-auto  pt-14">
          {children}
          <Toaster />
        </div>
        <Footer />
      </body>
    </html>
  );
}
