import "../globals.css";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html>
      <body>
        <section className="mt-10">
          <main>{children}</main>
        </section>
      </body>
    </html>
  );
}
