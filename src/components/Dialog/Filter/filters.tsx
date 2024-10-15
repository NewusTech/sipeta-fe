"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { format } from "date-fns";
import { Calendar as CalendarIcon, ListFilter } from "lucide-react";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { cn } from "lib/utils";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import SelectSearch from "@/components/Input/Select";
import useSWR from "swr";
import { fetcherWithoutAuth } from "constants/fetcher";

interface FilterDialogProps {
  onFilterApply: (unsur: string, district: string, date: any) => void;
}

export function FiltersDialog({ onFilterApply }: FilterDialogProps) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [date, setDate] = useState<any>();
  const [valueUnsur, setValueUnsur] = useState<any>({ id: 0, label: "" });
  const [valueDistrict, setValueDistrict] = useState<any>({ id: 0, label: "" });

  const { data: unsur } = useSWR<any>(
    `${apiUrl}/unsur/get`,
    fetcherWithoutAuth
  );
  const { data: district } = useSWR<any>(
    `${apiUrl}/kecamatan/get?limit=50`,
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

  const handleOpenAddModal = () => {
    setAddModalOpen(true);
  };

  const handleAddModalClose = () => {
    setAddModalOpen(false);
  };

  const applyFilters = () => {
    // Mengirim status dan date ke parent ketika filter diterapkan
    onFilterApply(valueDistrict, valueUnsur, date);
    handleAddModalClose();
  };

  return (
    <Dialog open={addModalOpen}>
      <DialogTrigger asChild>
        <div
          onClick={handleOpenAddModal}
          className="flex cursor-pointer rounded-full w-[80px] h-[28px] items-center px-2 justify-between border border-primaryy mt-[15px]"
        >
          <ListFilter className="h-4 w-4 text-primaryy" />
          <p className="text-primaryy font-light">Filter</p>
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Filter Data</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-4 py-4">
          <div className="space-y-4 flex flex-col">
            <Label htmlFor="name">Unsur</Label>
            <SelectSearch
              data={newUnsur}
              placeholder="Unsur"
              valueId={valueUnsur}
              setValueId={setValueUnsur}
            />
          </div>
          <div className="space-y-4 flex flex-col">
            <Label htmlFor="name">Kecamatan</Label>
            <SelectSearch
              data={newDistrict}
              valueId={valueDistrict}
              setValueId={setValueDistrict}
              placeholder="Kecamatan"
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            onClick={applyFilters}
            className="bg-primaryy hover:bg-blue-500 rounded-full"
          >
            Filter
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
