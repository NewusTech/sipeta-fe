import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";

import NavDashboard from "../../components/Dashboard/NavDashboard";
import Sidebar from "../../components/Dashboard/Sidebar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SISTEM INFORMASI PENGELOLAAN DATA KEWILAYAHAN LAMPUNG UTARA",
};
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html>
      <body className={inter.className}>
        <NavDashboard />
        <Sidebar />
        <main className="">
          <section className="relative">{children}</section>
        </main>
      </body>
    </html>
  );
}
