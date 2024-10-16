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
  Loader,
  Printer,
  SearchIcon,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import useSWR from "swr";
import Swal from "sweetalert2";
import { FiltersDialog } from "@/components/Dialog/Filter/filters";

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
            <Link
              href={`/review/has-not-been-reviewed/detail/${row.original.id}`}
            >
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
    cell: ({ row }) => {
      return <p>{row.original?.Unsur?.name || "-"}</p>;
    },
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
    cell: ({ row }) => {
      return <p>{row.original?.Kecamatan?.name || "-"}</p>;
    },
  },
];

export default function HasNotBeenReviewedPage() {
  const [page, setPage] = useState(1);
  const [dropdown, setDropdown] = useState(false);
  const [loadingState, setLoadingState] = useState({
    pdf: false,
    excel: false,
    csv: false,
    json: false,
    shp: false,
  });
  const [filterData, setFilterData] = useState<{
    district: any;
    unsur: any;
    date: Date | null;
  }>({
    district: "",
    unsur: "",
    date: null,
  });

  // Fungsi untuk menerima data dari FilterDialog
  const handleFilterApply = (district: any, unsur: any, date: Date | null) => {
    setFilterData({ district, unsur, date });
    // Lakukan fetch data atau filtering dengan filterData yang baru
  };
  const toggleDropdown = () => {
    setDropdown(!dropdown);
  };

  const { data } = useSWR(() => {
    // Base URL
    let url = `${process.env.NEXT_PUBLIC_API_URL}/datatoponim/get-dashboard?limit=10000000&status=0`;

    // Append 'kecamatan_id' if it's not null or empty
    if (filterData.district && filterData.district.id) {
      url += `&kecamatan_id=${Number(filterData.district.id)}`;
    }

    // Append 'unsur_id' if it's not null or empty
    if (filterData.unsur && filterData.unsur.id) {
      url += `&unsur_id=${Number(filterData.unsur.id)}`;
    }

    // Return URL to be used by useSWR
    return url;
  }, fetcher);

  const result = data?.data;
  const totalPages = data?.pagination?.totalPages || 1;

  // Fungsi untuk mengubah halaman
  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleDownload = async (route: string, extension: string) => {
    setLoadingState((prevState) => ({ ...prevState, [route]: true }));
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/datatoponim/${route}?status=0`,
        {
          method: "GET",
        }
      );

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `data-toponim.${extension}`;
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

  return (
    <ProtectedRoute roles={["Super Admin", "Verifikator"]}>
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
        <h1 className="text-xl text-primaryy font-semibold">Belum Ditelaah</h1>
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
              <Button
                onClick={toggleDropdown}
                className="bg-transparent border group border-primaryy hover:bg-primaryy hover:text-white rounded-full flex justify-between space-x-2"
              >
                <Download className="h-4 w-4 text-primaryy group-hover:text-white" />
                <p className="text-primaryy group-hover:text-white hidden md:block">
                  Download
                </p>
              </Button>
            </div>
          </div>
          {dropdown && (
            <div className="absolute right-0 mr-10 mt-2 bg-white z-10 shadow w-32">
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
                <li
                  onClick={() => handleDownload("excel", "xlxs")}
                  className="hover:translate-x-2 duration-300 transition-all cursor-pointer"
                >
                  <p className="text-primaryy">
                    {loadingState.excel ? (
                      <Loader className="animate-spin" />
                    ) : (
                      "Excel"
                    )}
                  </p>
                </li>
                <li
                  onClick={() => handleDownload("csv", "csv")}
                  className="hover:translate-x-2 duration-300 transition-all cursor-pointer"
                >
                  <p className="text-primaryy">
                    {loadingState.csv ? (
                      <Loader className="animate-spin" />
                    ) : (
                      "CSV"
                    )}
                  </p>
                </li>
                <li
                  onClick={() => handleDownload("json", "json")}
                  className="hover:translate-x-2 duration-300 transition-all cursor-pointer"
                >
                  <p className="text-primaryy">
                    {loadingState.json ? (
                      <Loader className="animate-spin" />
                    ) : (
                      "JSON"
                    )}
                  </p>
                </li>
                <li
                  onClick={() => handleDownload("shp", "shp")}
                  className="hover:translate-x-2 duration-300 transition-all cursor-pointer"
                >
                  <p className="text-primaryy">
                    {loadingState.shp ? (
                      <Loader className="animate-spin" />
                    ) : (
                      "SHP"
                    )}
                  </p>
                </li>
              </ul>
            </div>
          )}
          <div className="flex items-center space-x-11">
            <FiltersDialog onFilterApply={handleFilterApply} />
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
              <DataTables
                columns={columns}
                data={result}
                filterBy="nama_lokal"
              />
            )}
          </div>
        </div>
      </section>
    </ProtectedRoute>
  );
}
