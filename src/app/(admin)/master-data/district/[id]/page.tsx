"use client";

import useSWR from "swr";
import FormDistrict from "../../../../../components/Form/District";
import { fetcher } from "../../../../../constants/fetcher";

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
    <section className="pl-64 pr-10 pt-32">
      <h1 className="text-xl font-semibold text-primaryy mb-3">
        Tambah Kecamatan
      </h1>
      <FormDistrict type="update" label="Ubah" data={result} />
    </section>
  );
}
