import FormVillage from "../../../../../components/Form/Village";

export default function CreateVillagePage() {
  return (
    <section className="pl-64 pr-10 pt-32">
      <h1 className="text-xl font-semibold text-primaryy mb-3">Tambah Desa</h1>
      <FormVillage type="create" label="Tambah" />
    </section>
  );
}
