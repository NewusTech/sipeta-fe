"use client";

import { Label } from "../../../components/ui/label";
import { Button } from "../../../components/ui/button";
import { UserCircle2 } from "lucide-react";
import { Input } from "../../../components/ui/input";
import ChangePasswordDialog from "../../../components/Dialog/ChangePassword";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useForm } from "react-hook-form";
import ProtectedRoute from "@/components/ProtectedRoute";

const profileSchema = z.object({
  fullName: z.string().min(3, "Nama Lengkap minimal 3 karakter"),
  phoneNumber: z
    .string()
    .min(10, "Nomor Telepon minimal 10 digit")
    .max(13, "Nomor Telepon tidak boleh lebih dari 13 digit"),
  email: z.string().email("Email tidak valid"),
});

export default function ProfilePage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(profileSchema), // Hubungkan Zod schema ke React Hook Form
  });

  const onSubmit = (data: any) => {
    console.log("Form Data:", data);
  };

  return (
    <ProtectedRoute roles={["Super Admin", "Verifikator", "Surveyor"]}>
      <section className="md:pl-64 pr-10 pl-10 pt-10 md:pt-32">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex md:flex-row shadow rounded-lg md:shadow-none p-5 md:p-0 flex-col md:space-x-4">
            <div className="w-full md:bg-white md:shadow rounded-xl p-0 md:px-10 md:py-3 space-y-1 md:space-y-10">
              <h1 className="text-primaryy font-semibold text-xl hidden md:block">
                Foto
              </h1>
              <h1 className="text-primaryy font-semibold text-xl block md:hidden">
                Profile
              </h1>
              <div className="flex flex-col justify-center items-center md:space-y-10 space-y-3">
                <UserCircle2 className="w-32 h-32 text-primaryy" />
                <Button className="md:w-full px-9 rounded-full bg-primaryy">
                  Pilih
                </Button>
              </div>
            </div>
            <div className="w-full md:bg-white md:shadow rounded-xl p-0 md:px-10 md:py-3 space-y-3">
              <h1 className="text-primaryy font-semibold text-xl hidden md:block">
                Profile
              </h1>
              <div className="space-y-2">
                {/* Input Nama Lengkap */}
                <div className="space-y-1">
                  <Label className="text-black">Nama Lengkap</Label>
                  <Input
                    className="rounded-full bg-transparent"
                    placeholder="Nama Lengkap"
                    {...register("fullName")}
                  />
                  {errors.fullName?.message && (
                    <p className="text-red-500 text-sm">
                      {String(errors.fullName.message)}
                    </p>
                  )}
                </div>

                {/* Input Nomor Telepon */}
                <div className="space-y-1">
                  <Label className="text-black">Nomor Telepon</Label>
                  <Input
                    className="rounded-full bg-transparent"
                    placeholder="Nomor Telepon"
                    {...register("phoneNumber")}
                  />
                  {errors.phoneNumber?.message && (
                    <p className="text-red-500 text-sm">
                      {String(errors.phoneNumber.message)}
                    </p>
                  )}
                </div>

                {/* Input Email */}
                <div className="space-y-1">
                  <Label className="text-black">Email</Label>
                  <Input
                    className="rounded-full bg-transparent"
                    placeholder="Email"
                    type="email"
                    {...register("email")}
                  />
                  {errors.email?.message && (
                    <p className="text-red-500 text-sm">
                      {String(errors.email.message)}
                    </p>
                  )}
                </div>

                {/* Tombol Simpan */}
                <div className="flex space-x-3 pt-6 md:mt-2 justify-center md:justify-end">
                  <ChangePasswordDialog />
                  <Button
                    type="submit"
                    className="rounded-full bg-primaryy px-6"
                    size="sm"
                  >
                    Simpan
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </form>
      </section>
    </ProtectedRoute>
  );
}
