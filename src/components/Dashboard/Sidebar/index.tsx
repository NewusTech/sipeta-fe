"use client";

import { ChevronDown } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const Sidebar = () => {
  const [dropdown, setDropdown] = useState(false);

  const toggleDropdown = () => {
    setDropdown(!dropdown);
  };

  return (
    <aside className="w-[228px] h-screen bg-[#F6F6F6] fixed p-6 z-50">
      <div className="flex space-x-4">
        <Image
          src="/assets/icons/logo.svg"
          className="w-[40px] h-[60px]"
          width={40}
          height={60}
          alt="logo"
        />
        <div>
          <h1 className="text-primaryy uppercase text-2xl font-bold">sipeta</h1>
          <p className="font-light text-sm text-primaryy">Dashboard</p>
        </div>
      </div>
      <ul className="text-primaryy mt-14 font-light cursor-pointer text-[15px]">
        <li className="p-3 rounded-md hover:bg-primaryy hover:bg-opacity-20 transition-all duration-300 hover:font-medium hover:text-primaryy">
          Dashboard
        </li>
        <li
          onClick={toggleDropdown}
          className="p-3 rounded-md flex items-center justify-between hover:bg-primaryy hover:bg-opacity-20 transition-all duration-300 hover:font-medium hover:text-primaryy"
        >
          <p>Pengelolaan Data</p>
          <ChevronDown
            className={`opacity-70 h-5 w-5 transation-transform transform duration-300 ${dropdown ? "rotate-180" : ""}`}
          />
        </li>
        {dropdown && (
          <div className="flex flex-col gap-y-2 my-2 text-[15px]">
            <Link href="/manage-data">
              <p className="hover:translate-x-3 transition duration-300">
                Pendataan
              </p>
            </Link>
            <Link href="/naming">
              <p className="hover:translate-x-3 transition duration-300">
                Pemberian Nama
              </p>
            </Link>
          </div>
        )}
        <li className="p-3 rounded-md hover:bg-primaryy hover:bg-opacity-20 transition-all duration-300 hover:font-medium hover:text-primaryy">
          Penelaahan
        </li>
      </ul>
    </aside>
  );
};

export default Sidebar;
