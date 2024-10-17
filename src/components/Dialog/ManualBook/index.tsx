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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Cookies from "js-cookie";
import Swal from "sweetalert2";
import { Input } from "@/components/ui/input";
import { Loader } from "lucide-react";
import { fetcher } from "constants/fetcher";
import useSWR from "swr";

const FileValidation = z.object({
  file: z.any(),
});

export default function UploadFileManualBook({ id }: { id: number }) {
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { data } = useSWR<any>(
    `${process.env.NEXT_PUBLIC_API_URL}/manualbook/get/${id}`,
    fetcher
  );

  const result = data?.data;

  const handleOpenAddModal = () => {
    setAddModalOpen(true);
  };

  const handleAddModalClose = () => {
    setAddModalOpen(false);
  };

  const form = useForm<z.infer<typeof FileValidation>>({
    resolver: zodResolver(FileValidation),
  });

  const fileRef = form.register("file");

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof FileValidation>) {
    setIsLoading(true);
    const formData = new FormData();

    if (values.file && values.file.length > 0) {
      formData.append("manualbook", values.file[0]);
    }

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/manualbook/update/${id}`,
        {
          method: "PUT",
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
          className="cursor-pointer w-full px-3 py-1 rounded hover:bg-slate-100"
        >
          <p className="text-sm">Ubah</p>
        </div>
      </AlertDialogTrigger>
      <AlertDialogContent className="p-0 border-0 overflow-auto">
        <AlertDialogHeader className="bg-primaryy px-9 py-6">
          <AlertDialogTitle className="font-normal text-neutral-50 text-2xl">
            Update file manual book {result?.tipe}
          </AlertDialogTitle>
        </AlertDialogHeader>
        <div className="p-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="file"
                render={() => (
                  <FormItem className="space-y-3">
                    <FormLabel>File</FormLabel>
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
                  {isLoading ? <Loader className="animate-spin" /> : "Ubah"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </form>
          </Form>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}
