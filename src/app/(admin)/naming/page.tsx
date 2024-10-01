"use client";
import { ColumnDef } from "@tanstack/react-table";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "../../../components/ui/breadcrumb";
import { DataTables } from "../../../components/Datatables";
import {
  CheckSquare2,
  Download,
  EyeIcon,
  ListFilter,
  MapPinPlus,
  PenBox,
  Printer,
  SearchIcon,
  Trash2,
} from "lucide-react";
import { Button } from "../../../components/ui/button";
import Link from "next/link";
import useSWR from "swr";
import { fetcher } from "constants/fetcher";
import { formatDate } from "lib/utils";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Pagination } from "@/components/Pagination";

// type PaymentS = {
//   id: string;
//   amount: number;
//   status: "pending" | "processing" | "success" | "failed";
//   email: string;
// };

// export const payments: PaymentS[] = [
//   {
//     id: "728ed52f",
//     amount: 100,
//     status: "pending",
//     email: "m@example.com",
//   },
//   {
//     id: "489e1d42",
//     amount: 125,
//     status: "processing",
//     email: "example@gmail.com",
//   },
//   {
//     id: "728ed52f",
//     amount: 100,
//     status: "pending",
//     email: "m@example.com",
//   },
//   {
//     id: "489e1d42",
//     amount: 125,
//     status: "processing",
//     email: "example@gmail.com",
//   },
//   // ...
// ];

type Payment = {
  createdAt: string;
  id: string;
  status: number;
  id_toponim: string;
  nama_lokal: number;
  Unsur: {
    name: string;
  };
  Kecamatan: {
    name: string;
  };
  Desa: {
    name: string;
  };
  keterangan: string;
};

const columns: ColumnDef<Payment>[] = [
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
  {
    accessorKey: "createdAt",
    header: "Tanggal",
    cell: ({ row }) => {
      return <p>{formatDate(row.original.createdAt)}</p>;
    },
  },
  {
    accessorKey: "status",
    header: "Status",
  },
  {
    accessorKey: "id_toponim",
    header: "Id Toponim",
  },
  {
    accessorKey: "nama_lokal",
    header: "Nama Tempat",
  },
  {
    accessorKey: "Unsur.name",
    header: "Unsur",
  },
  {
    accessorKey: "Kecamatan.name",
    header: "Kecamatan",
  },
  {
    accessorKey: "Desa.name",
    header: "Desa",
  },
  {
    accessorKey: "keterangan",
    header: "Keterangan",
  },
];

export default function NamingPage() {
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
    <section className="space-y-4 pl-10 md:pl-64 pr-10 pt-10 md:pt-28">
      <h1 className="text-primaryy font-bold text-2xl">Pendataan</h1>
      <div>
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
        <div className="flex items-center space-x-2 md:space-x-11">
          <div className="flex rounded-full w-[80px] h-[28px] items-center px-2 justify-between border border-primaryy mt-[15px]">
            <ListFilter className="h-4 w-4 text-primaryy" />
            <p className="text-primaryy font-light">Filter</p>
          </div>
          <Link href="/naming/create">
            <div className="flex px-2 space-x-2 items-center h-[28px] bg-primaryy mt-4 text-white rounded-full ">
              <MapPinPlus className="w-5 h-5" />
              <p className="text-sm">Tambah Data</p>
            </div>
          </Link>
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
        <div className="w-full -mt-[85px] hidden md:block">
          {result && (
            <DataTables columns={columns} data={result} filterBy="nama_lokal" />
          )}
        </div>
      </div>
    </section>
  );
}

export const CardTable = ({ data }: { data: Payment }) => {
  return (
    <section className="w-full border border-primaryy rounded-lg p-4">
      <div className="space-y-2">
        <ul className="flex">
          <li className="mr-2 font-medium text-primaryy w-28">Tanggal</li>
          <li className="mr-1">:</li>
          <li>{formatDate(data?.createdAt)}</li>
        </ul>
        <ul className="flex">
          <li className="mr-2 font-medium text-primaryy w-28">Status</li>
          <li className="mr-1">:</li>
          <li>{data?.status}</li>
        </ul>
        <ul className="flex">
          <li className="mr-2 font-medium text-primaryy w-28">Id Toponim</li>
          <li className="mr-1">:</li>
          <li>{data?.id_toponim}</li>
        </ul>
        <ul className="flex">
          <li className="mr-2 font-medium text-primaryy w-28">Nama Lokal</li>
          <li className="mr-1">:</li>
          <li>{data?.nama_lokal}</li>
        </ul>
        <ul className="flex">
          <li className="mr-2 font-medium text-primaryy w-28">Kecamatan</li>
          <li className="mr-1">:</li>
          <li>{data?.Kecamatan?.name}</li>
        </ul>
        <ul className="flex">
          <li className="mr-2 font-medium text-primaryy w-28">Desa</li>
          <li className="mr-1">:</li>
          <li>{data?.Desa?.name}</li>
        </ul>
        <ul className="flex">
          <li className="mr-2 font-medium text-primaryy w-28">Keterangan</li>
          <li className="mr-1">:</li>
          <li>{data?.keterangan}</li>
        </ul>
      </div>
      <div className="mt-4 flex justify-end space-x-2 text-primaryy">
        <div>
          <EyeIcon className="w-6 h-6" />
        </div>
        <div>
          <PenBox className="w-6 h-6" />
        </div>
        <div>
          <Trash2 className="w-6 h-6" />
        </div>
        <div>
          <CheckSquare2 className="w-6 h-6" />
        </div>
      </div>
    </section>
  );
};
