"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DataTables2 } from "../../../components/Datatables/table2";
import useSWR from "swr";
import { fetcherWithoutAuth } from "../../../constants/fetcher";
import { useState } from "react";
import { Pagination } from "../../../components/Pagination";
import { Button } from "../../../components/ui/button";
import { Download, Loader } from "lucide-react";
import Swal from "sweetalert2";

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
    header: "Kelurahan/Desa",
    cell: ({ row }) => <span>{row.original.name || "-"}</span>,
  },
  {
    accessorKey: "kepala",
    header: "Lurah/Kades",
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
  const [dropdown, setDropdown] = useState(false);
  const [loadingState, setLoadingState] = useState({
    pdf: false,
  });

  // Fetch data dengan SWR berdasarkan halaman saat ini
  const { data } = useSWR<any>(
    `${apiUrl}/kecamatan/get?page=${page}&limit=5&desaLimit=10000000`,
    fetcherWithoutAuth
  );

  const handleDownload = async (route: string, extension: string) => {
    setLoadingState((prevState) => ({ ...prevState, [route]: true }));
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/kecamatan/${route}?`,
        {
          method: "GET",
        }
      );

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `kecamatan.${extension}`;
      document.body.appendChild(a);
      a.click();
      a.remove();

      if (response.ok) {
        Swal.fire({
          icon: "success",
          title: "Berhasil download",
          timer: 2000,
          showConfirmButton: false,
          position: "center",
        });
      }
    } catch (e: any) {
      Swal.fire({
        icon: "error",
        title: "Gagal download!",
        timer: 2000,
        showConfirmButton: false,
        position: "center",
      });
    } finally {
      setLoadingState((prevState) => ({ ...prevState, [route]: false }));
    }
  };

  const toggleDropdown = () => {
    setDropdown(!dropdown);
  };

  const result = data?.data;
  const totalPages = data?.pagination?.totalPages || 1;

  // Fungsi untuk mengubah halaman
  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  return (
    <section >
      <div className="pt-10 pb-0 container mx-auto"> 
      <Button
        onClick={toggleDropdown}
        className="bg-transparent border group border-primaryy hover:bg-primaryy hover:text-white rounded-full flex justify-between space-x-2"
      >
        <Download className="h-4 w-4 text-primaryy group-hover:text-white" />
        <p className="text-primaryy group-hover:text-white block">
          Download
        </p>
      </Button>

      {dropdown && (
        <div className="absolute mr-10 mt-2 bg-white z-10 shadow w-32">
          <ul className="p-3 space-y-2">
            <li
              onClick={() => handleDownload("pdf", "pdf")}
              className="hover:translate-x-2 duration-300 transition-all cursor-pointer"
            >
              <p className="text-primaryy">
                {loadingState.pdf ? (
                  <Loader className="animate-spin" />
                ) : (
                  "PDF"
                )}
              </p>
            </li>
          </ul>
        </div>
      )}
      </div>

      <div className="py-10 container mx-auto space-y-5">
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
                <p>: {v.telp || "-"}</p>
                <p>: {v.camat || "-"}</p>
              </div>
            </div>
            {v.Desas && (
              <DataTables2 columns={columns} data={v.Desas.data} filterBy="name" />
            )}
          </div>
        ))}
        <Pagination
          page={page}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>
    </section>
  );
}
