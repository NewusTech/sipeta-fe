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

export default function DocumentTab() {
  const [selectedImages, setSelectedImages] = useState(["", "", "", ""]);

  const [selectedImagesOri, setSelectedImagesOri] = useState([
    null,
    null,
    null,
    null,
  ]);

  const [valueClassify, setValueClassify] = useState<any>({ id: 0, label: "" });
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const { data: classify } = useSWR<any>(
    `${apiUrl}/datatoponim/get`,
    fetcherWithoutAuth
  );
  const [isLoading, setIsLoading] = useState([false, false, false, false]); // State isLoading per button

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

  const handleSubmit = async (index: number) => {
    const file = selectedImagesOri[index];
    if (file) {
      const updatedLoadingState = [...isLoading];
      updatedLoadingState[index] = true; // Set loading true untuk button yang sesuai
      setIsLoading(updatedLoadingState);
      const formData = new FormData();
      formData.append("foto", file); // Tambahkan file ke FormData

      try {
        const response = await fetch(
          `${apiUrl}/fototoponim/upload-foto/${valueClassify.id}`,
          {
            method: "POST",
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
          title: "Gagal delete!",
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

  console.log(selectedImagesOri);

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  // 2. Define a submit handler.
  function onSubmit(data: z.infer<typeof formSchema>) {
    toast({
      title: "You submitted the following values:",
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    });
  }

  return (
    <div className="mt-4">
      <div className="space-y-4 flex flex-col mb-5">
        <Label htmlFor="id-toponim">Id Toponim</Label>
        <SelectSearch
          data={newClassify}
          valueId={valueClassify}
          setValueId={setValueClassify}
          placeholder="Id Toponim"
        />
      </div>
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
              <div className="w-full rounded-lg h-20 bg-transparent border border-dashed"></div>
            )}
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
              {image && (
                <button
                  type="button"
                  className="flex items-center justify-center w-6 h-6 text-white bg-success p-1 rounded cursor-pointer"
                  onClick={() => handleSubmit(index)}
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
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 mt-2"
          >
            <FormField
              control={form.control}
              name="idToponim"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="space-y-2 flex flex-col items-start">
                      <div className="w-full rounded-lg h-20 bg-transparent border border-dashed"></div>
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
                            {...field}
                            type="file"
                            name="image-one"
                            id="image-one"
                          />
                        </div>
                      </div>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
      </div>
      <h1 className="font-medium mt-7">Dokumen Pendukung</h1>
      <div className="grid grid-cols-2 gap-x-4">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 mt-2"
          >
            <FormField
              control={form.control}
              name="idToponim"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="space-y-2 flex flex-col items-start">
                      <div className="w-full rounded-lg h-20 bg-transparent border border-dashed"></div>
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
                            {...field}
                            type="file"
                            name="image-one"
                            id="image-one"
                          />
                        </div>
                      </div>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
      </div>
    </div>
  );
}
