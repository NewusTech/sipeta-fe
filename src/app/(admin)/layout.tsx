"use client";

import { Inter } from "next/font/google";
import "../globals.css";

import NavDashboard from "../../components/Dashboard/NavDashboard";
import { Sidebar } from "../../components/Dashboard/Sidebar";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Loader } from "lucide-react";
import useAuthStore from "store/useAuthStore";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const isCrudRoute = pathname.includes("/naming/create");

  const { initialize, isInitialized, user } = useAuthStore((state) => ({
    initialize: state.initialize,
    isInitialized: state.isInitialized,
    user: state.user,
  }));
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    initialize();
  }, [initialize]);

  useEffect(() => {
    if (isInitialized) {
      if (!user) {
        router.push("/login");
      } else {
        setIsLoading(false);
      }
    }
  }, [isInitialized, user, router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="animate-spin" />
      </div>
    );
  }

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
