"use client";

import ProtectedRoute from "@/components/ProtectedRoute";
import Image from "next/image";
import React, { useState } from "react";
import { Users, Verified } from "lucide-react";
import useSWR from "swr";
import { fetcher } from "constants/fetcher";
import geoJson from "../../../constants/data.json";
import {
  GoogleMap,
  Marker,
  Polygon,
  Polyline,
  StandaloneSearchBox,
  useLoadScript,
} from "@react-google-maps/api";
import LocationInfoWindow from "../../../components/ui/locationdialog";
import { Input } from "@/components/ui/input";
import TabMap from "@/components/TabMap/tab";

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
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const [selectedLocation, setSelectedLocation] = useState<any>(null);
  const { data } = useSWR<any>(`${apiUrl}/dashboard`, fetcher);
  const result = data?.data;
  const { data: dashboard } = useSWR<any>(
    `${apiUrl}/datatoponim/get-dashboard?limit=100000`,
    fetcher
  );
  const resultDashboard = dashboard?.data;

  return (
    <ProtectedRoute roles={["Super Admin", "Verifikator", "User", "Surveyor"]}>
      <section className="space-y-4 pl-10 md:pl-64 pr-10 pt-5 md:pt-32">
        <h1 className="text-primaryy font-semibold text-lg">Dashboard</h1>
        <div className="grid md:grid-cols-3 grid-cols-1 gap-4">
          <Card
            user={result?.SurveyorCount}
            title="Surveyor"
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#0f67b1"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-binoculars"
              >
                <path d="M10 10h4" />
                <path d="M19 7V4a1 1 0 0 0-1-1h-2a1 1 0 0 0-1 1v3" />
                <path d="M20 21a2 2 0 0 0 2-2v-3.851c0-1.39-2-2.962-2-4.829V8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v11a2 2 0 0 0 2 2z" />
                <path d="M 22 16 L 2 16" />
                <path d="M4 21a2 2 0 0 1-2-2v-3.851c0-1.39 2-2.962 2-4.829V8a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v11a2 2 0 0 1-2 2z" />
                <path d="M9 7V4a1 1 0 0 0-1-1H6a1 1 0 0 0-1 1v3" />
              </svg>
            }
          />
          <Card
            user={result?.KontributorCount}
            title="Kontributor"
            icon={<Users className="text-primaryy" />}
          />
          <Card
            user={result?.VerifikatorCount}
            title="Verifikator"
            icon={<Verified className="text-primaryy" />}
          />
        </div>

        <div className="">
          <div className="relative">
            {/* Input search with Autocomplete */}
            {/* <StandaloneSearchBox
              onPlacesChanged={onPlacesChanged}
              onLoad={(ref) => (searchBoxRef.current = ref)}
            >
              <Input
                type="text"
                placeholder="Search for a location"
                className="absolute z-10 left-48 mt-[10px] border-none rounded-full w-1/2 shadow"
              />
            </StandaloneSearchBox> */}
          </div>
          <TabMap />
        </div>
      </section>
    </ProtectedRoute>
  );
};

export default DashboardPage;
