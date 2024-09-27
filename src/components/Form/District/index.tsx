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

const formSchema = z.object({
  name: z.string({
    message: "nama kecamatan wajib diisi",
  }),
  camat: z.string({
    message: "camat wajib diisi",
  }),
  telp: z.string({
    message: "no telp wajib diisi",
  }),
  alamat: z.string({
    message: "alamat wajib diisi",
  }),
});

export default function FormDistrict({
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

  useEffect(() => {
    if (data) {
      form.reset({
        name: data.name,
        camat: data.camat,
        telp: data.telp,
        alamat: data.alamat,
      });
    }
  }, [data]);

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    const formData = {
      name: values.name,
      camat: values.camat,
      telp: values.telp,
      alamat: values.alamat,
    };

    if (type === "create") {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/kecamatan/create`,
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
          router.push("/master-data/district");
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
          `${process.env.NEXT_PUBLIC_API_URL}/kecamatan/update/${data.id}`,
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
          router.push("/master-data/district");
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
              <FormLabel>Nama Kecamatan</FormLabel>
              <FormControl>
                <Input
                  placeholder="Masukkan nama kecamatan"
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
          name="camat"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Camat</FormLabel>
              <FormControl>
                <Input
                  placeholder="Masukkan camat"
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
        <div className="flex justify-end">
          <Button className="rounded-full bg-primaryy" disabled={isLoading}>
            {isLoading ? "Loading ..." : label}
          </Button>
        </div>
      </form>
    </Form>
  );
}
