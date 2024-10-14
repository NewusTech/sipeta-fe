import { Metadata } from "next";
import dynamic from "next/dynamic";
import "../globals.css";

const DynamicNavbar = dynamic(() => import("../../components/Navbar"), {
  ssr: false,
});

export const metadata: Metadata = {
  title: "Sipeta",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <DynamicNavbar />
      <main>{children}</main>
    </div>
  );
}
