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
import { MoreHorizontal } from "lucide-react";
import { Button } from "../../../../components/ui/button";
import Link from "next/link";
import ProtectedRoute from "@/components/ProtectedRoute";
import UploadFileManualBook from "@/components/Dialog/ManualBook";

type District = {
  id: number;
  dokumen: string;
  tipe: string;
};

const columns: ColumnDef<District>[] = [
  {
    accessorKey: "tipe",
    header: "Tipe",
  },
  {
    accessorKey: "dokumen",
    header: "Dokumen",
    cell: ({ row }) => {
      return row.original.dokumen ? (
        <Link href={`${row.original.dokumen}`} target="_blank">
          <p className="underline text-primaryy">Dokumen</p>
        </Link>
      ) : (
        <p>Belum ada dokumen</p>
      );
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
            <UploadFileManualBook id={row.original.id} />
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

export default function ManualBookPage() {
  const { data } = useSWR<any>(
    `${process.env.NEXT_PUBLIC_API_URL}/manualbook/get`,
    fetcherWithoutAuth
  );

  const result = data?.data;

  return (
    <ProtectedRoute roles={["Super Admin"]}>
      <section className="md:pl-64 pl-10 pr-10 pt-10 md:pt-32">
        <h1 className="text-xl font-semibold text-primaryy mb-3">
          Manual Book
        </h1>
        <div>
          {result && (
            <DataTables2 columns={columns} filterBy="name" data={result} />
          )}
        </div>
      </section>
    </ProtectedRoute>
  );
}
