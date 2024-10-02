import NavDashboard from "@/components/Dashboard/NavDashboard";
import { Sidebar } from "../../../../components/Dashboard/Sidebar";
import Image from "next/image";

export default function CrudLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <div className="bg-primaryy w-full h-[120px] md:hidden flex items-center p-10">
        <div className="flex md:hidden w-full md:w-5/12 items-center space-x-2">
          <Image
            src="/assets/icons/logo.svg"
            alt="Logo"
            className="w-[40px] h-[60px] md:w-[35px] md:h-[65px]"
            width={35}
            height={65}
          />
          <div>
            <h1 className="uppercase text-white font-bold text-sm md:text-lg">
              sipeta
            </h1>
            <p className="capitalize font-light text-white text-xs">
              dashboard
            </p>
          </div>
        </div>
      </div>
      <div className="hidden md:block mt-6">
        <Sidebar />
      </div>
      <main>{children}</main>
    </div>
  );
}
