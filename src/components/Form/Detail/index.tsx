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
import { useState } from "react";
import useSWR from "swr";
import { fetcherWithoutAuth } from "constants/fetcher";

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
  idToponim: z.number({
    required_error: "Pilih id toponim",
  }),
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
  elevationValue: z.string({
    message: "Masukkan nilai ketinggian",
  }),
  accuration: z.string({
    message: "Masukkan akurasi",
  }),
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

export default function DetailForm() {
  const [step, setStep] = useState(1);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const { data: classify } = useSWR<any>(
    `${apiUrl}/datatoponim/get`,
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

  // 2. Define a submit handler.
  function onSubmit(data: z.infer<typeof formSchema>) {
    toast({
      title: "You submitted the following values:",
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    });
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
              name="idToponim"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Id Toponim</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          className={cn(
                            "w-full justify-between rounded-full",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value
                            ? newClassify?.find(
                                (language: any) =>
                                  language.value === field.value
                              )?.label
                            : "Pilih id toponim"}
                          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0">
                      <Command>
                        <CommandInput placeholder="Cari tipe geometri..." />
                        <CommandList>
                          <CommandEmpty>No language found.</CommandEmpty>
                          <CommandGroup>
                            {newClassify?.map((language: any) => (
                              <CommandItem
                                value={language.label}
                                key={language.value}
                                onSelect={() => {
                                  form.setValue("idToponim", language.value);
                                }}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    language.value === field.value
                                      ? "opacity-100"
                                      : "opacity-0"
                                  )}
                                />
                                {language.label}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="zonaUTM"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Zona UTM</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="shadcn"
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
                      placeholder="shadcn"
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
                      placeholder="shadcn"
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
                      placeholder="shadcn"
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
                      placeholder="shadcn"
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
              name="languageFrom"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Asal Bahasa</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="shadcn"
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
              name="nameMeaning"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Arti Nama</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="shadcn"
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
                      placeholder="shadcn"
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
                      placeholder="shadcn"
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
                      placeholder="shadcn"
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
                      placeholder="shadcn"
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
              name="spelling"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ejaan</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="shadcn"
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
              name="elevationValue"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nilai Ketinggian</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="shadcn"
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
              name="accuration"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Akurasi</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="shadcn"
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
              name="source"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Narasumber</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="shadcn"
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
                      placeholder="shadcn"
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
                      placeholder="shadcn"
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
              <Button type="submit" className="rounded-full bg-primaryy">
                Submit
              </Button>
            </div>
          </>
        )}
      </form>
    </Form>
  );
}
