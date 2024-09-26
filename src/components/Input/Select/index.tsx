"use client";

import * as React from "react";
import { Check, ChevronDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "../../ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../../ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "../../ui/popover";

interface SelectSearchProps {
  data: { value: string | number; label: string }[]; // Definisikan tipe data
  placeholder: string;
  valueId?: { id: string | number; label: string };
  type?: string;
  setValueId?: (v: { id: string | number; label: string }) => void;
}

const SelectSearch: React.FC<SelectSearchProps> = ({
  data,
  placeholder,
  type,
  valueId,
  setValueId,
}) => {
  const [open, setOpen] = React.useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between rounded-full"
        >
          {valueId?.id
            ? data?.find((v: any) => v.value === valueId.id)?.label
            : `Pilih ${placeholder}`}
          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[400px] p-0">
        <Command>
          <CommandInput placeholder={`Cari ${placeholder}`} />
          <CommandList>
            <CommandEmpty>No data found.</CommandEmpty>
            <CommandGroup>
              {data?.map((v: any) => (
                <CommandItem
                  key={v.id}
                  value={v.label}
                  onSelect={() => {
                    setValueId && setValueId({ id: v.value, label: v.label });
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      valueId?.id === v.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {v.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default SelectSearch;
