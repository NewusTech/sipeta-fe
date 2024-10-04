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
import { Download, ListFilter, Printer } from "lucide-react";
import { Button } from "../../../components/ui/button";
import ProtectedRoute from "@/components/ProtectedRoute";

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

export default function ManageDataPage() {
  return (
    <ProtectedRoute roles={["Super Admin", "Verifikator", "Surveyor"]}>
      <section className="space-y-4">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem className="text-primaryy">
              <BreadcrumbLink href="/">Dashboard</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="text-primaryy" />
            <BreadcrumbItem className="text-primaryy">
              <BreadcrumbLink href="#">Pengelolaan Data</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="text-primaryy" />
            <BreadcrumbItem>
              <BreadcrumbPage className="text-primaryy font-semibold">
                Pendataan
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <div>
          <div className="flex space-x-2 justify-end">
            <Button className="bg-primaryy rounded-full flex justify-between space-x-2">
              <Download className="h-4 w-4 text-white" />
              <p>Download</p>
            </Button>
            <Button className="bg-primaryy rounded-full flex justify-between space-x-2">
              <Printer className="h-4 w-4 text-white" />
              <p>Print</p>
            </Button>
          </div>
          <div className="flex rounded-full w-[80px] h-[28px] items-center px-2 justify-between border border-primaryy mt-[15px]">
            <ListFilter className="h-4 w-4 text-primaryy" />
            <p className="text-primaryy font-light">Filter</p>
          </div>
          {/* <div className="w-full -mt-[85px]">
          <DataTables columns={columns} data={payments} filterBy="name" />
        </div> */}
        </div>
      </section>
    </ProtectedRoute>
  );
}
