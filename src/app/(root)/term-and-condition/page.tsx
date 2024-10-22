"use client";

import { RichTextDisplay } from "@/components/RichTextDisplay";
import { fetcherWithoutAuth } from "constants/fetcher";
import useSWR from "swr";

export default function TermAndConditionPage() {
  const { data } = useSWR<any>(
    `${process.env.NEXT_PUBLIC_API_URL}/termcond`,
    fetcherWithoutAuth
  );
  const result = data?.data;

  return (
    <section className="container mx-auto my-5">
      <RichTextDisplay content={result?.desc} />
    </section>
  );
}
