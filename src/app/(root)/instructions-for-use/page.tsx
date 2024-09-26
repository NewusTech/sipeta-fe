"use client";

import { fetcherWithoutAuth } from "@/constants/fetcher";
import useSWR from "swr";

export default function InstructionsForUsePage() {
  const { data } = useSWR<any>(
    `${process.env.NEXT_PUBLIC_API_URL}/manualbook/get`,
    fetcherWithoutAuth
  );

  const manualBook = data?.data;

  console.log(manualBook);

  return (
    <section className="container mx-auto py-10">
      <div className="grid grid-cols-3 gap-x-5">
        {manualBook?.map((v: any) => (
          <div key={v.id} className="text-center space-y-4">
            <h1>{v.tipe}</h1>
            <div className="w-full h-[462px] bg-greyy ">
              <iframe
                allowFullScreen
                src={v.dokumen}
                title={v.tipe}
                className="rounded-xl w-full h-full"
              >
                {v.id}
              </iframe>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
