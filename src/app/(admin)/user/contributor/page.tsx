"use client";

import { DataTables } from "@/components/Datatables";
import { DataTables2 } from "@/components/Datatables/table2";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { ColumnDef } from "@tanstack/react-table";
import { fetcher } from "constants/fetcher";
import { EyeIcon, Link } from "lucide-react";
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
  const { data } = useSWR(
    `${process.env.NEXT_PUBLIC_API_URL}/userinfo/get?limit=10000000&role=5`,
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
      <div className="w-full mt-6">
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
  );
}
