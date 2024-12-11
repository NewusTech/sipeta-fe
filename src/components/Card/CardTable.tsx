"use client";

import { ColumnDef } from "@tanstack/react-table";
import { formatDate } from "lib/utils";
import { CheckSquare2, EyeIcon, PenBox, Pencil, Trash2 } from "lucide-react";
import Link from "next/link";
import ModalDelete from "../Dialog/delete";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

export type Payment = {
  createdAt: string;
  id: number;
  status: number;
  id_toponim: string;
  nama_lokal: number;
  Unsur: {
    name: string;
  };
  Kecamatan: {
    name: string;
  };
  Desa: {
    name: string;
  };
  keterangan: string;
};

export const columnsData: ColumnDef<Payment>[] = [
  {
    header: "Aksi",
    cell: ({ row }) => {
      const token: any = Cookies.get("token");
      const user = jwtDecode<any>(token);
      const role = user.role;

      return (
        <div className="flex space-x-2">
          <div className="p-1 w-7 bg-blue-400 hover:bg-blue-500 rounded-sm cursor-pointer">
            <Link href={`/naming/detail/${row.original.id}`}>
              <EyeIcon className="w-5 h-5 text-white" />
            </Link>
          </div>
          <div className="p-1 w-7 flex justify-center items-center bg-yellow-400 hover:bg-yellow-500 rounded-sm cursor-pointer">
            <Link href={`/naming/update/${row.original.id}`}>
              <Pencil className="w-4 h-4 text-white" />
            </Link>
          </div>
          {role !== "Verifikator" && (
            <ModalDelete
              type="icon"
              endpoint={`datatoponim/delete/${row.original.id}`}
            />
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: "Tanggal",
    cell: ({ row }) => {
      return <p>{formatDate(row.original.createdAt)}</p>;
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status;
      const getStatusBgColor = (status: number) => {
        if (status === 0) return "bg-primaryy";
        if (status === 1) return "bg-success";
        if (status === 2) return "bg-error";
        if (status === 3) return "bg-yellow-500";
        return "bg-green-600";
      };
      const getStatusString = (status: number) => {
        if (status === 0) return "Menunggu";
        if (status === 1) return "Verif";
        if (status === 2) return "Ditolak";
        if (status === 3) return "Perbaikan";
        return "Direvisi";
      };

      const bgColor = getStatusBgColor(status);
      const statusString = getStatusString(status);

      return (
        <p
          className={`text-white text-center ${bgColor} text-[10px] py-[2px] px-2 rounded-full`}
        >
          {statusString}
        </p>
      );
    },
  },
  {
    accessorKey: "id_toponim",
    header: "Id Toponim",
  },
  {
    accessorKey: "nama_lokal",
    header: "Nama Tempat",
  },
  {
    accessorKey: "Unsur.name",
    header: "Unsur",
  },
  {
    accessorKey: "Kecamatan.name",
    header: "Kecamatan",
  },
  {
    accessorKey: "Desa.name",
    header: "Desa",
  },
];

export const CardTable = ({
  data,
  route,
  route2,
  route3,
}: {
  data: Payment;
  route: string;
  route2?: string;
  route3?: string;
}) => {
  return (
    <section className="w-full border border-primaryy rounded-lg p-4">
      <div className="space-y-2">
        <ul className="flex">
          <li className="mr-2 font-medium text-primaryy w-28">Tanggal</li>
          <li className="mr-1">:</li>
          <li>{formatDate(data?.createdAt)}</li>
        </ul>
        <ul className="flex">
          <li className="mr-2 font-medium text-primaryy w-28">Status</li>
          <li className="mr-1">:</li>
          <li
            className={`${
              data?.status === 0
                ? "bg-primaryy text-white"
                : data?.status === 1
                  ? "bg-success text-white"
                  : data?.status === 2
                    ? "bg-error text-white"
                    : "bg-gray-100 text-gray-800"
            } rounded-full py-0.5 px-2 text-xs flex items-center justify-center`}
          >
            {data?.status === 0
              ? "Menunggu"
              : data?.status === 1
                ? "Selesai"
                : data?.status === 2
                  ? "Ditolak"
                  : "Status tidak diketahui"}
          </li>
        </ul>
        <ul className="flex">
          <li className="mr-2 font-medium text-primaryy w-28">Id Toponim</li>
          <li className="mr-1">:</li>
          <li>{data?.id_toponim}</li>
        </ul>
        <ul className="flex">
          <li className="mr-2 font-medium text-primaryy w-28">Nama Lokal</li>
          <li className="mr-1">:</li>
          <li>{data?.nama_lokal}</li>
        </ul>
        <ul className="flex">
          <li className="mr-2 font-medium text-primaryy w-28">Kecamatan</li>
          <li className="mr-1">:</li>
          <li>{data?.Kecamatan?.name}</li>
        </ul>
        <ul className="flex">
          <li className="mr-2 font-medium text-primaryy w-28">Desa</li>
          <li className="mr-1">:</li>
          <li>{data?.Desa?.name}</li>
        </ul>
        <ul className="flex">
          <li className="mr-2 font-medium text-primaryy w-28">Keterangan</li>
          <li className="mr-1">:</li>
          <li>{data?.keterangan}</li>
        </ul>
      </div>
      <div className="mt-4 flex justify-end space-x-2 text-primaryy">
        <Link href={route}>
          <EyeIcon className="w-6 h-6" />
        </Link>
        {route2 && (
          <Link href={route2}>
            <PenBox className="w-6 h-6" />
          </Link>
        )}
        {route3 && <ModalDelete type="ic-mobile" endpoint={route3} />}
      </div>
    </section>
  );
};
