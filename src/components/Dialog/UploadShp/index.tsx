"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Loader } from "lucide-react";
import Cookies from "js-cookie";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import Swal from "sweetalert2";

const FileValidation = z.object({
  shp: z.any(),
  shx: z.any(),
  dbf: z.any(),
});

export default function UploadFileShpDialog() {
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleOpenAddModal = () => {
    setAddModalOpen(true);
  };

  const handleAddModalClose = () => {
    setAddModalOpen(false);
  };

  const form = useForm<z.infer<typeof FileValidation>>({
    resolver: zodResolver(FileValidation),
  });

  const fileRef = form.register("shp");
  const fileRefShx = form.register("shx");
  const fileRefDbf = form.register("dbf");

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof FileValidation>) {
    setIsLoading(true);
    const formData = new FormData();

    if (values.shp && values.shp.length > 0) {
      formData.append("shp", values.shp[0]);
    }

    if (values.shx && values.shx.length > 0) {
      formData.append("shx", values.shx[0]);
    }

    if (values.dbf && values.dbf.length > 0) {
      formData.append("dbf", values.dbf[0]);
    }

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/datatoponim/import-shp`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${Cookies.get("token")}`,
          },
          body: formData,
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
    } catch (error: any) {
      Swal.fire({
        icon: "error",
        title: "Gagal submit",
        timer: 2000,
        showConfirmButton: false,
        position: "center",
      });
    } finally {
      setIsLoading(false); // Stop loading
    }
  }

  return (
    <AlertDialog open={addModalOpen}>
      <AlertDialogTrigger asChild>
        <div
          onClick={handleOpenAddModal}
          className="hover:translate-x-2 text-primaryy duration-300 transition-all cursor-pointer w-full rounded"
        >
          <p className="text-sm">SHP</p>
        </div>
      </AlertDialogTrigger>
      <AlertDialogContent className="p-0 border-0 overflow-auto">
        <AlertDialogHeader className="bg-primaryy px-9 py-6">
          <AlertDialogTitle className="font-normal text-neutral-50 text-2xl">
            Impor Data Toponim SHP
          </AlertDialogTitle>
        </AlertDialogHeader>
        <div className="p-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="shp"
                render={() => (
                  <FormItem className="space-y-3">
                    <FormLabel>SHP</FormLabel>
                    <FormControl>
                      <Input
                        type="file"
                        className="rounded-full"
                        {...fileRef}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="shx"
                render={() => (
                  <FormItem className="space-y-3">
                    <FormLabel>SHX</FormLabel>
                    <FormControl>
                      <Input
                        type="file"
                        className="rounded-full"
                        {...fileRefShx}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="dbf"
                render={() => (
                  <FormItem className="space-y-3">
                    <FormLabel>DBF</FormLabel>
                    <FormControl>
                      <Input
                        type="file"
                        className="rounded-full"
                        {...fileRefDbf}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <AlertDialogFooter className="p-6">
                <AlertDialogCancel
                  onClick={handleAddModalClose}
                  className="bg-transparent border border-primaryy rounded-full hover:bg-primaryy hover:text-neutral-50 text-primaryy"
                >
                  Batal
                </AlertDialogCancel>
                <AlertDialogAction
                  type="submit"
                  className="bg-primaryy hover:bg-blue-700 rounded-full"
                  disabled={isLoading}
                >
                  {isLoading ? <Loader className="animate-spin" /> : "Impor"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </form>
          </Form>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}
