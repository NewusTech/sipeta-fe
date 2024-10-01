"use client";

import { DataTables } from "@/components/Datatables";
import { DataTables2 } from "@/components/Datatables/table2";
import CreateAdminDialog from "@/components/Dialog/CreateAdmin";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { fetcher } from "constants/fetcher";
import { EyeIcon, Link, ListFilter } from "lucide-react";
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

export default function UserAdminPage() {
  const { data } = useSWR(
    `${process.env.NEXT_PUBLIC_API_URL}/userinfo/get?limit=10000000&role=4`,
    fetcher
  );

  const result = data?.data;

  return (
    <section className="pl-64 pr-10 pt-28">
      <Breadcrumb>
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
      <div className="flex mt-3 items-center space-x-2">
        <div className="flex items-center space-x-11">
          <div className="flex rounded-full w-[80px] h-[28px] items-center px-2 justify-between border border-primaryy mt-[15px]">
            <ListFilter className="h-4 w-4 text-primaryy" />
            <p className="text-primaryy font-light">Filter</p>
          </div>
        </div>
        <CreateAdminDialog />
      </div>
      <div className="w-full -mt-9">
        {result && (
          <DataTables2
            columns={columns}
            data={result}
            filterBy="name"
            type="search-right"
          />
        )}
      </div>
    </section>
  );
}
