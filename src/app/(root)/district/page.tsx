"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DataTables2 } from "../../../components/Datatables/table2";
import useSWR from "swr";
import { fetcherWithoutAuth } from "@/constants/fetcher";
import { useState } from "react";
import { Pagination } from "../../../components/Pagination";

type Payment = {
  id: string;
  no: number;
  name: string;
  kepala: string;
  alamat: string;
  telp: string;
};

const columns: ColumnDef<Payment>[] = [
  {
    accessorKey: "no",
    header: "No",
    cell: ({ row }) => <span>{row.index + 1}</span>,
  },
  {
    accessorKey: "name",
    header: "Kelurahan / Desa",
    cell: ({ row }) => <span>{row.original.name || "-"}</span>,
  },
  {
    accessorKey: "kepala",
    header: "Lurah / Kades",
    cell: ({ row }) => <span>{row.original.kepala || "-"}</span>,
  },
  {
    accessorKey: "alamat",
    header: "Alamat Kantor",
    cell: ({ row }) => <span>{row.original.alamat || "-"}</span>,
  },
  {
    accessorKey: "telp",
    header: "Telepon",
    cell: ({ row }) => <span>{row.original.telp || "-"}</span>,
  },
];

export default function DistrictPage() {
  const [page, setPage] = useState(1);
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  // Fetch data dengan SWR berdasarkan halaman saat ini
  const { data } = useSWR<any>(
    `${apiUrl}/kecamatan/get?page=${page}&limit=5&desaLimit=10000000`,
    fetcherWithoutAuth
  );

  const result = data?.data;
  const totalPages = data?.pagination?.totalPages || 1;

  // Fungsi untuk mengubah halaman
  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  return (
    <section className="py-10 container mx-auto space-y-6">
      {result?.map((v: any) => (
        <div key={v.id} className="space-y-3">
          <h1 className="text-lg font-semibold text-primaryy">
            Kecamatan {v.name}
          </h1>
          <div className="flex space-x-10">
            <div className="uppercase font-medium space-y-1">
              <p>Alamat Kantor</p>
              <p>Telepon</p>
              <p>Camat</p>
            </div>
            <div className="uppercase space-y-1">
              <p>: {v.alamat || "-"}</p>
              <p>: {v.telep || "-"}</p>
              <p>: {v.camat || "-"}</p>
            </div>
          </div>
          {v.Desas && (
            <DataTables2 columns={columns} data={v.Desas} filterBy="name" />
          )}
        </div>
      ))}
      <Pagination
        page={page}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </section>
  );
}
