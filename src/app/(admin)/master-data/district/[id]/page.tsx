"use client";

import useSWR from "swr";
import FormDistrict from "../../../../../components/Form/District";
import { fetcher } from "../../../../../constants/fetcher";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function UpdateDistrictPage({
  params,
}: {
  params: { id: number };
}) {
  const { data } = useSWR<any>(
    `${process.env.NEXT_PUBLIC_API_URL}/kecamatan/get/${params.id}`,
    fetcher
  );

  const result = data?.data;

  return (
    <ProtectedRoute roles={["Super Admin", "Verifikator", "Surveyor"]}>
      <section className="md:pl-64 pl-10 pr-10 md:pt-32 pt-10">
        <h1 className="text-xl font-semibold text-primaryy mb-3">
          Tambah Kecamatan
        </h1>
        <FormDistrict type="update" label="Ubah" data={result} />
      </section>
    </ProtectedRoute>
  );
}
