"use client";

import { DataTables2 } from "../../../../components/Datatables/table2";
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
import { DataTables } from "@/components/Datatables";

type Village = {
  id: number;
  name: string;
  kepala: string;
  telp: string;
  alamat: string;
};

const columns: ColumnDef<Village>[] = [
  {
    id: "no",
    header: "No",
    cell: ({ row }) => {
      return <p>{row.index + 1}</p>;
    },
  },
  {
    accessorKey: "name",
    header: "Kelurahan / Desa",
    cell: ({ row }) => {
      return <p>{row.original.name || "-"}</p>;
    },
  },
  {
    accessorKey: "kepala",
    header: "Lurah / Desa",
    cell: ({ row }) => {
      return <p>{row.original.kepala || "-"}</p>;
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
            <Link href={`/master-data/village/${row.original.id}`}>
              <DropdownMenuItem className="cursor-pointer">
                Edit
              </DropdownMenuItem>
            </Link>
            <ModalDelete endpoint={`desa/delete/${row.original.id}`} />
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

export default function VillagePage() {
  const { data } = useSWR<any>(
    `${process.env.NEXT_PUBLIC_API_URL}/desa/get?limit=500`,
    fetcherWithoutAuth
  );

  const result = data?.data;

  return (
    <ProtectedRoute roles={["Super Admin"]}>
      <section className="pl-64 pr-10 pt-32">
        <h1 className="text-xl font-semibold text-primaryy mb-3">Desa</h1>
        <div className="flex items-center justify-end">
          <Link href="/master-data/village/create">
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
