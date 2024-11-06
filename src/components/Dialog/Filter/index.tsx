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

interface FilterDialogProps {
  onFilterApply: (status: string, date: any) => void;
}

export function FilterDialog({ onFilterApply }: FilterDialogProps) {
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [date, setDate] = useState<any>();
  const [status, setStatus] = useState<string>("");

  const handleOpenAddModal = () => {
    setAddModalOpen(true);
  };

  const handleAddModalClose = () => {
    setAddModalOpen(false);
  };

  const applyFilters = () => {
    // Mengirim status dan date ke parent ketika filter diterapkan
    onFilterApply(status, date);
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
      <DialogContent className="sm:max-w-[525px]" onClick={handleAddModalClose}>
        <DialogHeader>
          <DialogTitle>Filter Data</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-4 py-4">
          <div className="space-y-2">
            <Label>Tanggal</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal rounded-full",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          <div className="space-y-2">
            <Label>Status</Label>
            <Select onValueChange={setStatus}>
              <SelectTrigger className="w-full rounded-full">
                <SelectValue placeholder="Pilih status" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Status</SelectLabel>
                  <SelectItem value="0">Menunggu</SelectItem>
                  <SelectItem value="1">Diverifikasi</SelectItem>
                  <SelectItem value="2">Ditolak</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
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
