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
import { Check, ChevronDown, Folder, Trash, Trash2 } from "lucide-react";
import { useState } from "react";
import { Label } from "../../ui/label";

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
      <h1 className="font-medium">Foto Toponim</h1>
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
                    <div className="space-y-2 flex flex-col items-center">
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
                        <div>
                          <label
                            htmlFor="image-one"
                            className="flex items-center justify-center w-6 h-6 bg-error p-1 rounded shadow cursor-pointer"
                          >
                            <Trash2 className="w-6 h-6 text-white" />
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
                    <div className="space-y-2 flex flex-col items-center">
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
                        <div>
                          <label
                            htmlFor="image-one"
                            className="flex items-center justify-center w-6 h-6 bg-error p-1 rounded shadow cursor-pointer"
                          >
                            <Trash2 className="w-6 h-6 text-white" />
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
                    <div className="space-y-2 flex flex-col items-center">
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
                        <div>
                          <label
                            htmlFor="image-one"
                            className="flex items-center justify-center w-6 h-6 bg-error p-1 rounded shadow cursor-pointer"
                          >
                            <Trash2 className="w-6 h-6 text-white" />
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
                    <div className="space-y-2 flex flex-col items-center">
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
                        <div>
                          <label
                            htmlFor="image-one"
                            className="flex items-center justify-center w-6 h-6 bg-error p-1 rounded shadow cursor-pointer"
                          >
                            <Trash2 className="w-6 h-6 text-white" />
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
