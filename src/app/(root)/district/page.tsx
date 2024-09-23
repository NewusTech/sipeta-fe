import { ColumnDef } from "@tanstack/react-table";
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

export default function DistrictPage() {
  return (
    <section className="py-10 container mx-auto space-y-6">
      <h1 className="text-lg font-semibold text-primaryy">
        Kecamatan Agung Barat
      </h1>
      <div className="flex space-x-10">
        <div className="uppercase font-medium space-y-1">
          <p>Alamat Kantor</p>
          <p>Telepon</p>
          <p>Camat</p>
        </div>
        <div className="uppercase space-y-1">
          <p>: Alamat Kantor</p>
          <p>: Telepon</p>
          <p>: Camat</p>
        </div>
      </div>
      <DataTables2 columns={columns} data={payments} filterBy="name" />
    </section>
  );
}
