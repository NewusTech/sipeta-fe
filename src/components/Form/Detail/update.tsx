"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { cn } from "../../../lib/utils";
import { Button } from "../../ui/button";
import { toast } from "../../../hooks/use-toast";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../ui/form";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../../ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "../../ui/popover";
import { Input } from "../../ui/input";
import { Check, ChevronDown } from "lucide-react";
import { useEffect, useState } from "react";
import useSWR from "swr";
import { fetcherWithoutAuth } from "constants/fetcher";
import Cookies from "js-cookie";
import Swal from "sweetalert2";

const languages = [
  { label: "English", value: "en" },
  { label: "French", value: "fr" },
  { label: "German", value: "de" },
  { label: "Spanish", value: "es" },
  { label: "Portuguese", value: "pt" },
  { label: "Russian", value: "ru" },
  { label: "Japanese", value: "ja" },
  { label: "Korean", value: "ko" },
  { label: "Chinese", value: "zh" },
] as const;

const formSchema = z.object({
  zonaUTM: z.string({
    message: "Masukkan zona utm",
  }),
  nlp: z.string({
    message: "Masukkan nlp",
  }),
  lcode: z.string({
    message: "Masukkan lcode",
  }),
  gazeterName: z.string({
    message: "Masukkan nama gazeter",
  }),
  otherName: z.string({
    message: "Masukkan nama lain",
  }),
  languageFrom: z.string({
    message: "Masukkan asal bahasa",
  }),
  nameMeaning: z.string({
    message: "Masukkan arti nama",
  }),
  nameHistory: z.string({
    message: "Masukkan sejarah nama",
  }),
  before: z.string({
    message: "Masukkan nama sebelumnya",
  }),
  recommend: z.string({
    message: "Masukkan nama rekomendasi",
  }),
  speech: z.string({
    message: "Masukkan ucapan",
  }),
  spelling: z.string({
    message: "Masukkan ejaan",
  }),
  elevationValue: z
    .string({
      message: "Masukkan nilai ketinggian",
    })
    .optional(),
  accuration: z
    .string({
      message: "Masukkan akurasi",
    })
    .optional(),
  source: z.string({
    message: "Masukkan narasumber",
  }),
  dataSource: z.string({
    message: "Masukkan sumber data",
  }),
  note: z.string({
    message: "Masukkan catatan",
  }),
});

export default function DetailFormUpdate({ data, id }: { data: any; id: any }) {
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const { data: classify } = useSWR<any>(
    `${apiUrl}/datatoponim/get-dashboard?limit=100000`,
    fetcherWithoutAuth
  );

  const classifyData = classify?.data;
  const newClassify = classifyData?.map(
    (item: { id: number; id_toponim: string }) => ({
      value: item.id, // id masuk ke value
      label: item.id_toponim, // name masuk ke label
    })
  );

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  useEffect(() => {
    if (data) {
      form.reset({
        zonaUTM: data.zona_utm,
        nlp: data.nlp,
        lcode: data.lcode,
        gazeterName: data.nama_gazeter,
        otherName: data.nama_lain,
        languageFrom: data.asal_bahasa,
        nameMeaning: data.arti_nama,
        nameHistory: data.sejarah_nama,
        before: data.nama_sebelumnya,
        recommend: data.nama_rekomendasi,
        speech: data.ucapan,
        spelling: data.ejaan,
        elevationValue: data?.nilai_ketinggian?.toString(),
        accuration: data?.akurasi?.toString(),
        source: data.narasumber,
        dataSource: data.sumber_data,
        note: data.catatan,
      });
    }
  }, [data]);

  console.log(id);

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    // setIsLoading(true);
    const formData = {
      datatoponim_id: Number(id),
      zona_utm: values.zonaUTM,
      nlp: values.nlp,
      lcode: values.lcode,
      nama_gazeter: values.gazeterName,
      nama_lain: values.otherName,
      asal_bahasa: values.languageFrom,
      arti_nama: values.nameMeaning,
      sejarah_nama: values.nameHistory,
      nama_sebelumnya: values.before,
      nama_rekomendasi: values.recommend,
      ucapan: values.speech,
      ejaan: values.spelling,
      nilai_ketinggian: Number(values.elevationValue),
      akurasi: Number(values.accuration),
      narasumber: values.source,
      sumber_data: values.dataSource,
      catatan: values.note,
    };

    console.log(formData);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/detailtoponim/input`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${Cookies.get("token")}`,
          },
          body: JSON.stringify(formData),
        }
      );
      const res = await response.json();
      console.log(res);
      if (response.ok) {
        Swal.fire({
          icon: "success",
          title: `${res.message}`,
          timer: 2000,
          showConfirmButton: false,
          position: "center",
        });
      }
    } catch (e) {
      Swal.fire({
        icon: "error",
        title: "Gagal submit!",
        timer: 2000,
        showConfirmButton: false,
        position: "center",
      });
    } finally {
      setIsLoading(false);
    }
  }

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-5">
        {step === 1 && (
          <>
            {/* Step 1 Fields */}
            <FormField
              control={form.control}
              name="zonaUTM"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Zona UTM</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="MAsukkan zona UTM"
                      className="rounded-full"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="nlp"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>NLP</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Masukkan NLP"
                      className="rounded-full"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="lcode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>LCODE</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Masukkan LCODE"
                      className="rounded-full"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="gazeterName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nama Gazeter</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Masukkan nama gazeter"
                      className="rounded-full"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="otherName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nama Lain</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Masukkan nama lain"
                      className="rounded-full"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="languageFrom"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Asal Bahasa</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Masukkan asal bahasa"
                      className="rounded-full"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end">
              <Button
                onClick={nextStep}
                className="bg-primaryy rounded-full"
                type="button"
              >
                Next
              </Button>
            </div>
          </>
        )}

        {step === 2 && (
          <>
            {/* Step 2 Fields */}
            <FormField
              control={form.control}
              name="nameMeaning"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Arti Nama</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Masukkan arti nama"
                      className="rounded-full"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="nameHistory"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sejarah Nama</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Masukkan sejarah nama"
                      className="rounded-full"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="before"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nama Sebelumnya</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Masukkan nama sebelumnya"
                      className="rounded-full"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="recommend"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nama Rekomendasi</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Masukkan nama rekomendasi"
                      className="rounded-full"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="speech"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ucapan</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Masukkan ucapan"
                      className="rounded-full"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="spelling"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ejaan</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Masukkan ejaan"
                      className="rounded-full"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex space-x-2 justify-between">
              <Button
                onClick={prevStep}
                className="rounded-full bg-transparent border border-primaryy text-primaryy hover:bg-primaryy hover:text-white"
                type="button"
              >
                Previous
              </Button>
              <Button
                type="button"
                onClick={nextStep}
                className="rounded-full bg-primaryy"
              >
                Next
              </Button>
            </div>
          </>
        )}
        {step === 3 && (
          <>
            {/* Step 2 Fields */}
            <FormField
              control={form.control}
              name="elevationValue"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nilai Ketinggian</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Masukkan nilai ketinggian"
                      className="rounded-full"
                      type="number"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="accuration"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Akurasi</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Masukkan akurasi"
                      className="rounded-full"
                      type="number"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="source"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Narasumber</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Masukkan narasumber"
                      className="rounded-full"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="dataSource"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sumber Data</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Masukkan sumber data"
                      className="rounded-full"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="note"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Catatan</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Masukkan catatan"
                      className="rounded-full"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex space-x-2 justify-between">
              <Button
                onClick={prevStep}
                className="rounded-full bg-transparent border border-primaryy text-primaryy hover:bg-primaryy hover:text-white"
                type="button"
              >
                Previous
              </Button>
              <Button
                type="submit"
                className="rounded-full bg-primaryy"
                disabled={isLoading}
              >
                {isLoading ? "Loading..." : "Submit"}
              </Button>
            </div>
          </>
        )}
      </form>
    </Form>
  );
}
