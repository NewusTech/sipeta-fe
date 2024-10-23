"use client";

import { Button } from "../../../components/ui/button";
import SelectSearch from "../../../components/Input/Select";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { EyeIcon, Search } from "lucide-react";
import {
  ColumnDef,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { DataTables2 } from "../../../components/Datatables/table2";
import useSWR, { mutate } from "swr";
import { fetcherWithoutAuth } from "../../../constants/fetcher";
import { ChangeEvent, useState } from "react";
import Link from "next/link";
import Cookies from "js-cookie";

type Payment = {
  id: string;
  nama_peta: number;
  status: number;
  Unsur: {
    name: string;
  };
  Desa: {
    name: string;
  };
  Kecamatan: {
    name: string;
  };
};

const columns: ColumnDef<Payment>[] = [
  {
    accessorKey: "nama_peta",
    header: "Nama Rupabumi",
  },
  {
    accessorKey: "Unsur.name",
    header: "Unsur",
  },
  {
    accessorKey: "Desa.name",
    header: "Desa",
  },
  {
    accessorKey: "Kecamatan.name",
    header: "Kecamatan",
  },
  {
    accessorKey: "status",
    header: "Status",
  },
  {
    header: "Aksi",
    cell: ({ row }) => {
      return (
        <div>
          <div className="p-1 w-7 bg-orange-400 hover:bg-orange-500 rounded-sm cursor-pointer">
            <Link href={`/list-name/${row.original.id}`}>
              <EyeIcon className="w-5 h-5 text-white" />
            </Link>
          </div>
        </div>
      );
    },
  },
];

export default function ListNamePage() {
  const [search, setSearch] = useState("");
  const [valueClassify, setValueClassify] = useState<any>({ id: 0, label: "" });
  const [valueUnsur, setValueUnsur] = useState<any>({ id: 0, label: "" });
  const [valueDistrict, setValueDistrict] = useState<any>({ id: 0, label: "" });
  const [valueVillage, setValueVillage] = useState<any>({ id: 0, label: "" });
  const [dataResult, setDataResult] = useState<any>([]); // State untuk menyimpan hasil

  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const { data: classify } = useSWR<any>(
    `${apiUrl}/klasifikasi/get`,
    fetcherWithoutAuth
  );
  const { data: unsur } = useSWR<any>(
    `${apiUrl}/unsur/get/${valueClassify?.id}`,
    fetcherWithoutAuth
  );
  const { data: district } = useSWR<any>(
    `${apiUrl}/kecamatan/get?limit=50`,
    fetcherWithoutAuth
  );
  const { data: village } = useSWR<any>(
    `${apiUrl}/desa/get?kecamatan_id=${valueDistrict?.id}`,
    fetcherWithoutAuth
  );
  const classifyData = classify?.data;
  const unsurData = unsur?.data;
  const districtData = district?.data;
  const villageData = village?.data;
  const newClassify = classifyData?.map(
    (item: { id: number; name: string }) => ({
      value: item.id, // id masuk ke value
      label: item.name, // name masuk ke label
    })
  );
  const newUnsur = unsurData?.map((item: { id: number; name: string }) => ({
    value: item.id, // id masuk ke value
    label: item.name, // name masuk ke label
  }));
  const newDistrict = districtData?.map(
    (item: { id: number; name: string }) => ({
      value: item.id, // id masuk ke value
      label: item.name, // name masuk ke label
    })
  );
  const newVillage = villageData?.map((item: { id: number; name: string }) => ({
    value: item.id, // id masuk ke value
    label: item.name, // name masuk ke label
  }));

  // console.log(valueDistrict);

  const handleFilter = async () => {
    // Trigger SWR mutate to fetch data manually
    const params = new URLSearchParams();

    if (valueDistrict?.id !== 0) {
      params.append("kecamatan_id", valueDistrict.id);
    }
    if (valueVillage?.id !== 0) {
      params.append("desa_id", valueVillage.id);
    }
    if (valueUnsur?.id !== 0) {
      params.append("unsur_id", valueUnsur.id);
    }
    if (valueClassify?.id !== 0) {
      params.append("klasifikasi_id", valueClassify.id);
    }

    if (search) {
      params.append("search", search);
    }

    // Trigger SWR mutate to fetch data manually with dynamic parameters
    const result = await fetch(
      `${apiUrl}/datatoponim/get-landing?${params.toString()}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${Cookies.get("token")}`,
        },
      }
    );
    const jsonData = await result.json();

    console.log(jsonData);

    setDataResult(jsonData.data);
  };

  console.log(dataResult);

  return (
    <section className="py-10 container mx-auto space-y-6">
      <div className="flex md:flex-row flex-col around w-full gap-7">
        <div className="w-full space-y-5">
          <div className="space-y-2">
            <Label htmlFor="name">Nama Rupabumi</Label>
            <Input
              placeholder="Masukkan Name"
              className="rounded-full w-full"
              value={search}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setSearch(e.target.value)
              }
            />
          </div>
          <div className="space-y-4 flex flex-col">
            <Label htmlFor="name">Klasifikasi Toponim</Label>
            <SelectSearch
              data={newClassify}
              placeholder="Klasifikasi"
              valueId={valueClassify}
              setValueId={setValueClassify}
            />
          </div>
          <div className="space-y-4 flex flex-col">
            <Label htmlFor="name">Unsur</Label>
            <SelectSearch
              data={newUnsur}
              placeholder="Unsur"
              valueId={valueUnsur}
              setValueId={setValueUnsur}
            />
          </div>
        </div>
        <div className="w-full space-y-5">
          <div className="space-y-4 flex flex-col">
            <Label htmlFor="name">Kecamatan</Label>
            <SelectSearch
              data={newDistrict}
              valueId={valueDistrict}
              setValueId={setValueDistrict}
              placeholder="Kecamatan"
            />
          </div>
          <div className="space-y-4 flex flex-col">
            <Label htmlFor="name">Desa</Label>
            <SelectSearch
              data={newVillage}
              valueId={valueVillage}
              setValueId={setValueVillage}
              placeholder="Desa"
            />
          </div>
        </div>
      </div>
      <div className="flex md:justify-end">
        <Button
          onClick={handleFilter}
          className="space-x-2 rounded-full bg-primaryy"
        >
          <Search />
          <p>Cari Data</p>
        </Button>
      </div>
      <div className="w-full -mt-[85px]">
        {dataResult && (
          <DataTables2 columns={columns} data={dataResult} filterBy="name" />
        )}
      </div>
    </section>
  );
}
