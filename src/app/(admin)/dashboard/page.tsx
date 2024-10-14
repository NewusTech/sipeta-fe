import { Metadata } from "next";
import {
  CircularPercentage,
  CircularPercentageTwo,
} from "../../../components/CircularPercentage";
import ProtectedRoute from "@/components/ProtectedRoute";
import Image from "next/image";
import React from "react";
import { GlassWater } from "lucide-react";

export const metadata: Metadata = {
  title: "Admin - Dashboard Sipeta",
};

const Card = ({
  user,
  icon,
  title,
}: {
  title: string;
  user: string;
  icon: React.ReactNode;
}) => {
  return (
    <div className="w-full relative flex bg-[#fff] shadow rounded-lg p-3 justify-between">
      <div className="space-y-5">
        <p className="text-greyy text-sm">Total User</p>
        <p className="text-lg font-bold">{user}</p>
        <div className="flex space-x-2 mt-6 items-center">
          {icon}
          <p className="text-greyy text-sm ">{title}</p>
        </div>
      </div>
      <div className="w-[67px] h-[64px] bg-primaryy rounded-3xl flex items-center justify-center opacity-20"></div>
      <Image
        src="/assets/icons/users.svg"
        alt="image"
        height={45}
        width={35}
        className="absolute right-7 top-7"
      />
    </div>
  );
};

const DashboardPage = () => {
  return (
    <ProtectedRoute roles={["Super Admin", "Verifikator", "Kontributor"]}>
      <section className="space-y-4 pl-10 md:pl-64 pr-10 pt-5 md:pt-32">
        <h1 className="text-primaryy font-semibold text-lg">Dashboard</h1>
        <div className="grid md:grid-cols-3 grid-cols-1 gap-4">
          <Card user="40,900" title="Surveyor" icon={<GlassWater />} />
          <Card user="40,900" title="Surveyor" icon={<GlassWater />} />
          <Card user="40,900" title="Surveyor" icon={<GlassWater />} />
        </div>

        <div className="w-full"></div>
      </section>
    </ProtectedRoute>
  );
};

export default DashboardPage;
