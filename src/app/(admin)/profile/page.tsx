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
import SelectSearch from "@/components/Input/Select";
import useSWR from "swr";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { fetcher, fetcherWithoutAuth } from "constants/fetcher";
import Swal from "sweetalert2";
import Image from "next/image";

const profileSchema = z.object({
  fullName: z.string().min(3, "Nama Lengkap minimal 3 karakter"),
  phoneNumber: z
    .string()
    .min(10, "Nomor Telepon minimal 10 digit")
    .max(13, "Nomor Telepon tidak boleh lebih dari 13 digit"),
  email: z.string().email("Email tidak valid"),
});

export default function ProfilePage() {
  const [valueUnsur, setValueUnsur] = useState<any>({ id: 0, label: "" });
  const [valueDistrict, setValueDistrict] = useState<any>({ id: 0, label: "" });
  const [isLoading, setIsloading] = useState(false);
  const [isLoading2, setIsloading2] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const [selectedImageOri, setSelectedImageOri] = useState(null);
  // Fungsi untuk menangani perubahan input file
  const handleImageChange = (event: any) => {
    const file = event.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file); // Membuat URL sementara dari file yang dipilih
      setSelectedImage(imageUrl);
      setSelectedImageOri(file);
    }
  };
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const { data: district } = useSWR<any>(
    `${apiUrl}/kecamatan/get?limit=50`,
    fetcherWithoutAuth
  );
  const { data: unsur } = useSWR<any>(
    `${apiUrl}/desa/get?limit=1000&kecamatan_id=${valueDistrict?.id}`,
    fetcherWithoutAuth
  );

  const unsurData = unsur?.data;
  const districtData = district?.data;
  const newUnsur = unsurData?.map((item: { id: number; name: string }) => ({
    value: item.id, // id masuk ke value
    label: item.name, // name masuk ke label
  }));
  const newDistrict = districtData?.map(
    (item: { id: number; name: string }) => ({
      value: item.id, // id masuk ke value
      label: item.name, // name masuk ke label
    })
  );
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(profileSchema), // Hubungkan Zod schema ke React Hook Form
  });

  const { data: userInfo } = useSWR(`${apiUrl}/getforuser`, fetcher);

  const resultData = userInfo?.data;

  useEffect(() => {
    if (resultData) {
      reset({
        fullName: resultData?.name,
        phoneNumber: resultData?.telepon,
        email: resultData?.email,
      });
      setValueDistrict({
        id: resultData?.kecamatan_id,
        label: resultData?.kecamatan_name,
      });
      setValueUnsur({
        id: resultData?.desa_id,
        label: resultData?.desa_name,
      });
    }
  }, [resultData]);

  const onSubmit = async (data: any) => {
    setIsloading(true);
    const formData = {
      name: data.fullName,
      telepon: data.phoneNumber,
      email: data.email,
      kecamatan_id: valueDistrict.id.toString(),
      desa_id: valueUnsur.id.toString(),
    };

    console.log(formData);
    try {
      const res = await fetch(`${apiUrl}/userinfo/update/${resultData?.slug}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Cookies.get("token")}`,
        },
        body: JSON.stringify(formData),
      });
      const result = await res.json();
      console.log(result);
      if (res.ok) {
        Swal.fire({
          icon: "success",
          title: `${result.message}`,
          timer: 2000,
          showConfirmButton: false,
          position: "center",
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Gagal submit!",
        timer: 2000,
        showConfirmButton: false,
        position: "center",
      });
    } finally {
      setIsloading(false);
    }
  };

  const handleSubmitFile = async () => {
    setIsloading2(true);
    const formData = new FormData();
    if (selectedImageOri) {
      formData.append("fotoprofil", selectedImageOri);
    }
    try {
      const res = await fetch(
        `${apiUrl}/userinfo/updatefoto/${resultData?.slug}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${Cookies.get("token")}`,
          },
          body: formData,
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
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Gagal submit!",
        timer: 2000,
        showConfirmButton: false,
        position: "center",
      });
    } finally {
      setIsloading2(false);
    }
  };

  return (
    <ProtectedRoute roles={["Super Admin", "Verifikator", "Surveyor", "User"]}>
      <section className="md:pl-64 pr-10 pl-10 pt-10 md:pt-32">
        <div className="grid md:grid-cols-2 grid-cols-1 shadow rounded-lg md:shadow-none p-5 md:p-0  md:space-x-4">
          <div className="w-full md:bg-white md:shadow rounded-xl p-0 md:px-10 md:py-3 space-y-1 md:space-y-10">
            <h1 className="text-primaryy font-semibold text-xl hidden md:block">
              Foto
            </h1>
            <h1 className="text-primaryy font-semibold text-xl block md:hidden">
              Profile
            </h1>
            <div className="space-y-3 flex flex-col items-center justify-center">
              <div className="flex flex-col justify-center items-center md:space-y-10 space-y-3">
                {selectedImage || resultData?.foto ? (
                  <Image
                    src={selectedImage || resultData?.foto} // Jika ada gambar yang dipilih, tampilkan. Jika tidak, tampilkan foto dari resultData
                    width={128}
                    height={128}
                    alt="profile"
                    className="rounded-full w-32 h-32 object-cover border-4"
                  />
                ) : (
                  <UserCircle2 className="w-32 h-32 text-primaryy" />
                )}
                <label
                  htmlFor="image"
                  className="md:w-full hidden md:block px-32 hover:bg-primaryy hover:text-white py-2 cursor-pointer rounded-full border border-primaryy text-center text-primaryy"
                >
                  Pilih
                </label>
                <input
                  type="file"
                  id="image"
                  name="image"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageChange}
                />
                <div className="flex space-x-3 md:hidden">
                  <label
                    htmlFor="image2"
                    className="md:w-full px-9 py-2 cursor-pointer rounded-full border border-primaryy text-center text-primaryy"
                  >
                    Pilih
                  </label>
                  <input
                    type="file"
                    id="image2"
                    name="image2"
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                  {selectedImage && (
                    <Button
                      onClick={handleSubmitFile}
                      disabled={isLoading2}
                      className="md:w-full px-8 py-2 rounded-full bg-primaryy hover:bg-blue-700"
                    >
                      {isLoading2 ? "Loading..." : "Upload"}
                    </Button>
                  )}
                </div>
              </div>
              {selectedImage && (
                <Button
                  onClick={handleSubmitFile}
                  disabled={isLoading2}
                  className="md:w-full px-8 py-2 rounded-full bg-primaryy hover:bg-blue-700 hidden md:block"
                >
                  {isLoading2 ? "Loading..." : "Upload"}
                </Button>
              )}
            </div>
          </div>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="w-full md:bg-white md:shadow rounded-xl p-0 md:px-10 md:py-3 space-y-3 mt-2"
          >
            <div>
              <h1 className="text-primaryy font-semibold text-xl hidden md:block">
                Profile
              </h1>
              <div className="space-y-2 grid grid-cols-1 md:grid-cols-2 gap-2">
                {/* Input Nama Lengkap */}
                <div className="space-y-1 mt-2">
                  <Label className="text-black">Nama Lengkap</Label>
                  <Input
                    className="rounded-full "
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
                    className="rounded-full"
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
                    className="rounded-full"
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

                <div className="space-y-1">
                  <Label className="text-black">Kecamatan</Label>
                  <SelectSearch
                    data={newDistrict}
                    valueId={valueDistrict}
                    setValueId={setValueDistrict}
                    placeholder="Kecamatan"
                  />
                </div>

                <div className="space-y-1">
                  <Label className="text-black">Desa</Label>
                  <SelectSearch
                    data={newUnsur}
                    valueId={valueUnsur}
                    setValueId={setValueUnsur}
                    placeholder="Desa"
                  />
                </div>

                {/* Tombol Simpan */}
              </div>
              <div className="flex space-x-3 pt-3 md:mt-2 justify-center md:justify-end">
                <ChangePasswordDialog />
                <Button
                  type="submit"
                  className="rounded-full bg-primaryy px-6"
                  size="sm"
                  disabled={isLoading}
                >
                  {isLoading ? "Loading..." : "Simpan"}
                </Button>
              </div>
            </div>
          </form>
        </div>
      </section>
    </ProtectedRoute>
  );
}
