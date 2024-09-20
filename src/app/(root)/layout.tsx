import Navbar from "../../components/Navbar";
import "../globals.css";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html>
      <body>
        <section className="">
          <Navbar />
          <main>{children}</main>
        </section>
      </body>
    </html>
  );
}
