"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../../ui/alert-dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Pen, PenBox } from "lucide-react";
import Cookies from "js-cookie";
import Swal from "sweetalert2";
import useSWR from "swr";
import { fetcher } from "constants/fetcher";

const adminValidation = z.object({
  username: z
    .string()
    .min(16, "username harus 16 karakter")
    .max(16, "username harus 16 karakter"),
  name: z.string(),
});

const adminUpdateValidation = z.object({
  username: z
    .string()
    .min(16, "username harus 16 karakter")
    .max(16, "username harus 16 karakter"),
  name: z.string(),
});

export function CreateSurveyorDialog() {
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleOpenAddModal = () => {
    setAddModalOpen(true);
  };

  const handleAddModalClose = () => {
    setAddModalOpen(false);
  };

  const form = useForm<z.infer<typeof adminValidation>>({
    resolver: zodResolver(adminValidation),
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof adminValidation>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    setIsLoading(true);
    const formData = {
      nik: values.username,
      name: values.name,
      role_id: 3,
    };

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/userinfo/create`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${Cookies.get("token")}`,
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      console.log(data);

      if (response.ok) {
        Swal.fire({
          icon: "success",
          title: `${data.message}`,
          timer: 2000,
          showConfirmButton: false,
          position: "center",
        });
        handleAddModalClose();
        window.location.reload();
      }
    } catch (e: any) {
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

  return (
    <AlertDialog open={addModalOpen}>
      <AlertDialogTrigger asChild>
        <Button
          onClick={handleOpenAddModal}
          size="xs"
          className="text-white mt-4 rounded-full bg-primaryy "
        >
          Tambah
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="text-primaryy">Tambah</AlertDialogTitle>
        </AlertDialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Masukkan username"
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
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nama</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Masukkan nama"
                      className="rounded-full"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Tombol Aksi */}
            <AlertDialogFooter>
              <AlertDialogAction
                type="submit"
                disabled={isLoading}
                className="bg-primaryy rounded-full mt-2 md:mt-0"
              >
                {isLoading ? "Loading ..." : "Simpan"}
              </AlertDialogAction>
              <AlertDialogCancel
                onClick={handleAddModalClose}
                className="bg-transparent text-primaryy border border-primaryy hover:bg-primaryy hover:text-white rounded-full"
              >
                Batal
              </AlertDialogCancel>
            </AlertDialogFooter>
          </form>
        </Form>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export function UpdateSurveyorDialog({
  slug,
  type,
}: {
  slug?: string;
  type?: string;
}) {
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { data } = useSWR<any>(
    `${process.env.NEXT_PUBLIC_API_URL}/userinfo/get/${slug}`,
    fetcher
  );

  const result = data?.data;

  const handleOpenAddModal = () => {
    setAddModalOpen(true);
  };

  const handleAddModalClose = () => {
    setAddModalOpen(false);
  };

  const form = useForm<z.infer<typeof adminUpdateValidation>>({
    resolver: zodResolver(adminUpdateValidation),
  });

  useEffect(() => {
    if (result) {
      form.reset({
        username: result.nik,
        name: result.name,
      });
    }
  }, [result]);

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof adminUpdateValidation>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    setIsLoading(true);

    let pw;

    const formData = {
      nik: values.username,
      name: values.name,
    };

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/userinfo/update/${slug}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${Cookies.get("token")}`,
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();
      console.log(data);

      if (response.ok) {
        Swal.fire({
          icon: "success",
          title: `${data.message}`,
          timer: 2000,
          showConfirmButton: false,
          position: "center",
        });
        handleAddModalClose();
        window.location.reload();
      }
    } catch (e: any) {
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

  return (
    <AlertDialog open={addModalOpen}>
      <AlertDialogTrigger asChild>
        {type === "mobile" ? (
          <div className="cursor-pointer" onClick={handleOpenAddModal}>
            <PenBox className="w-6 h-6" />
          </div>
        ) : (
          <div
            onClick={handleOpenAddModal}
            className="py-1 px-2 flex justify-center items-center w-7 bg-orange-400 hover:bg-orange-500 rounded-sm cursor-pointer"
          >
            <Pen className="w-5 h-5 text-white" />
          </div>
        )}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="text-primaryy">Tambah</AlertDialogTitle>
        </AlertDialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Masukkan username"
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
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nama</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Masukkan nama"
                      className="rounded-full"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Tombol Aksi */}
            <AlertDialogFooter>
              <AlertDialogAction
                type="submit"
                className="bg-primaryy rounded-full mt-2 md:mt-0"
                disabled={isLoading}
              >
                {isLoading ? "Loading ..." : "Simpan"}
              </AlertDialogAction>
              <AlertDialogCancel
                onClick={handleAddModalClose}
                className="bg-transparent text-primaryy border border-primaryy hover:bg-primaryy hover:text-white rounded-full"
              >
                Batal
              </AlertDialogCancel>
            </AlertDialogFooter>
          </form>
        </Form>
      </AlertDialogContent>
    </AlertDialog>
  );
}
