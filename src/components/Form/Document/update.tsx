import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { cn } from "../../../lib/utils";
import { Button } from "../../ui/button";
import { toast } from "../../../hooks/use-toast";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../ui/form";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../../ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "../../ui/popover";
import { Input } from "../../ui/input";
import {
  Check,
  ChevronDown,
  Folder,
  Loader,
  Trash,
  Trash2,
} from "lucide-react";
import { useState } from "react";
import { Label } from "../../ui/label";
import Image from "next/image";
import SelectSearch from "@/components/Input/Select";
import useSWR from "swr";
import { fetcherWithoutAuth } from "constants/fetcher";
import Swal from "sweetalert2";
import Cookies from "js-cookie";

const languages = [
  { label: "English", value: "en" },
  { label: "French", value: "fr" },
  { label: "German", value: "de" },
  { label: "Spanish", value: "es" },
  { label: "Portuguese", value: "pt" },
  { label: "Russian", value: "ru" },
  { label: "Japanese", value: "ja" },
  { label: "Korean", value: "ko" },
  { label: "Chinese", value: "zh" },
] as const;

const formSchema = z.object({
  idToponim: z.string({
    message: "Please enter a username.",
  }),
  typeGemoetry: z.string({
    required_error: "Please select a language.",
  }),
  classcificationToponim: z.string({
    required_error: "Please select a language.",
  }),
  unsur: z.string({
    required_error: "Please select a language.",
  }),
  district: z.string({
    message: "Please enter a username.",
  }),
  village: z.string({
    message: "Please enter a username.",
  }),
  name: z.string({
    message: "Please enter a username.",
  }),
  nameSpesific: z.string({
    message: "Please enter a username.",
  }),
  nameMap: z.string({
    message: "Please enter a username.",
  }),
  mainCoordinat: z.string({
    message: "Please enter a username.",
  }),
  lat: z.string({
    message: "Please enter a username.",
  }),
  long: z.string({
    message: "Please enter a username.",
  }),
});

export default function DocumentTabUpdate({
  data,
  foto,
  id,
}: {
  data: any;
  foto: any;
  id: number;
}) {
  const [selectedImages, setSelectedImages] = useState(["", "", "", ""]);

  const [selectedImagesOri, setSelectedImagesOri] = useState([
    null,
    null,
    null,
    null,
  ]);
  const [selectedSketsa, setSelectedSketsa] = useState("");
  const [selectedSketsaOri, setSelectedSketsaOri] = useState(null);
  const [selectedDoc, setSelectedDoc] = useState("");
  const [selectedDocOri, setSelectedDocOri] = useState(null);

  console.log(data, foto);

  const [valueClassify, setValueClassify] = useState<any>({ id: 0, label: "" });
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const { data: classify } = useSWR<any>(
    `${apiUrl}/datatoponim/get-dashboard?limit=100000`,
    fetcherWithoutAuth
  );
  const [isLoading, setIsLoading] = useState([false, false, false, false]); // State isLoading per button
  const [isLoadingSkesta, setIsLoadingSketsa] = useState(false);
  const [isLoadingDoc, setIsLoadingDoc] = useState(false);

  const classifyData = classify?.data;
  const newClassify = classifyData?.map(
    (item: { id: number; id_toponim: string }) => ({
      value: item.id, // id masuk ke value
      label: item.id_toponim, // name masuk ke label
    })
  );
  const handleFileChange = (e: any, index: number) => {
    const file = e.target.files[0];

    if (file) {
      const updatedImages = [...selectedImages];
      const updatedImagesOri = [...selectedImagesOri];
      updatedImagesOri[index] = file;
      updatedImages[index] = URL.createObjectURL(file); // Preview file
      setSelectedImages(updatedImages);
      setSelectedImagesOri(updatedImagesOri);
    }
  };

  const handleRemoveImage = (index: number) => {
    const updatedImages = [...selectedImages];
    updatedImages[index] = ""; // Hapus file yang dipilih
    setSelectedImages(updatedImages);
  };

  const handleFileChangeSketsa = (e: any) => {
    const file = e.target.files[0];

    if (file) {
      setSelectedSketsa(URL.createObjectURL(file)); // Preview file
      setSelectedSketsaOri(file);
    }
  };

  const handleRemoveSektsa = () => {
    setSelectedSketsa(""); // Hapus file yang dipilih
    setSelectedSketsaOri(null);
  };

  const handleFileChangeDoc = (e: any) => {
    const file = e.target.files[0];

    if (file) {
      setSelectedDoc(URL.createObjectURL(file)); // Preview file
      setSelectedDocOri(file);
    }
  };

  const handleRemoveDoc = () => {
    setSelectedDoc(""); // Hapus file yang dipilih
    setSelectedDocOri(null);
  };

  const handleSubmitSketsa = async () => {
    const file = selectedSketsaOri;
    if (file) {
      setIsLoadingSketsa(true); // Set loading true untuk button
      const formData = new FormData();
      formData.append("sketsa", file); // Tambahkan file ke FormData

      try {
        const response = await fetch(
          `${apiUrl}/fototoponim/update-sketsa/${id}`,
          {
            method: "PUT",
            headers: {
              Authorization: `Bearer ${Cookies.get("token")}`,
            },
            body: formData,
          }
        );

        const data = await response.json();
        console.log(data);

        if (response.ok) {
          Swal.fire({
            icon: "success",
            title: `${data.message}`,
            timer: 2000,
            showConfirmButton: false,
            position: "center",
          });
        }
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Gagal upload!",
          timer: 2000,
          showConfirmButton: false,
          position: "center",
        });
      } finally {
        setIsLoadingSketsa(false); // Set loading false setelah upload selesai
      }
    } else {
      console.warn("No file selected for this upload.");
    }
  };

  const handleSubmitDoc = async () => {
    const file = selectedDocOri;
    if (file) {
      setIsLoadingDoc(true); // Set loading true untuk button
      const formData = new FormData();
      formData.append("docpendukung", file); // Tambahkan file ke FormData

      try {
        const response = await fetch(
          `${apiUrl}/fototoponim/update-docs/${id}`,
          {
            method: "PUT",
            headers: {
              Authorization: `Bearer ${Cookies.get("token")}`,
            },
            body: formData,
          }
        );

        const data = await response.json();
        console.log(data);

        if (response.ok) {
          Swal.fire({
            icon: "success",
            title: `${data.message}`,
            timer: 2000,
            showConfirmButton: false,
            position: "center",
          });
        }
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Gagal upload!",
          timer: 2000,
          showConfirmButton: false,
          position: "center",
        });
      } finally {
        setIsLoadingDoc(false); // Set loading false setelah upload selesai
      }
    } else {
      console.warn("No file selected for this upload.");
    }
  };

  const handleSubmit = async (index: number, id: number) => {
    const file = selectedImagesOri[index];
    if (file) {
      const updatedLoadingState = [...isLoading];
      updatedLoadingState[index] = true; // Set loading true untuk button yang sesuai
      setIsLoading(updatedLoadingState);
      const formData = new FormData();
      formData.append("foto", file); // Tambahkan file ke FormData

      try {
        const response = await fetch(
          `${apiUrl}/fototoponim/update-foto/${id}`,
          {
            method: "PUT",
            headers: {
              Authorization: `Bearer ${Cookies.get("token")}`,
            },
            body: formData,
          }
        );

        const data = await response.json();
        console.log(data);

        if (response.ok) {
          Swal.fire({
            icon: "success",
            title: `${data.message}`,
            timer: 2000,
            showConfirmButton: false,
            position: "center",
          });
        }
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Gagal Update!",
          timer: 2000,
          showConfirmButton: false,
          position: "center",
        });
      } finally {
        updatedLoadingState[index] = false; // Set loading false setelah upload selesai
        setIsLoading(updatedLoadingState);
      }
    } else {
      console.warn("No file selected for this upload.");
    }
  };

  const handleDeleteSektsa = async () => {
    // Tambahkan file ke FormData

    try {
      const response = await fetch(
        `${apiUrl}/fototoponim/delete-sketsa/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${Cookies.get("token")}`,
          },
        }
      );

      const data = await response.json();
      console.log(data);

      if (response.ok) {
        Swal.fire({
          icon: "success",
          title: `${data.message}`,
          timer: 2000,
          showConfirmButton: false,
          position: "center",
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Gagal delete!",
        timer: 2000,
        showConfirmButton: false,
        position: "center",
      });
    }
  };

  const handleDeleteDoc = async () => {
    // Tambahkan file ke FormData

    try {
      const response = await fetch(`${apiUrl}/fototoponim/delete-docs/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${Cookies.get("token")}`,
        },
      });

      const data = await response.json();
      console.log(data);

      if (response.ok) {
        Swal.fire({
          icon: "success",
          title: `${data.message}`,
          timer: 2000,
          showConfirmButton: false,
          position: "center",
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Gagal delete!",
        timer: 2000,
        showConfirmButton: false,
        position: "center",
      });
    }
  };

  const handleDeleteImage = async (index: number) => {
    // Tambahkan file ke FormData

    try {
      const response = await fetch(
        `${apiUrl}/fototoponim/delete-foto/${index}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${Cookies.get("token")}`,
          },
        }
      );

      const data = await response.json();
      console.log(data);

      if (response.ok) {
        Swal.fire({
          icon: "success",
          title: `${data.message}`,
          timer: 2000,
          showConfirmButton: false,
          position: "center",
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Gagal delete!",
        timer: 2000,
        showConfirmButton: false,
        position: "center",
      });
    }
  };

  return (
    <div className="mt-4">
      <h1 className="font-medium">Foto Toponim</h1>
      <div className="grid grid-cols-2 gap-x-4">
        {selectedImages.map((image, index) => (
          <div
            key={index}
            className="space-y-2 flex flex-col items-center mt-2"
          >
            {/* Kondisi jika file sudah dipilih, tampilkan gambar. Jika tidak, tampilkan border-dashed */}
            {image ? (
              <Image
                src={image}
                alt={`Selected ${index + 1}`}
                className="w-full rounded-lg h-20 object-cover"
                width={80}
                height={80}
              />
            ) : (
              // Tampilkan foto default sekali saja, berdasarkan index
              foto &&
              foto[index] && (
                <div className="flex flex-col justify-center items-center space-y-2">
                  <Image
                    src={foto[index].foto_url}
                    alt={`Default ${index + 1}`}
                    className="w-full rounded-lg h-20 object-cover"
                    width={80}
                    height={80}
                  />
                  <div className="flex space-x-2">
                    <div>
                      <label
                        htmlFor={`image-${index}`}
                        className="flex items-center justify-center w-6 h-6 bg-primaryy p-1 rounded cursor-pointer"
                      >
                        <Folder className="w-6 h-6 text-white" />
                      </label>
                      <Input
                        placeholder="shadcn"
                        className="rounded-full hidden"
                        type="file"
                        name={`image-${index}`}
                        id={`image-${index}`}
                        onChange={(e) => handleFileChange(e, index)}
                      />
                    </div>
                    <button
                      type="button"
                      className="flex items-center justify-center w-6 h-6 bg-error p-1 rounded shadow cursor-pointer"
                      onClick={() => handleDeleteImage(foto[index].id)}
                    >
                      <Trash2 className="w-6 h-6 text-white" />
                    </button>
                  </div>
                </div>
              )
            )}
            <div className="flex space-x-2">
              {image && (
                <div>
                  <label
                    htmlFor={`image-${index}`}
                    className="flex items-center justify-center w-6 h-6 bg-primaryy p-1 rounded cursor-pointer"
                  >
                    <Folder className="w-6 h-6 text-white" />
                  </label>
                  <Input
                    placeholder="shadcn"
                    className="rounded-full hidden"
                    type="file"
                    name={`image-${index}`}
                    id={`image-${index}`}
                    onChange={(e) => handleFileChange(e, index)}
                  />
                </div>
              )}
              {image && (
                <div>
                  <button
                    type="button"
                    className="flex items-center justify-center w-6 h-6 bg-error p-1 rounded shadow cursor-pointer"
                    onClick={() => handleRemoveImage(index)}
                  >
                    <Trash2 className="w-6 h-6 text-white" />
                  </button>
                </div>
              )}
              {image && foto && foto[index] && (
                <button
                  type="button"
                  className="flex items-center justify-center w-6 h-6 text-white bg-success p-1 rounded cursor-pointer"
                  onClick={() => handleSubmit(index, foto[index].id)}
                  disabled={isLoading[index]} // Submit per file
                >
                  {isLoading[index] ? (
                    <Loader className="animate-spin" />
                  ) : (
                    <Check />
                  )}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
      <h1 className="font-medium mt-7">Sketsa Toponim</h1>
      <div className="grid grid-cols-2 gap-x-4">
        <div className="space-y-2 flex flex-col items-start">
          {selectedSketsa ? (
            <Image
              src={selectedSketsa}
              alt="image"
              className="w-full rounded-lg h-20 object-cover"
              width={80}
              height={80}
            />
          ) : data?.sketsa ? (
            <Image
              src={data?.sketsa}
              alt="image"
              className="w-full rounded-lg h-20 object-cover"
              width={80}
              height={80}
            />
          ) : (
            <p className="py-5">Tidak ada image</p>
          )}
          <div className="flex space-x-2">
            <div>
              <label
                htmlFor="image-one"
                className="flex items-center justify-center w-6 h-6 bg-primaryy p-1 rounded shadow cursor-pointer"
              >
                <Folder className="w-6 h-6 text-white" />
              </label>
              <Input
                placeholder="shadcn"
                className="rounded-full hidden"
                type="file"
                name="image-one"
                id="image-one"
                onChange={(e) => handleFileChangeSketsa(e)}
              />
            </div>
            {selectedSketsa ? (
              <div>
                <button
                  type="button"
                  className="flex items-center justify-center w-6 h-6 bg-error p-1 rounded shadow cursor-pointer"
                  onClick={handleRemoveSektsa}
                >
                  <Trash2 className="w-6 h-6 text-white" />
                </button>
              </div>
            ) : data?.sketsa ? (
              <div>
                <button
                  type="button"
                  className="flex items-center justify-center w-6 h-6 bg-error p-1 rounded shadow cursor-pointer"
                  onClick={handleDeleteSektsa}
                >
                  <Trash2 className="w-6 h-6 text-white" />
                </button>
              </div>
            ) : (
              ""
            )}
            {selectedSketsa && (
              <button
                type="button"
                className="flex items-center justify-center w-6 h-6 text-white bg-success p-1 rounded cursor-pointer"
                onClick={handleSubmitSketsa}
                disabled={isLoadingSkesta} // Submit per file
              >
                {isLoadingSkesta ? (
                  <Loader className="animate-spin" />
                ) : (
                  <Check />
                )}
              </button>
            )}
          </div>
        </div>
      </div>
      <h1 className="font-medium mt-7">Dokumen Pendukung</h1>
      <div className="grid grid-cols-2 gap-x-4">
        <div className="space-y-2 flex flex-col items-start">
          {selectedDoc ? (
            <Image
              src={selectedDoc}
              alt="image"
              className="w-full rounded-lg h-20 object-cover"
              width={80}
              height={80}
            />
          ) : data?.docpendukung ? (
            <Image
              src={data?.docpendukung}
              alt="image"
              className="w-full rounded-lg h-20 object-cover"
              width={80}
              height={80}
            />
          ) : (
            <p className="py-5">Tidak ada image</p>
          )}
          <div className="flex space-x-2">
            <div>
              <label
                htmlFor="image-two"
                className="flex items-center justify-center w-6 h-6 bg-primaryy p-1 rounded shadow cursor-pointer"
              >
                <Folder className="w-6 h-6 text-white" />
              </label>
              <Input
                placeholder="shadcn"
                className="rounded-full hidden"
                type="file"
                name="image-two"
                id="image-two"
                onChange={(e) => handleFileChangeDoc(e)}
              />
            </div>
            {data?.docpendukung && (
              <div>
                <button
                  type="button"
                  className="flex items-center justify-center w-6 h-6 bg-error p-1 rounded shadow cursor-pointer"
                  onClick={handleDeleteDoc}
                >
                  <Trash2 className="w-6 h-6 text-white" />
                </button>
              </div>
            )}
            {selectedDoc && (
              <div>
                <button
                  type="button"
                  className="flex items-center justify-center w-6 h-6 bg-error p-1 rounded shadow cursor-pointer"
                  onClick={handleRemoveDoc}
                >
                  <Trash2 className="w-6 h-6 text-white" />
                </button>
              </div>
            )}
            {selectedDoc && (
              <button
                type="button"
                className="flex items-center justify-center w-6 h-6 text-white bg-success p-1 rounded cursor-pointer"
                onClick={handleSubmitDoc}
                disabled={isLoadingDoc} // Submit per file
              >
                {isLoadingDoc ? <Loader className="animate-spin" /> : <Check />}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
