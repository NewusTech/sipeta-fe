"use client";

import { DataTables2 } from "../../../../components/Datatables/table2";
import { DataTables } from "../../../../components/Datatables";
import { fetcherWithoutAuth } from "../../../../constants/fetcher";
import { ColumnDef } from "@tanstack/react-table";
import useSWR from "swr";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "../../../../components/ui/dropdown-menu";
import { MoreHorizontal, Plus } from "lucide-react";
import { Button } from "../../../../components/ui/button";
import Link from "next/link";
import ModalDelete from "../../../../components/Dialog/delete";
import ProtectedRoute from "@/components/ProtectedRoute";
import JsonDistrictDialog from "@/components/Dialog/JsonDistrict";

type District = {
  id: number;
  name: string;
  camat: string;
  telp: string;
  alamat: string;
};

const columns: ColumnDef<District>[] = [
  {
    id: "no",
    header: "No",
    cell: ({ row }) => {
      return <p>{row.index + 1}</p>;
    },
  },
  {
    accessorKey: "name",
    header: "Nama",
    cell: ({ row }) => {
      return <p>{row.original.name || "-"}</p>;
    },
  },
  {
    accessorKey: "camat",
    header: "Camat",
    cell: ({ row }) => {
      return <p>{row.original.camat || "-"}</p>;
    },
  },
  {
    accessorKey: "telp",
    header: "Telepon",
    cell: ({ row }) => {
      return <p>{row.original.telp || "-"}</p>;
    },
  },
  {
    accessorKey: "alamat",
    header: "Alamat",
    cell: ({ row }) => {
      return <p>{row.original.alamat || "-"}</p>;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <JsonDistrictDialog
              route="/master-data/district/api/create"
              id={row.original.id}
              name={`Kecamatan ${row.original.name}`}
            />
            <Link href={`/master-data/district/${row.original.id}`}>
              <DropdownMenuItem className="cursor-pointer">
                Edit
              </DropdownMenuItem>
            </Link>
            <ModalDelete endpoint={`kecamatan/delete/${row.original.id}`} />
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

export default function DistrictPage() {
  const { data } = useSWR<any>(
    `${process.env.NEXT_PUBLIC_API_URL}/kecamatan/get?limit=50`,
    fetcherWithoutAuth
  );

  const result = data?.data;

  return (
    <ProtectedRoute roles={["Super Admin"]}>
      <section className="md:pl-64 pl-10 pr-10 md:pt-32 pt-10">
        <h1 className="text-xl font-semibold text-primaryy mb-3">Kecamatan</h1>
        <div className="flex items-center justify-end">
          <Link href="/master-data/district/create">
            <div className="flex px-2 space-x-2 items-center h-[28px] bg-primaryy mt-4 text-white rounded-full ">
              <Plus className="w-5 h-5" />
              <p className="text-sm">Tambah Data</p>
            </div>
          </Link>
        </div>
        <div className="-mt-9">
          {result && (
            <DataTables
              columns={columns}
              filterBy="name"
              data={result}
              type="village"
            />
          )}
        </div>
      </section>
    </ProtectedRoute>
  );
}
