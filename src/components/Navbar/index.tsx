"use client";

import Image from "next/image";
import { Button } from "../ui/button";
import { ChevronDown } from "lucide-react";
import Link from "next/link";
import React from "react";
import {
  GoogleMap,
  Marker,
  StandaloneSearchBox,
  useLoadScript,
} from "@react-google-maps/api";
import { Input } from "../../components/ui/input";
import geoJson from "../../constants/lamtura.json";
import geoJson2 from "../../constants/lamturaa.json";

const Navbar = () => {
  // const [openDropdown, setOpenDropdown] = useState(false);

  return (
    <>
      <div className="bg-primaryy">
        <nav className="container mx-auto flex justify-between items-center py-5">
          <div className="flex w-5/12 items-center space-x-2">
            <Image
              src="/assets/icons/logo.svg"
              alt="Logo"
              className="w-[35px] h-[65px]"
              width={35}
              height={65}
            />
            <div>
              <h1 className="uppercase text-white font-bold text-lg">sipeta</h1>
              <p className="uppercase font-light text-white text-xs">
                sistem informasi pengelolaan data kewilayahan lampung utara
              </p>
            </div>
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
              className="rounded-full h-10 flex items-center px-8 bg-transparent border border-white text-white"
            >
              Masuk
            </Link>
          </div>
        </nav>
      </div>
      <div className="py-5 border-b border-primaryy">
        <ul className="container mx-auto flex items-center space-x-10 uppercase text-primaryy">
          <li className="cursor-pointer">Beranda</li>
          <li className="cursor-pointer">Daftar Nama Rupabumi</li>
          <li className="cursor-pointer">Petunjuk Penggunaan</li>
          <li className="cursor-pointer">Kecamatan</li>
          <li className="cursor-pointer">Kontak</li>
        </ul>
      </div>
    </>
  );
};

export default Navbar;
