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
  FolderDown,
  FolderUp,
  Import,
  ListFilter,
  Loader,
  MapPinPlus,
  PenBox,
  Printer,
  SearchIcon,
  Trash2,
} from "lucide-react";
import { Button } from "../../../components/ui/button";
import Link from "next/link";
import { fetcher } from "constants/fetcher";
import { formatDate } from "lib/utils";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Pagination } from "@/components/Pagination";
import { CardTable, columnsData } from "@/components/Card/CardTable";
import ProtectedRoute from "@/components/ProtectedRoute";
import useSWR from "swr";
import Swal from "sweetalert2";
import UploadFileDialog from "@/components/Dialog/UploadFIle";
import UploadFileShpDialog from "@/components/Dialog/UploadShp";
import { FilterDialog } from "@/components/Dialog/Filter";

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

export default function NamingPage() {
  const [page, setPage] = useState(1);
  const [dropdown, setDropdown] = useState(false);
  const [dropdown2, setDropdown2] = useState(false);
  const [loadingState, setLoadingState] = useState({
    pdf: false,
    excel: false,
    csv: false,
    json: false,
    shp: false,
  });
  const [filterData, setFilterData] = useState<{
    status: string;
    date: Date | null;
  }>({
    status: "",
    date: null,
  });

  // Fungsi untuk menerima data dari FilterDialog
  const handleFilterApply = (status: string, date: Date | null) => {
    setFilterData({ status, date });
    console.log("Filter Applied:", { status, date });
    // Lakukan fetch data atau filtering dengan filterData yang baru
  };

  const toggleDropdown = () => {
    setDropdown(!dropdown);
    if (!dropdown) {
      setDropdown2(false); // Menutup dropdown2 saat dropdown pertama dibuka
    }
  };

  const toggleDropdown2 = () => {
    setDropdown2(!dropdown2);
    if (!dropdown2) {
      setDropdown(false); // Menutup dropdown pertama saat dropdown2 dibuka
    }
  };

  const { data } = useSWR(
    `${process.env.NEXT_PUBLIC_API_URL}/datatoponim/get-dashboard?limit=10000000&status=${filterData.status}`,
    fetcher
  );

  const result = data?.data;
  console.log(result);
  const totalPages = data?.pagination?.totalPages || 1;

  // Fungsi untuk mengubah halaman
  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleDownload = async (route: string, extension: string) => {
    setLoadingState((prevState) => ({ ...prevState, [route]: true }));
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/datatoponim/${route}?status=1`,
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
    <ProtectedRoute roles={["Super Admin", "Surveyor", "User", "Verifikator"]}>
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
              <Button
                onClick={toggleDropdown}
                className="bg-transparent border group border-primaryy hover:bg-primaryy hover:text-white rounded-full flex justify-between space-x-2"
              >
                <FolderUp className="h-4 w-4 text-primaryy group-hover:text-white" />
                <p className="text-primaryy group-hover:text-white hidden md:block">
                  Ekspor
                </p>
              </Button>
              <Button
                onClick={toggleDropdown2}
                className="bg-transparent border group border-primaryy hover:bg-primaryy hover:text-white rounded-full flex justify-between space-x-2"
              >
                <FolderDown className="h-4 w-4 text-primaryy group-hover:text-white" />
                <p className="text-primaryy group-hover:text-white hidden md:block">
                  Impor
                </p>
              </Button>
            </div>
          </div>
          {dropdown2 && (
            <div className="absolute right-0 mr-10 mt-2 bg-white z-10 shadow w-32">
              <ul className="p-3 space-y-2">
                <li>
                  <UploadFileDialog title="Excel" endpoint="excel" />
                </li>
                <li>
                  <UploadFileDialog title="CSV" endpoint="csv" />
                </li>
                <li>
                  <UploadFileDialog title="JSON" endpoint="json" />
                </li>
                <li>
                  <UploadFileShpDialog />
                </li>
              </ul>
            </div>
          )}
          {dropdown && (
            <div className="absolute right-20 mr-10 mt-2 bg-white z-10 shadow w-32">
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
          <div className="flex items-center space-x-2 md:space-x-11">
            <FilterDialog onFilterApply={handleFilterApply} />
            <Link href="/naming/create">
              <div className="flex px-2 space-x-2 items-center h-[28px] bg-primaryy mt-4 text-white rounded-full ">
                <MapPinPlus className="w-5 h-5" />
                <p className="text-sm">Tambah Data</p>
              </div>
            </Link>
          </div>
          <div className="space-y-2 mt-6 md:hidden block">
            {result ? (
              result?.map((v: any) => (
                <CardTable
                  route={`/naming/detail/${v.id}`}
                  route2={`/naming/update/${v.id}`}
                  route3={`datatoponim/delete/${v.id}`}
                  key={v.id}
                  data={v}
                />
              ))
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
              <DataTables
                columns={columnsData}
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
