"use client";

import { ColumnDef } from "@tanstack/react-table";
import { RichTextDisplay } from "@/components/RichTextDisplay";

export const bloodTypes = [
  { id: 1, key: "A" },
  { id: 2, key: "B" },
  { id: 3, key: "AB" },
  { id: 4, key: "O" },
];

export type District = {
  desc: string;
};

export const columns: ColumnDef<District>[] = [
  {
    accessorKey: "desc",
    header: "Deskripsi",
    cell: ({ row }) => {
      return <RichTextDisplay content={row.original.desc} />;
    },
  },
];
