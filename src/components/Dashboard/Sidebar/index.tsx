"use client";

import { ChevronDown, Database, LayoutDashboard, MapIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const Sidebar = ({ type }: { type?: string }) => {
  const [dropdown, setDropdown] = useState(false);

  const toggleDropdown = () => {
    setDropdown(!dropdown);
  };

  return (
    <aside
      className={`hidden md:block ${type === "large" ? "w-[228px]" : "w-[100px]"} h-screen bg-[#F6F6F6] fixed p-6 z-50`}
    >
      {type === "large" ? (
        <>
          <div className="flex space-x-4">
            <Image
              src="/assets/icons/logo.svg"
              className="w-[40px] h-[60px]"
              width={40}
              height={60}
              alt="logo"
            />
            <div>
              <h1 className="text-primaryy uppercase text-2xl font-bold">
                sipeta
              </h1>
              <p className="font-light text-sm text-primaryy">Dashboard</p>
            </div>
          </div>
          <ul className="text-primaryy mt-14 cursor-pointer text-[15px]">
            <li className="p-3 rounded-md flex items-center space-x-3 hover:bg-primaryy hover:bg-opacity-20 transition-all duration-300 hover:font-medium hover:text-primaryy">
              <LayoutDashboard />
              <Link href="/dashboard">
                <p>Dashboard</p>
              </Link>
            </li>
            <li className="p-3 rounded-md flex items-center space-x-3 hover:bg-primaryy hover:bg-opacity-20 transition-all duration-300 hover:font-medium hover:text-primaryy">
              <MapIcon />
              <Link href="/naming">
                <p>Pendataan</p>
              </Link>
            </li>
            <li
              onClick={toggleDropdown}
              className="p-3 rounded-md flex items-center space-x-3 hover:bg-primaryy hover:bg-opacity-20 transition-all duration-300 hover:font-medium hover:text-primaryy"
            >
              <Database />
              <p>Master Data</p>
              <ChevronDown
                className={`w-4 h-4 transition-all duration-300 ${dropdown ? "rotate-180" : "rotate-0"}`}
              />
            </li>
            {dropdown && (
              <ul className="space-y-2 bg-primaryy bg-opacity-10 p-3 rounded-lg mt-2">
                <li className="hover:translate-x-2 duration-300 transition-all">
                  <Link href="/master-data/district">Kecamatan</Link>
                </li>
                <li className="hover:translate-x-2 duration-300 transition-all">
                  <Link href="/master-data/village">Desa</Link>
                </li>
              </ul>
            )}
          </ul>
        </>
      ) : (
        <>
          <div className="flex space-x-4">
            <Image
              src="/assets/icons/logo.svg"
              className="w-[40px] h-[60px]"
              width={40}
              height={60}
              alt="logo"
            />
          </div>
          <ul className="text-primaryy mt-14 font-light cursor-pointer text-[15px]">
            <li className="p-3 rounded-md hover:bg-primaryy hover:bg-opacity-20 transition-all duration-300 hover:font-medium hover:text-primaryy">
              <LayoutDashboard />
            </li>
            <li className="p-3 rounded-md flex items-center justify-between hover:bg-primaryy hover:bg-opacity-20 transition-all duration-300 hover:font-medium hover:text-primaryy">
              <Link href="/naming">
                <MapIcon />
              </Link>
            </li>
          </ul>
        </>
      )}
    </aside>
  );
};

const SidebarMobile = ({ type }: { type?: string }) => {
  const [dropdown, setDropdown] = useState(false);

  const toggleDropdown = () => {
    setDropdown(!dropdown);
  };

  return (
    <aside
      className={`md:hidden block ${type === "large" ? "w-[228px]" : "w-[100px]"} h-screen bg-[#F6F6F6] fixed p-6 z-50`}
    >
      {type === "large" ? (
        <>
          <div className="flex space-x-4">
            <Image
              src="/assets/icons/logo.svg"
              className="w-[40px] h-[60px]"
              width={40}
              height={60}
              alt="logo"
            />
            <div>
              <h1 className="text-primaryy uppercase text-2xl font-bold">
                sipeta
              </h1>
              <p className="font-light text-sm text-primaryy">Dashboard</p>
            </div>
          </div>
          <ul className="text-primaryy mt-14 cursor-pointer text-[15px]">
            <li className="p-3 rounded-md flex items-center space-x-3 hover:bg-primaryy hover:bg-opacity-20 transition-all duration-300 hover:font-medium hover:text-primaryy">
              <LayoutDashboard />
              <Link href="/dashboard">
                <p>Dashboard</p>
              </Link>
            </li>
            <li className="p-3 rounded-md flex items-center space-x-3 hover:bg-primaryy hover:bg-opacity-20 transition-all duration-300 hover:font-medium hover:text-primaryy">
              <MapIcon />
              <Link href="/naming">
                <p>Pendataan</p>
              </Link>
            </li>
            <li
              onClick={toggleDropdown}
              className="p-3 rounded-md flex items-center space-x-3 hover:bg-primaryy hover:bg-opacity-20 transition-all duration-300 hover:font-medium hover:text-primaryy"
            >
              <Database />
              <p>Master Data</p>
              <ChevronDown
                className={`w-4 h-4 transition-all duration-300 ${dropdown ? "rotate-180" : "rotate-0"}`}
              />
            </li>
            {dropdown && (
              <ul className="space-y-2 bg-primaryy bg-opacity-10 p-3 rounded-lg mt-2">
                <li className="hover:translate-x-2 duration-300 transition-all">
                  <Link href="/master-data/district">Kecamatan</Link>
                </li>
                <li className="hover:translate-x-2 duration-300 transition-all">
                  <Link href="/master-data/village">Desa</Link>
                </li>
              </ul>
            )}
          </ul>
        </>
      ) : (
        <>
          <div className="flex space-x-4">
            <Image
              src="/assets/icons/logo.svg"
              className="w-[40px] h-[60px]"
              width={40}
              height={60}
              alt="logo"
            />
          </div>
          <ul className="text-primaryy mt-14 font-light cursor-pointer text-[15px]">
            <li className="p-3 rounded-md hover:bg-primaryy hover:bg-opacity-20 transition-all duration-300 hover:font-medium hover:text-primaryy">
              <LayoutDashboard />
            </li>
            <li className="p-3 rounded-md flex items-center justify-between hover:bg-primaryy hover:bg-opacity-20 transition-all duration-300 hover:font-medium hover:text-primaryy">
              <Link href="/naming">
                <MapIcon />
              </Link>
            </li>
          </ul>
        </>
      )}
    </aside>
  );
};

export {Sidebar, SidebarMobile};
