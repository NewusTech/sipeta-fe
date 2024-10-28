"use client";

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../../ui/alert-dialog";
import { Button } from "../../ui/button";
import Cookies from "js-cookie";
import Swal from "sweetalert2";
import React, { useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import useSWR from "swr";
import { fetcherWithoutAuth } from "constants/fetcher";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

export function TnCDialog() {
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [value, setValue] = useState("");

  const handleOpenAddModal = () => {
    setAddModalOpen(true);
  };

  const handleAddModalClose = () => {
    setAddModalOpen(false);
  };

  const { data } = useSWR<any>(
    `${process.env.NEXT_PUBLIC_API_URL}/termcond`,
    fetcherWithoutAuth
  );

  const result = data?.data;

  useEffect(() => {
    if (result) {
      setValue(result?.desc);
    }
  }, [result]);

  // 2. Define a submit handler.
  async function onSubmit() {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    setIsLoading(true);
    const formData = {
      desc: value,
    };

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/termcond`,
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
        window.location.reload();
      }
    } catch (e: any) {
      Swal.fire({
        icon: "error",
        title: "Gagal submit!",
        timer: 2000,
        showConfirmButton: false,
        position: "center",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <AlertDialog open={addModalOpen}>
      <AlertDialogTrigger asChild>
        <Button
          onClick={handleOpenAddModal}
          className="rounded-full bg-primaryy hover:bg-blue-700"
        >
          Term & Condition
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="md:max-w-4xl max-h-[800px] overflow-auto">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-primaryy">Tambah</AlertDialogTitle>
        </AlertDialogHeader>
        <div className="space-y-2 mb-5">
          <Label>Term & Condition</Label>
          <ReactQuill theme="snow" value={value} onChange={setValue} />
        </div>

        {/* Tombol Aksi */}
        <AlertDialogFooter>
          <Button
            disabled={isLoading}
            onClick={onSubmit}
            className="bg-primaryy rounded-full mt-2 md:mt-0"
          >
            {isLoading ? "Loading ..." : "Simpan"}
          </Button>
          <AlertDialogCancel
            onClick={handleAddModalClose}
            className="bg-transparent text-primaryy border border-primaryy hover:bg-primaryy hover:text-white rounded-full"
          >
            Batal
          </AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
