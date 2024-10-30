import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@radix-ui/react-tabs";
import TabMap2 from "./tab2";
import TabMapDistrict from "./district";
import TabMapVillage from "./village";
import TabMapRegency from "./regency";

export default function TabMap() {
  return (
    <Tabs defaultValue="regency" className="w-full">
      <TabsList className="flex space-x-2 p-2 h-12 md:h-13 bg-slate-50 rounded-full w-full md:w-6/12 overflow-scroll md:overflow-hidden">
        <TabsTrigger
          value="regency"
          className="w-full data-[state=active]:bg-primaryy px-5 py-1 rounded-full data-[state=active]:text-white"
        >
          Kabupaten
        </TabsTrigger>
        <TabsTrigger
          value="district"
          className="w-full data-[state=active]:bg-primaryy px-5 py-1 rounded-full data-[state=active]:text-white"
        >
          Kecamatan
        </TabsTrigger>
        <TabsTrigger
          value="village"
          className="w-full data-[state=active]:bg-primaryy px-5 py-1 rounded-full data-[state=active]:text-white"
        >
          Desa
        </TabsTrigger>
        <TabsTrigger
          value="tools"
          className="w-full data-[state=active]:bg-primaryy px-5 py-1 rounded-full data-[state=active]:text-white"
        >
          <p className="truncate">Luas & Jarak</p>
        </TabsTrigger>
      </TabsList>
      <TabsContent value="regency" className="w-full">
        <TabMapRegency />
      </TabsContent>
      <TabsContent value="district" className="w-full">
        <TabMapDistrict />
      </TabsContent>
      <TabsContent value="village">
        <TabMapVillage />
      </TabsContent>
      <TabsContent value="tools">
        <TabMap2 />
      </TabsContent>
    </Tabs>
  );
}
