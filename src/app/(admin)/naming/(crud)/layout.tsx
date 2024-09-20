import Sidebar from "../../../../components/Dashboard/Sidebar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html>
      <body>
        <Sidebar />
        <main className="pl-32">{children}</main>
      </body>
    </html>
  );
}
