import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css"; // your global styles
import { HeaderAuth } from "@/components/header-auth";

export const metadata: Metadata = {
  title: "Marigold Smart Restaurant",
  description: "Smart Restaurant Management & Ordering System",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-[#0C0B0A] text-[#E6E1DC] antialiased">
        {/* Global Navigation Header */}
        <header className="sticky top-0 z-50 border-b border-[#2A2420] bg-[#141210]/90 backdrop-blur-md px-6 py-3">
          <div className="mx-auto flex max-w-7xl items-center justify-between">
            
            {/* Brand Logo / Home Link */}
            <Link href="/" className="flex items-center gap-2 text-xl font-bold text-[#E6E1DC] hover:opacity-80">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#C67D3B] text-sm font-black text-[#0C0B0A]">
                M
              </span>
              <span>Marigold</span>
            </Link>

            {/* Navigation Links */}
            <nav className="flex items-center gap-3 text-sm font-medium">
              <Link 
                href="/menu" 
                className="rounded-lg px-3 py-1.5 text-[#B8A89A] hover:bg-[#2A2420] hover:text-[#E6E1DC] transition"
              >
                Menu
              </Link>

              <Link 
                href="/table/5" 
                className="rounded-lg px-3 py-1.5 text-[#B8A89A] hover:bg-[#2A2420] hover:text-[#E6E1DC] transition"
              >
                Table No
              </Link>

              <Link 
                href="/admin/orders" 
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-lg px-3 py-1.5 text-[#B8A89A] hover:bg-[#2A2420] hover:text-[#E6E1DC] transition"
              >
                KDS / Admin
              </Link>

              <HeaderAuth />
            </nav>

          </div>
        </header>

        {/* Main Content Area */}
        <main>{children}</main>
      </body>
    </html>
  );
}