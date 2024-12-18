import Cookies from "js-cookie";
import { useState } from "react";
import Image from "next/image";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogTrigger,
} from "../../ui/alert-dialog";
import { Loader, Trash2 } from "lucide-react";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";

const ModalDelete = ({
  endpoint,
  type,
}: {
  endpoint?: string;
  type?: string;
}) => {
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const handleOpenAddModal = () => {
    setAddModalOpen(true);
  };

  const router = useRouter();

  const handleAddModalClose = () => {
    setAddModalOpen(false);
  };

  const handleValidationStatus = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/${endpoint}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${Cookies.get("token")}`,
          },
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
        window.location.reload();
      }
      if (!response.ok) {
        Swal.fire({
          icon: "error",
          title: `${data.message}`,
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
  };

  return (
    <AlertDialog open={addModalOpen}>
      <AlertDialogTrigger asChild>
        {type === "icon" ? (
          <div
            onClick={handleOpenAddModal}
            className="p-1 w-7 flex justify-center items-center bg-error hover:bg-red-500 rounded-sm cursor-pointer"
          >
            <Trash2 className="w-4 h-4 text-white" />
          </div>
        ) : type === "ic-mobile" ? (
          <div onClick={handleOpenAddModal} className="cursor-pointer">
            <Trash2 className="w-6 h-6 " />
          </div>
        ) : (
          <div
            onClick={handleOpenAddModal}
            className="py-1 px-2 w-full hover:bg-slate-100 cursor-pointer"
          >
            <p className="text-sm">Delete</p>
          </div>
        )}
      </AlertDialogTrigger>
      <AlertDialogContent className="flex flex-col items-center w-96 justify-center border-0 rounded-[20px] overflow-auto gap-y-10">
        <Image src="/assets/icons/info.svg" alt="info" height={50} width={50} />
        <h4 className="text-neutral-800 text-sm text-center w-[213px]">
          Apakah kamu yakin ingin menghapusnya?
        </h4>
        <AlertDialogFooter>
          <AlertDialogAction
            onClick={handleValidationStatus}
            className="bg-red-600 hover:bg-red-700 text-neutral-50 rounded-full px-[37px]"
            disabled={isLoading}
          >
            {isLoading ? <Loader className="animate-spin" /> : "YA"}
          </AlertDialogAction>
          <AlertDialogCancel
            type="button"
            onClick={handleAddModalClose}
            className="bg-primaryy hover:bg-primary-800 text-neutral-50 hover:text-neutral-50 rounded-full px-[37px]"
          >
            BATAL
          </AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ModalDelete;
