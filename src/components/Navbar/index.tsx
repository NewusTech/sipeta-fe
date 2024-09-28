"use client";

import Image from "next/image";
import { Button } from "../ui/button";
import { ChevronDown, LayoutDashboardIcon, LogOut, X } from "lucide-react";
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
import { usePathname } from "next/navigation";
import path from "path";
import { HamburgerMenuIcon } from "@radix-ui/react-icons";
import Cookies from "js-cookie";

const Navbar = () => {
  // const [openDropdown, setOpenDropdown] = useState(false);
  const [openDropdown, setOpenDropdown] = React.useState(false);
  const [openDropdownName, setOpenDropdownName] = React.useState(false);
  const pathname = usePathname();

  const token = Cookies.get("token");

  const isActive = (path: string) => pathname === path;

  const toggleDropdown = () => {
    setOpenDropdown(!openDropdown);
  };

  const toggleDropdownName = () => {
    setOpenDropdownName(!openDropdownName);
  };

  return (
    <div>
      <div className="bg-primaryy">
        <nav className="container mx-auto flex justify-between items-center py-5">
          <div className="flex w-full md:w-5/12 items-center space-x-2">
            <Image
              src="/assets/icons/logo.svg"
              alt="Logo"
              className="w-[60px] h-[80px] md:w-[35px] md:h-[65px]"
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
          <div className="md:flex space-x-2 hidden">
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
        <div className="flex justify-between md:hidden items-center container">
          {token ? (
            <div className="relative">
              <Button
                onClick={toggleDropdownName}
                className="rounded-full bg-primaryy flex space-x-4 items-center"
              >
                <p>Aris</p>
                <ChevronDown
                  className={`text-white w-5 h-5 transition-all duration-300 ${openDropdownName ? "rotate-180" : "rotate-0"}`}
                />
              </Button>
              {openDropdownName && (
                <div className="bg-white space-y-2 rounded-lg absolute shadow z-50 w-[175px] h-[84px] mt-5 p-4">
                  <div className="flex space-x-4 items-center transition-all duration-300 hover:translate-x-5">
                    <LayoutDashboardIcon className="text-primaryy w-5 h-5" />
                    <Link href="/dashboard" className="text-primaryy">
                      Dashboard
                    </Link>
                  </div>
                  <div className="flex space-x-4 items-center transition-all duration-300 hover:translate-x-5">
                    <LogOut className="text-slate-300 w-5 h-5" />
                    <Link href="/dashboard" className="text-slate-300">
                      Dashboard
                    </Link>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex space-x-2">
              <Link
                href="/register"
                className="rounded-full h-10 flex items-center px-8 bg-primaryy text-white"
              >
                Daftar
              </Link>
              <Link
                href="/login"
                className="rounded-full h-10 flex items-center px-8 bg-transparent border border-primaryy text-primaryy"
              >
                Masuk
              </Link>
            </div>
          )}
          <div onClick={toggleDropdown}>
            {!openDropdown ? (
              <HamburgerMenuIcon className="text-primaryy w-8 h-8" />
            ) : (
              <X className="text-primaryy w-8 h-8" />
            )}
          </div>
        </div>
        <ul className="container mx-auto hidden md:flex items-center space-x-10 uppercase text-primaryy">
          <li
            className={`cursor-pointer hover:text-blue-950 ${isActive("/") ? "font-semibold" : ""}`}
          >
            <Link href="/">Beranda</Link>
          </li>
          <li
            className={`cursor-pointer hover:text-blue-950 ${isActive("/list-name") ? "font-semibold" : "font-light"}`}
          >
            <Link href="/list-name">Daftar Nama Rupabumi</Link>
          </li>
          <li
            className={`cursor-pointer hover:text-blue-950 ${isActive("/instructions-for-use") ? "font-semibold" : "font-light"}`}
          >
            <Link href="/instructions-for-use">Petunjuk Penggunaan</Link>
          </li>
          <li
            className={`cursor-pointer hover:text-blue-950 ${isActive("/district") ? "font-semibold" : "font-light"}`}
          >
            <Link href="/district">Kecamatan</Link>
          </li>
          <li
            className={`cursor-pointer hover:text-blue-950 ${isActive("/contact") ? "font-semibold" : "font-light"}`}
          >
            <Link href="/contact">Kontak</Link>
          </li>
        </ul>
      </div>
      <div
        className={`md:hidden absolute z-40 bg-white w-full duration-300 transition-all ${!openDropdown ? "-translate-x-full" : "translate-x-0"}`}
      >
        <ul className="container mx-auto flex flex-col items-end space-y-3 py-5 uppercase text-primaryy">
          <li
            className={`cursor-pointer hover:text-blue-950 ${isActive("/") ? "font-bold" : ""}`}
          >
            <Link href="/">Beranda</Link>
          </li>
          <li
            className={`cursor-pointer hover:text-blue-950 ${isActive("/list-name") ? "font-bold" : ""}`}
          >
            <Link href="/list-name">Daftar Nama Rupabumi</Link>
          </li>
          <li
            className={`cursor-pointer hover:text-blue-950 ${isActive("/instructions-for-use") ? "font-bold" : ""}`}
          >
            <Link href="/instructions-for-use">Petunjuk Penggunaan</Link>
          </li>
          <li
            className={`cursor-pointer hover:text-blue-950 ${isActive("/district") ? "font-bold" : ""}`}
          >
            <Link href="/district">Kecamatan</Link>
          </li>
          <li
            className={`cursor-pointer hover:text-blue-950 ${isActive("/contact") ? "font-bold" : ""}`}
          >
            <Link href="/contact">Kontak</Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Navbar;
