"use client";

import { Eye, EyeOff } from "lucide-react";
import { Input } from "../../../components/ui/input";
import Image from "next/image";
import { useState } from "react";
import Link from "next/link";
import { Button } from "../../../components/ui/button";
import { Label } from "../../../components/ui/label";

const RegisterPage = () => {
  const [showPassword, setShowPassword] = useState(false);

  // Fungsi untuk toggle visibilitas kata sandi
  const togglePasswordVisibility = () => {
    setShowPassword((prevState) => !prevState);
  };

  return (
    <section className="-mt-10 bg-[url('/assets/images/bg-screen.jpg')] flex justify-center items-center w-screen h-screen bg-cover">
      <div className="container mx-auto space-y-4 bg-white py-8 px-[60px] w-[565px] rounded-xl flex flex-col">
        <div className="flex flex-col">
          <h5 className="uppercase text-primaryy font-bold tracking-[0.2rem] text-lg">
            daftar
          </h5>
          <p className="text-black font-light text-sm">
            Sudah punya akun? silakan{" "}
            <Link href="/login" className="underline text-primaryy">
              Masuk
            </Link>
          </p>
        </div>
        <div className="space-y-2 w-full">
          <div className="space-y-1">
            <Label>Nama Lengkap</Label>
            <Input
              className="rounded-full border-primaryy"
              placeholder="Nama Lengkap"
            />
          </div>
          <div className="space-y-1">
            <Label>Nomor Telepon</Label>
            <Input
              className="rounded-full border-primaryy"
              placeholder="Nomor Telepon"
            />
          </div>
          <div className="space-y-1">
            <Label>Email</Label>
            <Input
              className="rounded-full border-primaryy"
              placeholder="Email"
              type="email"
            />
          </div>
          <div className="space-y-1">
            <Label>Password</Label>
            <div className="border border-primaryy flex rounded-full items-center pr-3 pl-1 bg-white">
              <Input
                className="rounded-full border-none"
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
          </div>
        </div>
        <div className="flex justify-center">
          <Button className="rounded-full text-white bg-primaryy px-8">
            Daftar
          </Button>
        </div>
        <p className="text-center text-xs text-black font-light">
          Dengan mendaftar, Anda menyetujui{" "}
          <span className="font-semibold">Syarat & Ketentuan</span> kami dan
          Anda <br /> telah membaca{" "}
          <span className="font-semibold">Kebijakan Privasi</span> kami.
        </p>
      </div>
    </section>
  );
};

export default RegisterPage;
