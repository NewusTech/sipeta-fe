"use client";

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
import { Check, ChevronDown } from "lucide-react";
import { useState } from "react";

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
    message: "Mauskann ID Toponim",
  }),
  typeGemoetry: z.string({
    required_error: "Pilih tipe geometri.",
  }),
  classcificationToponim: z.string({
    required_error: "Masukkan klasifikasi toponim.",
  }),
  unsur: z.string({
    required_error: "Pilih unsur.",
  }),
  district: z.string({
    message: "Pilih kecamatan.",
  }),
  village: z.string({
    message: "Pilih desa.",
  }),
  name: z.string({
    message: "Masukkan nama lokal.",
  }),
  nameSpesific: z.string({
    message: "Masukkan nama spesifik.",
  }),
  nameMap: z.string({
    message: "Masukan nama peta.",
  }),
  mainCoordinat: z.string({
    message: "Masukan koordinat utama.",
  }),
  lat: z.string({
    message: "Masukan garis bujur.",
  }),
  long: z.string({
    message: "Masukkan garis lintang.",
  }),
});

export default function InformationForm() {
  const [step, setStep] = useState(1);

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

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-5">
        {step === 1 && (
          <>
            {/* Step 1 Fields */}
            <FormField
              control={form.control}
              name="idToponim"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Id Toponim</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="shadcn"
                      className="rounded-full"
                      {...field}
                      disabled
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="typeGemoetry"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Tipe Geometri</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          className={cn(
                            "w-full justify-between rounded-full",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value
                            ? languages.find(
                                (language) => language.value === field.value
                              )?.label
                            : "Select language"}
                          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0">
                      <Command>
                        <CommandInput placeholder="Search language..." />
                        <CommandList>
                          <CommandEmpty>No language found.</CommandEmpty>
                          <CommandGroup>
                            {languages.map((language) => (
                              <CommandItem
                                value={language.label}
                                key={language.value}
                                onSelect={() => {
                                  form.setValue("typeGemoetry", language.value);
                                }}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    language.value === field.value
                                      ? "opacity-100"
                                      : "opacity-0"
                                  )}
                                />
                                {language.label}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="classcificationToponim"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Klasifikasi Toponim</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          className={cn(
                            "w-full justify-between rounded-full",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value
                            ? languages.find(
                                (language) => language.value === field.value
                              )?.label
                            : "Select language"}
                          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0">
                      <Command>
                        <CommandInput placeholder="Search language..." />
                        <CommandList>
                          <CommandEmpty>No language found.</CommandEmpty>
                          <CommandGroup>
                            {languages.map((language) => (
                              <CommandItem
                                value={language.label}
                                key={language.value}
                                onSelect={() => {
                                  form.setValue("typeGemoetry", language.value);
                                }}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    language.value === field.value
                                      ? "opacity-100"
                                      : "opacity-0"
                                  )}
                                />
                                {language.label}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="unsur"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Unsur</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          className={cn(
                            "w-full justify-between rounded-full",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value
                            ? languages.find(
                                (language) => language.value === field.value
                              )?.label
                            : "Select language"}
                          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0">
                      <Command>
                        <CommandInput placeholder="Search language..." />
                        <CommandList>
                          <CommandEmpty>No language found.</CommandEmpty>
                          <CommandGroup>
                            {languages.map((language) => (
                              <CommandItem
                                value={language.label}
                                key={language.value}
                                onSelect={() => {
                                  form.setValue("typeGemoetry", language.value);
                                }}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    language.value === field.value
                                      ? "opacity-100"
                                      : "opacity-0"
                                  )}
                                />
                                {language.label}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="district"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Kecamatan</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="shadcn"
                      className="rounded-full"
                      {...field}
                      disabled
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="village"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Desa</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="shadcn"
                      className="rounded-full"
                      {...field}
                      disabled
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end">
              <Button
                onClick={nextStep}
                className="bg-primaryy rounded-full"
                type="button"
              >
                Next
              </Button>
            </div>
          </>
        )}

        {step === 2 && (
          <>
            {/* Step 2 Fields */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nama Lokal</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="shadcn"
                      className="rounded-full"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="nameSpesific"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nama Spesifik</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="shadcn"
                      className="rounded-full"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="nameMap"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nama Peta</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="shadcn"
                      className="rounded-full"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="mainCoordinat"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Koordinat Utama</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="shadcn"
                      className="rounded-full"
                      {...field}
                      disabled
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="lat"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bujur</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="shadcn"
                      className="rounded-full"
                      {...field}
                      disabled
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="long"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Lintang</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="shadcn"
                      className="rounded-full"
                      {...field}
                      disabled
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex space-x-2 justify-between">
              <Button
                onClick={prevStep}
                className="rounded-full bg-transparent border border-primaryy text-primaryy hover:bg-primaryy hover:text-white"
                type="button"
              >
                Previous
              </Button>
              <Button type="submit" className="rounded-full bg-primaryy">
                Submit
              </Button>
            </div>
          </>
        )}
      </form>
    </Form>
  );
}
