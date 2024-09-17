import NavDashboard from "../../components/Dashboard/NavDashboard";
import Sidebar from "../../components/Dashboard/Sidebar";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <section className="relative">
      <NavDashboard />
      <Sidebar />
      <main className="pl-64 pt-32">{children}</main>
    </section>
  );
}
