"use client";

import { DataTables } from "@/components/Datatables";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { fetcher } from "constants/fetcher";
import { Download, EyeIcon, ListFilter, Printer } from "lucide-react";
import Link from "next/link";
import useSWR from "swr";

type HasBeenReviewed = {
  id: string;
  id_toponim: string;
  nama_lokal: string;
  nama_spesifik: string;
  status: number;
  Unsur: {
    name: string;
  };
  Kecamatan: {
    name: string;
  };
};

const columns: ColumnDef<HasBeenReviewed>[] = [
  {
    id: "action",
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
  {
    accessorKey: "id_toponim",
    header: "Id Toponim",
  },
  {
    accessorKey: "Unsur.name",
    header: "Unsur",
  },
  {
    accessorKey: "nama_lokal",
    header: "Nama Lokal",
  },
  {
    accessorKey: "nama_spesifik",
    header: "Nama Spesifik",
  },
  {
    accessorKey: "Kecamatan.name",
    header: "Kecamatan",
  },
];

export default function Declined() {
  const { data } = useSWR(
    `${process.env.NEXT_PUBLIC_API_URL}/datatoponim/get?limit=10000000`,
    fetcher
  );

  const result = data?.data;

  return (
    <section className="md:pl-64 pr-10 pt-28">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem className="text-primaryy">
            <BreadcrumbLink href="/">Dashboard</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator className="text-primaryy" />
          <BreadcrumbItem className="text-primaryy">
            <BreadcrumbLink href="#">Penelaahan</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator className="text-primaryy" />
          <BreadcrumbItem>
            <BreadcrumbPage className="text-primaryy font-semibold">
              Belum Ditelaah
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="pt-5">
        <div className="flex space-x-2 justify-end">
          <Button className="bg-transparent border group border-primaryy hover:bg-primaryy hover:text-white rounded-full flex justify-between space-x-2">
            <Download className="h-4 w-4 text-primaryy group-hover:text-white" />
            <p className="text-primaryy group-hover:text-white">Download</p>
          </Button>
          <Button className="bg-transparent border group border-primaryy hover:bg-primaryy hover:text-white rounded-full flex justify-between space-x-2">
            <Printer className="h-4 w-4 text-primaryy group-hover:text-white" />
            <p className="text-primaryy group-hover:text-white">Print</p>
          </Button>
        </div>
        <div className="flex items-center space-x-11">
          <div className="flex rounded-full w-[80px] h-[28px] items-center px-2 justify-between border border-primaryy mt-[15px]">
            <ListFilter className="h-4 w-4 text-primaryy" />
            <p className="text-primaryy font-light">Filter</p>
          </div>
        </div>
        <div className="w-full -mt-[85px]">
          {result && (
            <DataTables columns={columns} data={result} filterBy="nama_lokal" />
          )}
        </div>
      </div>
    </section>
  );
}
