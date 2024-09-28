"use client";

import { Eye, EyeOff } from "lucide-react";
import { Input } from "../../../components/ui/input";
import Image from "next/image";
import { useState } from "react";
import Link from "next/link";
import { Button } from "../../../components/ui/button";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Swal from "sweetalert2";
import useAuthStore from "../../../store/useAuthStore";
import { useRouter } from "next/navigation";

const loginSchema = z.object({
  username: z.string({ message: "username wajib diisi" }),
  password: z.string().min(6, "Kata sandi minimal 6 karakter"),
});

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const login = useAuthStore((state) => state.login);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  // Fungsi untuk toggle visibilitas kata sandi
  const togglePasswordVisibility = () => {
    setShowPassword((prevState) => !prevState);
  };

  const onSubmit = async (data: any) => {
    setIsLoading(true);
    const formData = {
      nik: data.username,
      password: data.password,
    };

    console.log(formData);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (!response.ok) {
        // Tangani respons yang bukan 2xx
        const errorData = await response.json();
        throw new Error(
          errorData.message || `HTTP error! status: ${response.status}`
        );
      }
      if (response.ok) {
        const tokenAuth = data.data.token;
        login(tokenAuth);
        await new Promise((resolve) => setTimeout(resolve, 300));
        Swal.fire({
          icon: "success",
          title: "Login berhasil!",
          timer: 2000,
          showConfirmButton: false,
          position: "center",
        });
        // Redirect ke path tujuan setelah login
        const pathBeforeLogin =
          sessionStorage.getItem("pathBeforeLogin") || "/";
        sessionStorage.removeItem("pathBeforeLogin");
        router.push(pathBeforeLogin);
      }
    } catch (e: any) {
      Swal.fire({
        icon: "error",
        title: "Login gagal",
        text: "Username atau password salah",
        timer: 2000,
        showConfirmButton: false,
        position: "center",
      });
    } finally {
      setIsLoading(false); // Stop loading
    }
  };

  return (
    <section className="-mt-10 bg-primaryy px-10 md:px-0 md:bg-[url('/assets/images/bg-screen.jpg')] flex justify-center items-center w-screen h-screen bg-cover">
      <div className="container mx-auto space-y-4 bg-white py-8 md:px-[60px] w-[565px] rounded-xl flex flex-col">
        <div className="flex justify-center">
          <Image
            src="/assets/icons/logo.svg"
            alt="logo"
            width={140}
            height={178}
            className="w-[100px] h-[138px] md:w-[140px] md:h-[178px]"
          />
        </div>
        <div className="flex flex-col items-center">
          <h5 className="uppercase text-primaryy font-semibold">sipeta</h5>
          <p className="uppercase text-primaryy w-full md:w-8/12 text-center text-xs md:text-sm">
            sistem informasi pengelolaan data kewilayahan lampung utara
          </p>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2 w-full">
            <div className="flex rounded-full border border-primaryy items-center pl-3 bg-white">
              <Image
                src="/assets/icons/user.svg"
                alt="logo"
                width={20}
                height={20}
              />
              <Input
                className="rounded-full border-none bg-transparent"
                placeholder="Email"
                {...register("username")}
              />
            </div>
            {errors.username?.message && (
              <p className="text-red-500 text-sm">
                {String(errors.username.message)}
              </p>
            )}
            <div className="flex rounded-full border border-primaryy items-center pr-3 pl-1 bg-white">
              <Input
                className="rounded-full border-none bg-transparent"
                placeholder="Kata Sandi"
                type={showPassword ? "text" : "password"}
                {...register("password")}
              />
              <div
                onClick={togglePasswordVisibility}
                className="cursor-pointer"
              >
                {showPassword ? (
                  <EyeOff className="text-greyy" />
                ) : (
                  <Eye className="text-greyy" />
                )}
              </div>
            </div>
            {errors.password?.message && (
              <p className="text-red-500 text-sm">
                {String(errors.password.message)}
              </p>
            )}
          </div>
          <div className="flex justify-between">
            <Link href="/" className="text-primaryy underline text-sm w-40">
              Lupa kata sandi?
            </Link>
            <p className="text-sm text-right md:text-left text-greyy">
              Belum punya akun? silakan{" "}
              <Link href="/register" className="text-primaryy underline">
                Daftar?
              </Link>
            </p>
          </div>
          <div className="flex justify-center">
            <Button
              type="submit"
              className="rounded-full text-white bg-primaryy px-8"
              disabled={isLoading}
            >
              {isLoading ? "Loading..." : "Masuk"}
            </Button>
          </div>
        </form>
        <p className="text-center text-xs text-primaryy">
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
