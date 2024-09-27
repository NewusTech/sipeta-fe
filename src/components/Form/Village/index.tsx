"use client";

import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../ui/form";
import { Input } from "../../ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "../../ui/button";
import Cookies from "js-cookie";
import Swal from "sweetalert2";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Check, ChevronDown } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../../ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "../../ui/popover";
import { cn } from "../../../lib/utils";
import { fetcherWithoutAuth } from "../../../constants/fetcher";
import useSWR from "swr";

const formSchema = z.object({
  name: z.string({
    message: "nama kecamatan wajib diisi",
  }),
  kepala: z.string({
    message: "camat wajib diisi",
  }),
  telp: z.string({
    message: "no telp wajib diisi",
  }),
  alamat: z.string({
    message: "alamat wajib diisi",
  }),
  kecamatanId: z.string({
    required_error: "pilih kecamatan",
  }),
});

export default function FormVillage({
  type,
  label,
  data,
}: {
  type: "create" | "update";
  label: string;
  data?: any;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const { data: district } = useSWR<any>(
    `${process.env.NEXT_PUBLIC_API_URL}/kecamatan/get?limit=50`,
    fetcherWithoutAuth
  );

  const districtData = district?.data;
  const newDistrict = districtData?.map(
    (item: { id: number; name: string }) => ({
      value: item.id.toString(), // id masuk ke value
      label: item.name, // name masuk ke label
    })
  );

  useEffect(() => {
    if (data) {
      form.reset({
        name: data.name,
        kepala: data.kepala,
        telp: data.telp,
        alamat: data.alamat,
        kecamatanId: data.kecamatan_id.toString(),
      });
    }
  }, [data]);

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    const formData = {
      name: values.name,
      kepala: values.kepala,
      telp: values.telp,
      alamat: values.alamat,
      kecamatan_id: values.kecamatanId,
    };

    console.log(formData);

    if (type === "create") {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/desa/create`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${Cookies.get("token")}`,
            },
            body: JSON.stringify(formData),
          }
        );
        const responseData = await response.json();

        if (response.ok) {
          Swal.fire({
            icon: "success",
            title: `${responseData.message}`,
            timer: 2000,
            showConfirmButton: false,
            position: "center",
          });
          router.push("/master-data/village");
        }
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Gagal submit",
          timer: 2000,
          showConfirmButton: false,
          position: "center",
        });
      } finally {
        setIsLoading(false);
      }
    } else {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/desa/update/${data.id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${Cookies.get("token")}`,
            },
            body: JSON.stringify(formData),
          }
        );
        const responseData = await response.json();

        if (response.ok) {
          Swal.fire({
            icon: "success",
            title: `${responseData.message}`,
            timer: 2000,
            showConfirmButton: false,
            position: "center",
          });
          router.push("/master-data/village");
        }
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Gagal submit",
          timer: 2000,
          showConfirmButton: false,
          position: "center",
        });
      } finally {
        setIsLoading(false);
      }
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-5">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nama Desa</FormLabel>
              <FormControl>
                <Input
                  placeholder="Masukkan nama desa"
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
          name="kepala"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Kepala / Lurah</FormLabel>
              <FormControl>
                <Input
                  placeholder="Masukkan Kepala / Lurah"
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
            <FormItem className="flex flex-col">
              <FormLabel>Telepon</FormLabel>
              <FormControl>
                <Input
                  placeholder="Masukkan no telp"
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
          name="alamat"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Alamat</FormLabel>
              <FormControl>
                <Input
                  placeholder="Masukkan alamat"
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
          name="kecamatanId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Kecamatan</FormLabel>
              <div>
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
                          ? newDistrict?.find(
                              (district: any) =>
                                district.value.toString() ===
                                field.value.toString()
                            )?.label
                          : "Pilih kecamatan"}
                        <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-[200px] p-0">
                    <Command>
                      <CommandInput placeholder="Cari kecamatan" />
                      <CommandList>
                        <CommandEmpty>No language found.</CommandEmpty>
                        <CommandGroup>
                          {newDistrict?.map((district: any) => (
                            <CommandItem
                              value={district.label}
                              key={district.value}
                              onSelect={() => {
                                form.setValue("kecamatanId", district.value);
                              }}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  district.value === field.value
                                    ? "opacity-100"
                                    : "opacity-0"
                                )}
                              />
                              {district.label}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end">
          <Button className="rounded-full bg-primaryy">
            {isLoading ? "Loading ..." : label}
          </Button>
        </div>
      </form>
    </Form>
  );
}
