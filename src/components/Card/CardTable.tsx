"use client";

import { ColumnDef } from "@tanstack/react-table";
import { formatDate } from "lib/utils";
import { CheckSquare2, EyeIcon, PenBox, Pencil, Trash2 } from "lucide-react";
import Link from "next/link";
import ModalDelete from "../Dialog/delete";

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
          <ModalDelete
            type="icon"
            endpoint={`datatoponim/delete/${row.original.id}`}
          />
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
      const bgColor =
        status === 0 ? "bg-primaryy" : status === 1 ? "bg-success" : "bg-error";

      return (
        <p
          className={`text-white text-center ${bgColor} text-[10px] py-[2px] px-2 rounded-full`}
        >
          {status === 0 ? "Menunggu" : status === 1 ? "Verif" : "Ditolak"}
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
  {
    accessorKey: "keterangan",
    header: "Keterangan",
  },
];

export const CardTable = ({ data }: { data: Payment }) => {
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
          <li>{data?.status}</li>
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
        <div>
          <EyeIcon className="w-6 h-6" />
        </div>
        <div>
          <PenBox className="w-6 h-6" />
        </div>
        <div>
          <Trash2 className="w-6 h-6" />
        </div>
        <div>
          <CheckSquare2 className="w-6 h-6" />
        </div>
      </div>
    </section>
  );
};
