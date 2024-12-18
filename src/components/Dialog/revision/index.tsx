import Cookies from "js-cookie";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogTrigger,
} from "../../ui/alert-dialog";
import { Loader, PenBox } from "lucide-react";
import Swal from "sweetalert2";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "next/navigation";

const FormSchema = z.object({
  keterangan: z.string().min(10, {
    message: "Keterangan minimal 10 karakter.",
  }),
});

const ModalRevision = ({ id }: { id: number }) => {
  const router = useRouter();
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const handleOpenAddModal = () => {
    setAddModalOpen(true);
  };
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  async function onSubmit(values: z.infer<typeof FormSchema>) {
    setIsLoading(true);
    const formData = {
      verifiednotes: values.keterangan,
      status: 3,
    };
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/datatoponim/verif/${id}`,
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
      if (response.ok) {
        Swal.fire({
          icon: "success",
          title: `${data.message}`,
          timer: 2000,
          showConfirmButton: false,
          position: "center",
        });
        handleAddModalClose();
        router.push("/review/has-not-been-reviewed");
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

  const handleAddModalClose = () => {
    setAddModalOpen(false);
  };

  return (
    <AlertDialog open={addModalOpen}>
      <AlertDialogTrigger asChild>
        <Button
          onClick={handleOpenAddModal}
          size="sm"
          className="rounded-full bg-yellow-500 space-x-2 hover:bg-yellow-600"
        >
          <p>Perbaiki</p>
          <PenBox className="w-4 h-4" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="flex flex-col items-center w-96 justify-center border-0 rounded-[20px] overflow-auto gap-y-10">
        <h4 className="text-neutral-800 text-sm text-center w-[213px]">
          Apakah anda yakin user harus memperbaiki data ini?
        </h4>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full space-y-6 flex flex-col "
          >
            <FormField
              control={form.control}
              name="keterangan"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea
                      placeholder="Keterangan"
                      className="w-full"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <AlertDialogFooter>
              <AlertDialogAction
                className="bg-yellow-500 hover:bg-yellow-600 text-neutral-50 rounded-full px-[37px]"
                disabled={isLoading}
                type="submit"
              >
                {isLoading ? (
                  <Loader className="animate-spin" />
                ) : (
                  "Harus Revisi"
                )}
              </AlertDialogAction>
              <AlertDialogCancel
                type="button"
                onClick={handleAddModalClose}
                className="bg-transparent border border-primaryy hover:bg-primaryy text-primaryy hover:text-white rounded-full px-[37px]"
              >
                Batal
              </AlertDialogCancel>
            </AlertDialogFooter>
          </form>
        </Form>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ModalRevision;
