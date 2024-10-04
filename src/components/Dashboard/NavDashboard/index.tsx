import { HamburgerMenuIcon } from "@radix-ui/react-icons";
import {
  BellIcon,
  ChevronDown,
  LogOut,
  User2,
  UserCircle2Icon,
  X,
} from "lucide-react";
import Image from "next/image";
import { SidebarMobile } from "../Sidebar";
import { useState } from "react";
import Link from "next/link";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

const NavDashboard = () => {
  const [open, setOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(false);

  const [openDropdown2, setOpenDropdown2] = useState(false);
  const router = useRouter();

  const toggleSidebar = () => {
    setOpen(!open);
  };

  const toggleDropdown = () => {
    setOpenDropdown(!openDropdown);
  };

  const toggleDropdown2 = () => {
    setOpenDropdown2(!openDropdown2);
  };

  const logout = () => {
    Cookies.remove("token");
    router.replace("/login");
  };

  return (
    <>
      <nav className="z-10 md:absolute bg-primaryy w-screen px-10 md:px-0 py-4 md:py-0">
        <div className="flex md:hidden w-full md:w-5/12 items-center space-x-2">
          <Image
            src="/assets/icons/logo.svg"
            alt="Logo"
            className="w-[40px] h-[60px] md:w-[35px] md:h-[65px]"
            width={35}
            height={65}
          />
          <div>
            <h1 className="uppercase text-white font-bold text-sm md:text-lg">
              sipeta
            </h1>
            <p className="capitalize font-light text-white text-xs">
              dashboard
            </p>
          </div>
        </div>
        <ul className="hidden md:flex justify-end text-white items-center space-x-6 py-8 px-10">
          <li className="relative">
            <BellIcon />
            <div className="absolute rounded-full text-[8px] bg-red-500 w-4 h-4 flex items-center justify-center -mt-8 ml-3">
              <p>3</p>
            </div>
          </li>
          <li
            className="flex space-x-2 items-center cursor-pointer"
            onClick={toggleDropdown2}
          >
            <UserCircle2Icon className="w-10 h-10" />
            <p>User</p>
            <ChevronDown
              className={`w-4 h-4 transition-all duration-300 ${openDropdown2 ? "rotate-180" : "rotate-0"}`}
            />
          </li>
        </ul>
        {openDropdown2 && (
          <div className="absolute shadow w-1/12 p-4 rounded-lg bg-[#fff] -mt-6 right-4 z-40">
            <ul className="space-y-3 text-slate-300">
              <li>
                <Link href="/profile" className="flex space-x-3 items-center">
                  <User2 />
                  <p>Profile</p>
                </Link>
              </li>
              <li
                className="flex space-x-3 items-center cursor-pointer"
                onClick={logout}
              >
                <LogOut />
                <p>Keluar</p>
              </li>
            </ul>
          </div>
        )}
      </nav>
      <div className="flex shadow px-10 py-3 md:py-0 justify-between items-center text-primaryy">
        <div onClick={toggleSidebar}>
          {open ? (
            <X className="w-6 h-6" />
          ) : (
            <HamburgerMenuIcon className="w-6 h-6" />
          )}
        </div>
        <div className="flex items-center space-x-3">
          <BellIcon className="w-6 h-6" />
          <div className="flex items-center space-x-2" onClick={toggleDropdown}>
            <UserCircle2Icon className="w-6 h-6" />
            <p className="text-sm">User</p>
            <ChevronDown
              className={`w-4 h-4 transition-all duration-300 ${openDropdown ? "rotate-180" : "rotate-0"}`}
            />
          </div>
        </div>
      </div>
      {openDropdown && (
        <div className="absolute shadow w-5/12 p-4 rounded-lg bg-[#fff] right-4 z-40">
          <ul className="space-y-3 text-slate-300">
            <li>
              <Link href="/profile" className="flex space-x-3 items-center">
                <User2 />
                <p>Profile</p>
              </Link>
            </li>
            <li
              className="flex space-x-3 items-center cursor-pointer"
              onClick={logout}
            >
              <LogOut />
              <p>Keluar</p>
            </li>
          </ul>
        </div>
      )}
      <div
        className={`md:hidden relative block z-50 transition-all duration-300 ${open ? "translate-x-0" : "-translate-x-full"}`}
      >
        <SidebarMobile type="large" />
      </div>
    </>
  );
};

export default NavDashboard;
