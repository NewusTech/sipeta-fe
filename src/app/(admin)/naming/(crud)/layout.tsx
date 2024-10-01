import { Sidebar } from "../../../../components/Dashboard/Sidebar";

export default function CrudLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <Sidebar />
      <main className="pl-32">{children}</main>
    </div>
  );
}
