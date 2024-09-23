import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Label } from "../../ui/label";
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
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";

const passwordSchema = z
  .object({
    oldPassword: z.string().min(6, "Kata sandi lama minimal 6 karakter"),
    newPassword: z.string().min(6, "Kata sandi baru minimal 6 karakter"),
    confirmPassword: z
      .string()
      .min(6, "Konfirmasi kata sandi minimal 6 karakter"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Konfirmasi kata sandi tidak sesuai",
    path: ["confirmPassword"], // Path untuk menunjukkan error pada konfirmasi password
  });

export default function ChangePasswordDialog() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(passwordSchema),
  });

  const onSubmit = (data: any) => {
    console.log("Password data:", data);
    // Logic untuk mengubah kata sandi
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          size="sm"
          className="text-primaryy hover:bg-primaryy hover:text-white px-6 rounded-full bg-transparent border border-primaryy"
        >
          Ganti Kata Sandi
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="text-primaryy">
            Ganti Kata Sandi
          </AlertDialogTitle>
        </AlertDialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-2">
            {/* Input Kata Sandi Lama */}
            <div className="space-y-1">
              <Label className="text-black">Kata Sandi Lama</Label>
              <Input
                type="password"
                className="rounded-full bg-transparent"
                placeholder="Kata Sandi Lama"
                {...register("oldPassword")}
              />
              {errors.oldPassword?.message && (
                <p className="text-red-500 text-sm">
                  {String(errors.oldPassword.message)}
                </p>
              )}
            </div>

            {/* Input Kata Sandi Baru */}
            <div className="space-y-1">
              <Label className="text-black">Kata Sandi Baru</Label>
              <Input
                type="password"
                className="rounded-full bg-transparent"
                placeholder="Kata Sandi Baru"
                {...register("newPassword")}
              />
              {errors.newPassword?.message && (
                <p className="text-red-500 text-sm">
                  {String(errors.newPassword.message)}
                </p>
              )}
            </div>

            {/* Input Konfirmasi Kata Sandi */}
            <div className="space-y-1">
              <Label className="text-black">Konfirmasi Kata Sandi</Label>
              <Input
                type="password"
                className="rounded-full bg-transparent"
                placeholder="Konfirmasi Kata Sandi"
                {...register("confirmPassword")}
              />
              {errors.confirmPassword?.message && (
                <p className="text-red-500 text-sm">
                  {String(errors.confirmPassword.message)}
                </p>
              )}
            </div>

            {/* Tombol Aksi */}
            <AlertDialogFooter>
              <AlertDialogAction
                type="submit"
                className="bg-primaryy rounded-full"
              >
                Simpan
              </AlertDialogAction>
              <AlertDialogCancel className="bg-transparent text-primaryy border border-primaryy hover:bg-primaryy hover:text-white rounded-full">
                Batal
              </AlertDialogCancel>
            </AlertDialogFooter>
          </div>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  );
}
