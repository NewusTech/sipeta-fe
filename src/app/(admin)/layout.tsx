"use client";

import { Inter } from "next/font/google";
import "../globals.css";

import NavDashboard from "../../components/Dashboard/NavDashboard";
import Sidebar from "../../components/Dashboard/Sidebar";
import { usePathname } from "next/navigation";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const isCrudRoute = pathname.includes("/create");

  return (
    <html>
      <body className={inter.className}>
        {!isCrudRoute && (
          <>
            <NavDashboard />
            <Sidebar type="large" />
          </>
        )}
        <main className="relative">{children}</main>
      </body>
    </html>
  );
}
