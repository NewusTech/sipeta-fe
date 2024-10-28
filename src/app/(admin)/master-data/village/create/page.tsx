import ProtectedRoute from "@/components/ProtectedRoute";
import FormVillage from "../../../../../components/Form/Village";

export default function CreateVillagePage() {
  return (
    <ProtectedRoute roles={["Super Admin", "Verifikator", "Surveyor"]}>
      <section className="md:pl-64 pl-10 pr-10 md:pt-32 pt-10">
        <h1 className="text-xl font-semibold text-primaryy mb-3">
          Tambah Desa
        </h1>
        <FormVillage type="create" label="Tambah" />
      </section>
    </ProtectedRoute>
  );
}
