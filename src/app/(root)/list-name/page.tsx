import { Button } from "../../../components/ui/button";
import SelectSeacrh from "../../../components/Input/Select";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { Search } from "lucide-react";
import {
  ColumnDef,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { DataTables2 } from "../../../components/Datatables/table2";

type PaymentS = {
  id: string;
  amount: number;
  status: "pending" | "processing" | "success" | "failed";
  email: string;
};

export const payments: PaymentS[] = [
  {
    id: "728ed52f",
    amount: 100,
    status: "pending",
    email: "m@example.com",
  },
  {
    id: "489e1d42",
    amount: 125,
    status: "processing",
    email: "example@gmail.com",
  },
  {
    id: "728ed52f",
    amount: 100,
    status: "pending",
    email: "m@example.com",
  },
  {
    id: "489e1d42",
    amount: 125,
    status: "processing",
    email: "example@gmail.com",
  },
  // ...
];

type Payment = {
  id: string;
  amount: number;
  status: "pending" | "processing" | "success" | "failed";
  email: string;
};

const columns: ColumnDef<Payment>[] = [
  {
    accessorKey: "status",
    header: "Status",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "amount",
    header: "Amount",
  },
];

export default function ListNamePage() {
  return (
    <section className="py-10 container mx-auto space-y-6">
      <div className="flex around w-full gap-7">
        <div className="w-full space-y-5">
          <div className="space-y-2">
            <Label htmlFor="name">Nama Rupabumi</Label>
            <Input
              placeholder="Masukkan Name"
              className="rounded-full w-full"
            />
          </div>
          <div className="space-y-4 flex flex-col">
            <Label htmlFor="name">Klasifikasi Toponim</Label>
            <SelectSeacrh />
          </div>
          <div className="space-y-4 flex flex-col">
            <Label htmlFor="name">Unsur</Label>
            <SelectSeacrh />
          </div>
        </div>
        <div className="w-full space-y-5">
          <div className="space-y-4 flex flex-col">
            <Label htmlFor="name">Kategori</Label>
            <SelectSeacrh />
          </div>
          <div className="space-y-4 flex flex-col">
            <Label htmlFor="name">Kecamatan</Label>
            <SelectSeacrh />
          </div>
          <div className="space-y-4 flex flex-col">
            <Label htmlFor="name">Desa</Label>
            <SelectSeacrh />
          </div>
        </div>
      </div>
      <div className="flex justify-end">
        <Button className="space-x-2 rounded-full bg-primaryy">
          <Search />
          <p>Cari Data</p>
        </Button>
      </div>
      <div className="w-full -mt-[85px]">
        <DataTables2 columns={columns} data={payments} filterBy="name" />
      </div>
    </section>
  );
}
