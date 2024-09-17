"use client";

import Image from "next/image";
import { Button } from "../ui/button";
import { ChevronDown } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const Navbar = () => {
  const [openDropdown, setOpenDropdown] = useState(false);

  const toggleDropdown = () => {
    setOpenDropdown((prevState) => !prevState);
  };

  return (
    <nav className="container mx-auto flex justify-between bg-transparent">
      <div className="flex w-5/12 space-x-2">
        <Image
          src="/assets/icons/logo.svg"
          alt="Logo"
          className="w-[55px] h-[69px]"
          width={55}
          height={69}
        />
        <div>
          <h1 className="uppercase text-primaryy font-bold text-lg">sipeta</h1>
          <p className="uppercase font-light text-primaryy text-xs">
            sistem informasi pengelolaan data kewilayahan lampung utara
          </p>
        </div>
      </div>
      <div className="flex space-x-10 font-medium text-primaryy group relative">
        <h5>Daftar Wilayah</h5>
        <div onClick={toggleDropdown} className="cursor-pointer">
          <ChevronDown
            className={`transform duration-300 transition-transform ${openDropdown ? "rotate-180" : ""}`}
          />
        </div>
        {openDropdown && (
          <div className="bg-white rounded-lg absolute mt-9 w-[196px] p-3 text-greyy font-light">
            <ul className="space-y-2">
              <li>Abjad</li>
              <li>Area</li>
              <li>Koordinat</li>
              <li>Nama & Kegiatan</li>
            </ul>
          </div>
        )}
      </div>
      <div className="flex space-x-2">
        <Link
          href="/register"
          className="rounded-full w-full h-10 flex items-center px-8 bg-white text-primaryy"
        >
          Daftar
        </Link>
        <Link
          href="/login"
          className="rounded-full  h-10 flex items-center px-8 bg-primaryy text-white"
        >
          Masuk
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
