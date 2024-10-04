import { Metadata } from "next";
import Navbar from "../../components/Navbar";
import "../globals.css";

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
      <Navbar />
      <main>{children}</main>
    </div>
  );
}
