"use client";

import * as React from "react";
import { Check, ChevronDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "../../../../components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../../../../components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../../../components/ui/popover";
import { NamingForm } from "../../../../components/Form/Naming";
import { GoogleMap, Marker, LoadScript } from "@react-google-maps/api";

const frameworks = [
  {
    value: "next.js",
    label: "Next.js",
  },
  {
    value: "sveltekit",
    label: "SvelteKit",
  },
  {
    value: "nuxt.js",
    label: "Nuxt.js",
  },
  {
    value: "remix",
    label: "Remix",
  },
  {
    value: "astro",
    label: "Astro",
  },
];

export default function CreateNamingPage() {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState("");

  return (
    <section>
      <h1 className="text-primaryy">Form Tambah Usulan Pemberian Nama</h1>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-1/2 justify-between rounded-full mt-5"
          >
            {value
              ? frameworks.find((framework) => framework.value === value)?.label
              : "Select..."}
            <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0">
          <Command>
            <CommandInput placeholder="Search..." />
            <CommandList>
              <CommandEmpty>No framework found.</CommandEmpty>
              <CommandGroup>
                {frameworks.map((framework) => (
                  <CommandItem
                    key={framework.value}
                    value={framework.value}
                    onSelect={(currentValue) => {
                      setValue(currentValue === value ? "" : currentValue);
                      setOpen(false);
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        value === framework.value ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {framework.label}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      <div className="mt-4">
        <LoadScript googleMapsApiKey={apiKey} libraries={["places"]}>
            {!onEdit && <button type="button" onClick={getCurrentLocation} className="bg-blue-500 text-white px-4 py-2 mt-1 mb-2.5 rounded-md">
                Lokasi Anda
            </button>}

            {!onEdit && <div>
                {/* Tambahkan input teks untuk pencarian tempat */}
                <div
                    className={p-1 w-full md:w-2/3 lg:w-1/3 rounded border border-neutral-200 dark:border-neutral-600 flex justify-between items-center gap-1 bg-white dark:bg-white mb-2}
                >
                    <input
                        type="text"
                        value={searchText}
                        onChange={handleSearchInputChange}
                        placeholder="Cari tempat..."
                        className={flex-1 bg-transparent outline-none appearance-none dark:text-neutral-700}
                    />

                    <button
                        type="button"
                        onClick={() => handlePlaceSearch(searchText)}
                        className="bg-blue-500 text-white px-4 py-2 rounded-md"
                    >
                        Cari
                    </button>
                </div>

            </div>}

            <GoogleMap
                mapContainerStyle={MapContainerStyle}
                center={currentLocation || { lat: -5.388940618584505, lng: 105.27898506137839 }}
                zoom={13}
                onClick={handleMapClick}
            >
                {currentLocation && <Marker position={currentLocation} />}
            </GoogleMap>

            {addressInfo && (
                <div>
                    <p>Provinsi: {addressInfo.province}</p>
                    <p>Kota: {addressInfo.city}</p>
                    <p>Kecamatan: {addressInfo.subdistrict}</p>
                    <p>Kelurahan: {addressInfo.village}</p>
                </div>
            )}

        </LoadScript>
      </div>
      <div className="mt-4">
        <NamingForm />
      </div>
    </section>
  );
}
