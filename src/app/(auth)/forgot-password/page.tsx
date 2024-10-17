"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "../../../components/ui/input";
import { useState } from "react";
import { Button } from "../../../components/ui/button";
import { Label } from "../../../components/ui/label";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";

const registerSchema = z.object({
  email: z.string().email("Email tidak valid"),
});

const ForgotPasswordPage = () => {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: any) => {
    setIsLoading(true);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/forgotpassword`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: data.email }),
        }
      );

      const result = await res.json();
      if (res.ok) {
        Swal.fire({
          icon: "success",
          title: `${result.message}`,
          timer: 2000,
          showConfirmButton: false,
          position: "center",
        });
        router.push("/login");
      }

      if (!res.ok) {
        Swal.fire({
          icon: "error",
          title: `${result.message}`,
          timer: 2000,
          showConfirmButton: false,
          position: "center",
        });
      }
    } catch (e) {
      Swal.fire({
        icon: "error",
        title: "Gagal mengirim lupa password",
        timer: 2000,
        showConfirmButton: false,
        position: "center",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="-mt-10 bg-primaryy px-10 md:px-0 md:bg-[url('/assets/images/bg-screen.jpg')] flex justify-center items-center w-screen h-screen bg-cover">
      <div className="container mx-auto space-y-4 bg-white py-8 md:px-[60px] w-[565px] rounded-xl flex flex-col">
        <div className="flex flex-col">
          <h5 className="uppercase text-primaryy font-bold text-lg">
            Lupa Password
          </h5>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 w-full">
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
          <div className="flex justify-center">
            <Button
              type="submit"
              className="rounded-full bg-transparent text-white bg-primaryy px-8"
              disabled={isLoading}
            >
              {isLoading ? "Loading ..." : "Kirim"}
            </Button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default ForgotPasswordPage;
