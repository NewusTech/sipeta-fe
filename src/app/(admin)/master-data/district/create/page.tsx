import ProtectedRoute from "@/components/ProtectedRoute";
import FormDistrict from "../../../../../components/Form/District";

export default function CreateDistrictPage() {
  return (
    <ProtectedRoute roles={["Super Admin", "Verifikator", "Surveyor"]}>
      <section className="md:pl-64 pl-10 pr-10 md:pt-32 pt-10">
        <h1 className="text-xl font-semibold text-primaryy mb-3">
          Tambah Kecamatan
        </h1>
        <FormDistrict type="create" label="Tambah" />
      </section>
    </ProtectedRoute>
  );
}
