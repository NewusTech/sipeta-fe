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
import Swal from "sweetalert2";
import Cookies from "js-cookie";
import { OpenState } from "types/types";

const languages = [
  { label: "Titik/Point", value: "1" },
  { label: "Area/Polygon", value: "2" },
  { label: "Garis/Line String", value: "3" },
] as const;

const formSchema = z.object({
  idToponim: z
    .string({
      message: "Mauskann ID Toponim",
    })
    .optional(),
  typeGemoetry: z
    .string({
      required_error: "Pilih tipe geometri.",
    })
    .optional(),
  classcificationToponim: z
    .number({
      required_error: "Pilih klasifikasi toponim.",
    })
    .optional(),
  unsur: z
    .number({
      required_error: "Pilih unsur.",
    })
    .optional(),
  district: z
    .string({
      message: "Masukkan kecamatan.",
    })
    .optional(),
  village: z
    .string({
      message: "Masukkan desa.",
    })
    .optional(),
  name: z
    .string({
      message: "Masukkan nama lokal.",
    })
    .optional(),
  nameSpesific: z
    .string({
      message: "Masukkan nama spesifik.",
    })
    .optional(),
  nameMap: z
    .string({
      message: "Masukan nama peta.",
    })
    .optional(),
  mainCoordinat: z
    .string({
      message: "Masukan koordinat utama.",
    })
    .optional(),
  latLong: z
    .any({
      message: "Masukan koordinat utama.",
    })
    .optional(),
  lat: z
    .string({
      message: "Masukan garis bujur.",
    })
    .optional(),
  long: z
    .string({
      message: "Masukkan garis lintang.",
    })
    .optional(),
  headOf: z
    .any({
      message: "Masukkan kepala.",
    })
    .optional()
    .nullable(),
  sekretaris: z
    .any({
      message: "Masukkan sekretaris.",
    })
    .optional()
    .nullable(),
  email: z
    .any({
      message: "Masukkan email.",
    })
    .optional()
    .nullable(),
  telp: z
    .any({
      message: "Masukkan no telepon.",
    })
    .optional()
    .nullable(),
});

interface LocationDetails {
  kecamatan: string;
  desa: string;
  dms: string;
  lat: string;
  lng: string;
}

export default function InformationFormUpdate({
  locationDetails,
  data,
  onTypeGeometryChange,
  polyString,
}: {
  data: any;
  polyString: string;
  locationDetails: LocationDetails;
  onTypeGeometryChange: (newType: string) => void;
}) {
  const [step, setStep] = useState(1);
  const [valueClassify, setValueClassify] = useState<any>({ id: 0, label: "" });
  const [valueUnsur, setValueUnsur] = useState<any>({ id: 0, label: "" });
  const [dataResult, setDataResult] = useState<any>([]); // State untuk menyimpan hasil
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState<OpenState>({
    popover1: false, // State untuk popover pertama
    popover2: false, // Jika ada popover kedua, misalnya
    popover3: false, // Jika ada popover ketiga, misalnya
  });

  const toggleOpen = (key: keyof OpenState) => {
    setOpen((prev) => ({ ...prev, [key]: !prev[key] }));
  };
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const { data: classify } = useSWR<any>(
    `${apiUrl}/klasifikasi/get`,
    fetcherWithoutAuth
  );
  const { data: unsur } = useSWR<any>(
    `${apiUrl}/unsur/get`,
    fetcherWithoutAuth
  );
  const classifyData = classify?.data;
  const unsurData = unsur?.data;
  const newClassify = classifyData?.map(
    (item: { id: number; name: string }) => ({
      value: item.id, // id masuk ke value
      label: item.name, // name masuk ke label
    })
  );
  const newUnsur = unsurData?.map((item: { id: number; name: string }) => ({
    value: item.id, // id masuk ke value
    label: item.name, // name masuk ke label
  }));

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  useEffect(() => {
    let newPolyString;

    if (
      form.getValues("typeGemoetry") === "2" ||
      form.getValues("typeGemoetry") === "3"
    ) {
      newPolyString = polyString;
    } else {
      newPolyString = `${data.bujur}, ${data.lintang}`;
    }

    if (locationDetails || data) {
      form.reset({
        idToponim: data?.id_toponim || "6091821",
        district: locationDetails.kecamatan || data?.kecamatanName,
        village: locationDetails.desa || data?.desaName,
        mainCoordinat: locationDetails.dms || data?.koordinat,
        latLong: newPolyString,
        lat: locationDetails.lat || data?.bujur,
        long: locationDetails.lng || data?.lintang,
        typeGemoetry: data?.tipe_geometri?.toString(),
        classcificationToponim: data?.klasifikasi_id,
        unsur: data?.unsur_id,
        name: data?.nama_lokal,
        nameSpesific: data?.nama_spesifik,
        nameMap: data?.nama_peta,
        headOf: data?.kepala,
        sekretaris: data?.sekretaris,
        email: data?.email,
        telp: data?.telp,
      });
    }
  }, [locationDetails, data]);

  console.log(polyString);

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);

    let headOf;
    let sekretaris;
    let email;
    let telp;

    if (values.headOf) {
      headOf = values.headOf;
    }

    if (values.sekretaris) {
      sekretaris = values.sekretaris;
    }

    if (values.email) {
      email = values.email;
    }

    if (values.telp) {
      telp = values.telp;
    }

    const formData = {
      id_toponim: values.idToponim || "6091821",
      tipe_geometri: values.typeGemoetry,
      klasifikasi_id: values.classcificationToponim,
      unsur_id: values.unsur,
      nama_lokal: values.name,
      nama_spesifik: values.nameSpesific,
      nama_peta: values.nameMap,
      koordinat: values.mainCoordinat,
      latlong: values.latLong,
      bujur: values.lat,
      lintang: values.long,
      desa: values.village,
      kecamatan: values.district,
      kepala: headOf,
      sekretaris: sekretaris,
      email: email,
      telp: telp,
    };

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/datatoponim/update/${data?.id}`,
        {
          method: "PUT",
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
    } catch (e: any) {
      Swal.fire({
        icon: "error",
        title: "Gagal delete!",
        timer: 2000,
        showConfirmButton: false,
        position: "center",
      });
    } finally {
      setIsLoading(false);
    }
  }

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
                <FormItem>
                  <FormLabel>Id Toponim</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Id toponim"
                      className="rounded-full"
                      {...field}
                      disabled
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="typeGemoetry"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Tipe Geometri</FormLabel>
                  <Popover
                    open={open.popover1}
                    onOpenChange={() => toggleOpen("popover1")}
                  >
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
                            ? languages.find(
                                (language) => language.value === field.value
                              )?.label
                            : "Pilih tipe geometri"}
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
                            {languages.map((language) => (
                              <CommandItem
                                value={language.label}
                                key={language.value}
                                onSelect={() => {
                                  form.setValue("typeGemoetry", language.value);
                                  onTypeGeometryChange(language.value);
                                  toggleOpen("popover1");
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
              name="classcificationToponim"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Klasifikasi Toponim</FormLabel>
                  <Popover
                    open={open.popover2}
                    onOpenChange={() => toggleOpen("popover2")}
                  >
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
                            : "Pilih klasifikasi"}
                          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0">
                      <Command>
                        <CommandInput placeholder="Cari klasifikasi..." />
                        <CommandList>
                          <CommandEmpty>
                            Klasifikasi tidak ditemukan.
                          </CommandEmpty>
                          <CommandGroup>
                            {newClassify?.map((language: any) => (
                              <CommandItem
                                value={language.label}
                                key={language.value}
                                onSelect={() => {
                                  form.setValue(
                                    "classcificationToponim",
                                    language.value
                                  );
                                  toggleOpen("popover2");
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
              name="unsur"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Unsur</FormLabel>
                  <Popover
                    open={open.popover3}
                    onOpenChange={() => toggleOpen("popover3")}
                  >
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
                            ? newUnsur?.find(
                                (language: any) =>
                                  language.value === field.value
                              )?.label
                            : "Pilih unsur"}
                          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0">
                      <Command>
                        <CommandInput placeholder="Cari unsur..." />
                        <CommandList>
                          <CommandEmpty>Unsur tidak ditemukan.</CommandEmpty>
                          <CommandGroup>
                            {newUnsur?.map((language: any) => (
                              <CommandItem
                                value={language.label}
                                key={language.value}
                                onSelect={() => {
                                  form.setValue("unsur", language.value);
                                  toggleOpen("popover3");
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
              name="district"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Kecamatan</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Kecamatan"
                      className="rounded-full"
                      {...field}
                      disabled
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="village"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Desa</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Desa"
                      className="rounded-full"
                      {...field}
                      disabled
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
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nama Lokal</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Masukkan nama lokal"
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
              name="nameSpesific"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nama Spesifik</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Masukkan nama spesifik"
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
              name="nameMap"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nama Peta</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Masukkan nama peta"
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
              name="mainCoordinat"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Koordinat Utama</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Koordinat Utama"
                      className="rounded-full"
                      {...field}
                      disabled
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="latLong"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Koordinat</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Koordinat"
                      className="rounded-full"
                      {...field}
                      disabled
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="lat"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Lintang</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Lintang"
                      className="rounded-full"
                      {...field}
                      disabled
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
                onClick={nextStep}
                className="bg-primaryy rounded-full"
                type="button"
              >
                Next
              </Button>
            </div>
          </>
        )}
        {step === 3 && (
          <>
            <FormField
              control={form.control}
              name="long"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bujur</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Bujur"
                      className="rounded-full"
                      {...field}
                      disabled
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {form.getValues("classcificationToponim") === 6 && (
              <>
                <FormField
                  control={form.control}
                  name="headOf"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Kepala</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Masukkan kepala"
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
                  name="sekretaris"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Sekretaris</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Masukkan sekretaris"
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
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Masukkan email"
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
                  name="telp"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>No Telepon</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Masukkan no telepon"
                          className="rounded-full"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}
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
                {isLoading ? "Loading ..." : "Submit"}
              </Button>
            </div>
          </>
        )}
      </form>
    </Form>
  );
}
