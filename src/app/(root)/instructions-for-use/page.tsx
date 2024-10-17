"use client";

import { fetcherWithoutAuth } from "../../../constants/fetcher";
import useSWR from "swr";

export default function InstructionsForUsePage() {
  const { data } = useSWR<any>(
    `${process.env.NEXT_PUBLIC_API_URL}/manualbook/get`,
    fetcherWithoutAuth
  );

  const manualBook = data?.data;

  return (
    <section className="container mx-auto py-10">
      <div className="grid md:grid-cols-3 grid-cols-1 gap-x-5">
        {manualBook?.map((v: any) => (
          <div key={v.id} className="text-center space-y-4">
            <h1 className="font-bold">{v.tipe}</h1>
            {v.dokumen ? (
              <div className="w-full h-[462px] bg-slate-100 rounded-xl">
                <iframe
                  allowFullScreen
                  src={v.dokumen}
                  title={v.tipe}
                  className="rounded-xl w-full h-full"
                >
                  {v.id}
                </iframe>
              </div>
            ) : (
              <div className="w-full h-[462px] bg-slate-100 flex justify-center items-center rounded-xl">
                <p className="text-slate-400">Belum ada dokumen</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
