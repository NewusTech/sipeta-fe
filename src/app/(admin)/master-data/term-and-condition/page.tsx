import { DataTables2 } from "../../../../components/Datatables/table2";
import ProtectedRoute from "@/components/ProtectedRoute";
import { TnCDialog } from "@/components/Dialog/TermAndCondition";
import { District, columns } from "../../../../constants";

async function getData(): Promise<District> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/termcond`, {
    cache: "no-store",
  });
  const data = await res.json();
  return data.data;
}

export default async function TnCPage() {
  const data = await getData();
  const result: District[] = [data];

  return (
    <ProtectedRoute roles={["Super Admin"]}>
      <section className="md:pl-64 pl-10 pr-10 pt-10 md:pt-32">
        <div className="flex justify-between items-center mb-5">
          <h1 className="text-xl font-semibold text-primaryy mb-3">
            Term & Condition
          </h1>
          <TnCDialog />
        </div>
        <div>
          <DataTables2 columns={columns} filterBy="desc" data={result} />
        </div>
      </section>
    </ProtectedRoute>
  );
}
