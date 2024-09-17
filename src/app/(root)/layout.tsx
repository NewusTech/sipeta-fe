import Navbar from "../../components/Navbar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <section className="mt-10">
      <Navbar />
      <main>{children}</main>
    </section>
  );
}
