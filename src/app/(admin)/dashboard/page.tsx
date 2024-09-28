import { Metadata } from "next";
import CircularPercentage from "../../../components/CircularPercentage";

export const metadata: Metadata = {
  title: "Admin - Dashboard Sipeta",
};

const Card = () => {
  return (
    <div className="w-full space-y-2 bg-white rounded-lg flex flex-col justify-center items-center py-6">
      <CircularPercentage
        percentage={80}
        color="text-primaryy"
        color2="text-white"
      />
      <p className="text-greyy text-sm">Surveyor</p>
    </div>
  );
};

const DashboardPage = () => {
  return (
    <section className="space-y-4 pl-10 md:pl-64 pr-10 pt-5 md:pt-32">
      <h1 className="text-primaryy font-semibold text-lg">Dashboard</h1>
      <div className="hidden md:grid grid-cols-3 gap-x-3">
        <Card />
        <Card />
        <Card />
      </div>
      <div className="md:hidden bg-white">
        <CircularPercentage
          percentage={80}
          color="text-primaryy"
          color2="text-white"
        />
      </div>
      <div className="w-full"></div>
    </section>
  );
};

export default DashboardPage;
