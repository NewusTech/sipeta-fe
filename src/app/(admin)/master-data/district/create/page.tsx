import ProtectedRoute from "@/components/ProtectedRoute";
import FormDistrict from "../../../../../components/Form/District";

export default function CreateDistrictPage() {
  return (
    <ProtectedRoute roles={["Super Admin", "Verifikator", "Surveyor"]}>
      <section className="pl-64 pr-10 pt-32">
        <h1 className="text-xl font-semibold text-primaryy mb-3">
          Tambah Kecamatan
        </h1>
        <FormDistrict type="create" label="Tambah" />
      </section>
    </ProtectedRoute>
  );
}
