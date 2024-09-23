"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";
import { Input } from "../../../components/ui/input";
import { useState } from "react";
import Link from "next/link";
import { Button } from "../../../components/ui/button";
import { Label } from "../../../components/ui/label";
import { Checkbox } from "../../../components/ui/checkbox";

const registerSchema = z.object({
  fullName: z.string().min(1, "Nama lengkap harus diisi"),
  phoneNumber: z
    .string()
    .min(10, "Nomor telepon harus terdiri dari 10 angka")
    .regex(/^[0-9]+$/, "Nomor telepon hanya boleh terdiri dari angka"),
  email: z.string().email("Email tidak valid"),
  password: z.string().min(6, "Password harus minimal 6 karakter"),
});

const RegisterPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
  });
  // Fungsi untuk toggle visibilitas kata sandi
  const togglePasswordVisibility = () => {
    setShowPassword((prevState) => !prevState);
  };

  const onSubmit = (data: any) => {
    console.log(data);
  };

  return (
    <section className="-mt-10 bg-[url('/assets/images/bg-screen.jpg')] flex justify-center items-center w-screen h-screen bg-cover">
      <div className="container mx-auto space-y-4 bg-white py-8 px-[60px] w-[565px] rounded-xl flex flex-col">
        <div className="flex flex-col">
          <h5 className="uppercase text-primaryy font-bold tracking-[0.2rem] text-lg">
            daftar
          </h5>
          <p className="text-black text-sm">
            Sudah punya akun? silakan{" "}
            <Link href="/login" className="underline text-primaryy font-medium">
              Masuk
            </Link>
          </p>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-2 w-full">
          <div className="space-y-1">
            <Label className="text-primaryy">Nama Lengkap</Label>
            <Input
              {...register("fullName")}
              className="rounded-full bg-transparent"
              placeholder="Nama Lengkap"
            />
            {errors.fullName && (
              <p className="text-red-500 text-xs">
                {String(errors.fullName.message)}
              </p>
            )}
          </div>
          <div className="space-y-1">
            <Label className="text-primaryy">Nomor Telepon</Label>
            <Input
              {...register("phoneNumber")}
              className="rounded-full bg-transparent"
              placeholder="Nomor Telepon"
            />
            {errors.phoneNumber?.message && (
              <p className="text-red-500 text-xs">
                {String(errors.phoneNumber.message)}
              </p>
            )}
          </div>
          <div className="space-y-1">
            <Label className="text-primaryy">Email</Label>
            <Input
              {...register("email")}
              className="rounded-full bg-transparent"
              placeholder="Email"
              type="email"
            />
            {errors.email?.message && (
              <p className="text-red-500 text-xs">
                {String(errors.email.message)}
              </p>
            )}
          </div>
          <div className="space-y-1">
            <Label className="text-primaryy">Password</Label>
            <div className="border flex rounded-full bg-transparent items-center pr-3 pl-1">
              <Input
                {...register("password")}
                className="rounded-full bg-transparent border-none"
                placeholder="Kata Sandi"
                type={showPassword ? "text" : "password"}
              />
              <div
                onClick={togglePasswordVisibility}
                className="cursor-pointer"
              >
                {showPassword ? (
                  <EyeOff className="text-primaryy" />
                ) : (
                  <Eye className="text-primaryy" />
                )}
              </div>
            </div>
            {errors.password?.message && (
              <p className="text-red-500 text-xs">
                {String(errors.password.message)}
              </p>
            )}
          </div>
          <div className="flex space-x-2 items-center">
            <Checkbox />
            <p className="text-xs text-primaryy -my-1">
              Dengan mendaftar, Anda menyetujui{" "}
              <span className="font-semibold">Syarat & Ketentuan</span> kami dan
              Anda telah membaca
              <span className="font-semibold"> Kebijakan Privasi</span> kami.
            </p>
          </div>
          <div className="flex justify-center">
            <Button
              type="submit"
              className="rounded-full bg-transparent text-white bg-primaryy px-8"
            >
              Daftar
            </Button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default RegisterPage;
