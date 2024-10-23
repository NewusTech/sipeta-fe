"use client";

import { RichTextDisplay } from "@/components/RichTextDisplay";
import { fetcherWithoutAuth } from "constants/fetcher";
import useSWR from "swr";

export default function TermAndConditionsPage() {
  const { data } = useSWR<any>(
    `${process.env.NEXT_PUBLIC_API_URL}/termcond`,
    fetcherWithoutAuth
  );
  const result = data?.data;

  return (
    <section className="container mx-auto my-5">
      {result && <RichTextDisplay content={result?.desc} />}
    </section>
  );
}
