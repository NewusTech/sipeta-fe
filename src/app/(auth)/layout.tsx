export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <section className="mt-10">
      <main>{children}</main>
    </section>
  );
}
