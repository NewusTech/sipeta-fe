"use client";

import { CardTable } from "@/components/Card/CardTable";
import { DataTables } from "@/components/Datatables";
import { Pagination } from "@/components/Pagination";
import ProtectedRoute from "@/components/ProtectedRoute";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ColumnDef } from "@tanstack/react-table";
import { fetcher } from "constants/fetcher";
import {
  Download,
  EyeIcon,
  ListFilter,
  Printer,
  SearchIcon,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
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

export default function HasBeenReviewedPage() {
  const [page, setPage] = useState(1);

  const { data } = useSWR(
    `${process.env.NEXT_PUBLIC_API_URL}/datatoponim/get?limit=10000000`,
    fetcher
  );

  const result = data?.data;
  const totalPages = data?.pagination?.totalPages || 1;

  // Fungsi untuk mengubah halaman
  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  return (
    <ProtectedRoute roles={["Super Admin", "Verifikator", "Surveyor"]}>
      <section className="md:pl-64 pl-10 pr-10 md:pt-28 pt-6">
        <Breadcrumb className="hidden md:block">
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
                Sudah Ditelaah
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <h1 className="text-xl text-primaryy font-semibold">Sudah Ditelaah</h1>
        <div className="pt-5">
          <div className="flex space-x-2 justify-start md:justify-end">
            <div className="flex md:hidden border-primaryy items-center space-x-2 pr-5 w-full rounded-full bg-transparent border">
              <Input
                placeholder="Cari..."
                className="rounded-full border-none w-full"
              />
              <SearchIcon className="w-6 h-6 text-primaryy" />
            </div>
            <div className="flex space-x-2">
              <Button className="bg-transparent border group border-primaryy hover:bg-primaryy hover:text-white rounded-full flex justify-between space-x-2">
                <Download className="h-4 w-4 text-primaryy group-hover:text-white" />
                <p className="text-primaryy group-hover:text-white hidden md:block">
                  Download
                </p>
              </Button>
              <Button className="bg-transparent border group border-primaryy hover:bg-primaryy hover:text-white rounded-full flex justify-between space-x-2">
                <Printer className="h-4 w-4 text-primaryy group-hover:text-white" />
                <p className="text-primaryy group-hover:text-white hidden md:block">
                  Print
                </p>
              </Button>
            </div>
          </div>
          <div className="flex items-center space-x-11">
            <div className="flex rounded-full w-[80px] h-[28px] items-center px-2 justify-between border border-primaryy mt-[15px]">
              <ListFilter className="h-4 w-4 text-primaryy" />
              <p className="text-primaryy font-light">Filter</p>
            </div>
          </div>
          <div className="space-y-2 mt-6 md:hidden block">
            {result ? (
              result?.map((v: any) => <CardTable key={v.id} data={v} />)
            ) : (
              <div className="flex justify-center items-center">
                <p className="text-slate-400">Tidak ada data</p>
              </div>
            )}
          </div>
          <div className="w-full flex md:hidden justify-end">
            <Pagination
              page={page}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
          <div className="w-full -mt-[85px] md:block hidden">
            {result && (
              <DataTables columns={columns} data={result} filterBy="name" />
            )}
          </div>
        </div>
      </section>
    </ProtectedRoute>
  );
}
