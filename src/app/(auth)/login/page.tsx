"use client";

import { Eye, EyeOff } from "lucide-react";
import { Input } from "../../../components/ui/input";
import Image from "next/image";
import { useState } from "react";
import Link from "next/link";
import { Button } from "../../../components/ui/button";

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);

  // Fungsi untuk toggle visibilitas kata sandi
  const togglePasswordVisibility = () => {
    setShowPassword((prevState) => !prevState);
  };

  return (
    <section className="-mt-10 bg-[url('/assets/images/bg-screen.jpg')] flex justify-center items-center w-screen h-screen bg-cover">
      <div className="container mx-auto space-y-4 bg-[#84ACCE] py-8 px-[60px] w-[565px] rounded-xl flex flex-col">
        <div className="flex justify-center">
          <Image
            src="/assets/icons/logo.svg"
            alt="logo"
            width={140}
            height={178}
          />
        </div>
        <div className="flex flex-col items-center">
          <h5 className="uppercase text-primaryy font-semibold">sipeta</h5>
          <p className="uppercase text-primaryy font-light w-8/12 text-center text-sm">
            sistem informasi pengelolaan data kewilayahan lampung utara
          </p>
        </div>
        <div className="space-y-2 w-full">
          <div className=" flex rounded-full items-center pl-3 bg-white">
            <Image
              src="/assets/icons/user.svg"
              alt="logo"
              width={20}
              height={20}
            />
            <Input className="rounded-full border-none" placeholder="Email" />
          </div>
          <div className=" flex rounded-full items-center pr-3 pl-1 bg-white">
            <Input
              className="rounded-full border-none"
              placeholder="Kata Sandi"
              type={showPassword ? "text" : "password"}
            />
            <div onClick={togglePasswordVisibility} className="cursor-pointer">
              {showPassword ? (
                <EyeOff className="text-greyy" />
              ) : (
                <Eye className="text-greyy" />
              )}
            </div>
          </div>
        </div>
        <div className="flex justify-between">
          <Link href="/" className="text-primaryy underline text-sm">
            Lupa kata sandi?
          </Link>
          <p className="text-sm text-greyy">
            Belum punya akun? silakan{" "}
            <Link href="/register" className="text-primaryy underline">
              Daftar?
            </Link>
          </p>
        </div>
        <div className="flex justify-center">
          <Button className="rounded-full text-white bg-primaryy px-8">
            Masuk
          </Button>
        </div>
        <p className="text-center text-xs text-primaryy font-light">
          Dengan mendaftar, Anda menyetujui{" "}
          <span className="font-semibold">Syarat & Ketentuan</span> kami dan
          Anda <br /> telah membaca{" "}
          <span className="font-semibold">Kebijakan Privasi</span> kami.
        </p>
      </div>
    </section>
  );
};

export default LoginPage;
