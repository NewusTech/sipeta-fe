"use client";

import { DataTables } from "@/components/Datatables";
import { DataTables2 } from "@/components/Datatables/table2";
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
import { Input } from "@/components/ui/input";
import { ColumnDef } from "@tanstack/react-table";
import { fetcher } from "constants/fetcher";
import {
  EyeIcon,
  Key,
  KeyRound,
  Link,
  PenBox,
  SearchIcon,
  Trash2,
} from "lucide-react";
import { useEffect, useState } from "react";
import useSWR from "swr";

type Contributor = {
  id: string;
  name: string;
  telepon: string;
  email: string;
  Role: number;
};

const columns: ColumnDef<Contributor>[] = [
  {
    accessorKey: "name",
    header: "Nama Lengkap",
  },
  {
    accessorKey: "telepon",
    header: "No Telepon",
    cell: ({ row }) => {
      return <p>{row.original.telepon || "-"}</p>;
    },
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => {
      return <p>{row.original.email || "-"}</p>;
    },
  },
  {
    accessorKey: "Role",
    header: "Role",
  },
  // {
  //   id: "action",
  //   header: "Aksi",
  //   cell: ({ row }) => {
  //     return (
  //       <div>
  //         <div className="p-1 w-7 bg-orange-400 hover:bg-orange-500 rounded-sm cursor-pointer">
  //           <Link href={`/list-name/${row.original.id}`}>
  //             <EyeIcon className="w-5 h-5 text-white" />
  //           </Link>
  //         </div>
  //       </div>
  //     );
  //   },
  // },
];

export default function ContributorPage() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(1000000); // Default limit untuk desktop

  // Deteksi ukuran layar
  useEffect(() => {
    const updateLimit = () => {
      if (window.innerWidth <= 768) {
        setLimit(10); // Limit untuk mobile
      } else {
        setLimit(1000000); // Limit untuk desktop
      }
    };

    updateLimit(); // Update saat pertama kali render
    window.addEventListener("resize", updateLimit); // Update saat layar diubah ukurannya

    return () => window.removeEventListener("resize", updateLimit);
  }, []);

  const { data } = useSWR(
    `${process.env.NEXT_PUBLIC_API_URL}/userinfo/get?limit=${limit}&role=4&page=${page}`,
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
      <section className="md:pl-64 pl-10 pr-10 pt-5 md:pt-28">
        <Breadcrumb className="md:block hidden">
          <BreadcrumbList>
            <BreadcrumbItem className="text-primaryy">
              <BreadcrumbLink href="/">Dashboard</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="text-primaryy" />
            <BreadcrumbItem className="text-primaryy">
              <BreadcrumbLink href="#">Peran Pengguna</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="text-primaryy" />
            <BreadcrumbItem>
              <BreadcrumbPage className="text-primaryy font-semibold">
                Kontributor
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <div className="md:hidden block space-y-5">
          <h1 className="text-primaryy text-xl font-semibold">Kontributor</h1>
          <div className="flex md:hidden border-primaryy items-center space-x-2 pr-5 w-full rounded-full bg-transparent border">
            <Input
              placeholder="Cari..."
              className="rounded-full border-none w-full"
            />
            <SearchIcon className="w-6 h-6 text-primaryy" />
          </div>
          <div className="space-y-4 mt-6 md:hidden block">
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
        </div>
        <div className="w-full mt-6 md:block hidden">
          {result && (
            <DataTables2
              columns={columns}
              data={result}
              filterBy="name"
              type="search"
            />
          )}
        </div>
      </section>
    </ProtectedRoute>
  );
}

const CardTable = ({ data }: { data: Contributor }) => {
  return (
    <section className="w-full border border-primaryy rounded-lg p-4">
      <div className="space-y-2">
        <ul className="flex">
          <li className="mr-2 font-medium text-primaryy w-32">Nama Lengkap</li>
          <li className="mr-1">:</li>
          <li>{data?.name}</li>
        </ul>
        <ul className="flex">
          <li className="mr-2 font-medium text-primaryy w-32">No Telepon</li>
          <li className="mr-1">:</li>
          <li>{data?.telepon}</li>
        </ul>
        <ul className="flex">
          <li className="mr-2 font-medium text-primaryy w-32">Email</li>
          <li className="mr-1">:</li>
          <li>{data?.email}</li>
        </ul>
        <ul className="flex">
          <li className="mr-2 font-medium text-primaryy w-32">Role</li>
          <li className="mr-1">:</li>
          <li>{data?.Role}</li>
        </ul>
      </div>
      <div className="mt-4 flex justify-end space-x-2 text-primaryy">
        <div>
          <KeyRound className="w-6 h-6" />
        </div>
        <div>
          <PenBox className="w-6 h-6" />
        </div>
        <div>
          <Trash2 className="w-6 h-6" />
        </div>
      </div>
    </section>
  );
};
