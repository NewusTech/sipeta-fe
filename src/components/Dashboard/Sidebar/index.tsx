"use client";

import UploadFileJsonDialog from "@/components/Dialog/UploadJson";
import { jwtDecode } from "jwt-decode";
import {
  ChevronDown,
  Database,
  LayoutDashboard,
  MapIcon,
  MapPinCheck,
  User2Icon,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";

const Sidebar = ({ type }: { type?: string }) => {
  const [token, setToken] = useState<string | undefined>("");
  const [role, setRole] = useState<string | undefined>("");

  const router = useRouter();
  const pathname = usePathname();
  const isActive = (path: string) => {
    if (path === "/") {
      return pathname === path;
    }
    return pathname.startsWith(path);
  };
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const toggleDropdown = (dropdownName: string) => {
    setOpenDropdown((prev) => (prev === dropdownName ? null : dropdownName));
  };

  // Check if the route matches and set the dropdown open accordingly
  useEffect(() => {
    if (pathname.startsWith("/review")) {
      setOpenDropdown("penelaahan");
    } else if (pathname.startsWith("/user")) {
      setOpenDropdown("peran-pengguna");
    } else if (pathname.startsWith("/master-data")) {
      setOpenDropdown("master-data");
    }
  }, [pathname]);

  useEffect(() => {
    const tokenn = Cookies.get("token");
    setToken(tokenn);
    if (tokenn) {
      try {
        const decodedToken = jwtDecode<any>(tokenn);

        console.log("Decoded Token:", decodedToken);
        setRole(decodedToken.role);

        // Anda bisa menggunakan data decodedToken di sini
        // contoh: console.log(`User ID: ${decodedToken.userId}`);
      } catch (error) {
        console.error("Invalid token", error);
      }
    } else {
      console.log("No token found in cookies");
    }
  }, []);

  return (
    <aside
      className={`hidden md:block md:-mt-6 ${type === "large" ? "w-[228px]" : "w-[100px]"} h-screen bg-[#F6F6F6] fixed p-6 z-50 overflow-auto`}
    >
      {type === "large" ? (
        <>
          <Link href="/dashboard" className="flex space-x-4">
            <Image
              src="/assets/icons/logo.svg"
              className="w-[40px] h-[60px]"
              width={40}
              height={60}
              alt="logo"
            />
            <div>
              <h1 className="text-primaryy uppercase text-2xl font-bold">
                sitmap
              </h1>
              <h6 className="text-primaryy uppercase text-sm font-medium">
                lampung utara
              </h6>
              <p className="font-light text-sm text-primaryy">Dashboard</p>
            </div>
          </Link>
          <ul className="text-primaryy space-y-2 mt-14 cursor-pointer text-[15px]">
            <li
              className={`p-3 rounded-md flex items-center space-x-3 ${
                isActive("/dashboard")
                  ? "bg-primaryy text-white font-medium"
                  : ""
              }  hover:bg-primaryy hover:bg-opacity-20 transition-all duration-300 hover:font-medium hover:text-primaryy`}
            >
              <LayoutDashboard />
              <Link href="/dashboard">
                <p>Dashboard</p>
              </Link>
            </li>
            <li
              className={`p-3 rounded-md flex items-center space-x-3 ${
                isActive("/naming") ? "bg-primaryy text-white font-medium" : ""
              }  hover:bg-primaryy hover:bg-opacity-20 transition-all duration-300 hover:font-medium hover:text-primaryy`}
            >
              <MapIcon />
              <Link href="/naming">
                <p>Pendataan</p>
              </Link>
            </li>

            {role === "Verifikator" && (
              <>
                <li
                  onClick={() => toggleDropdown("penelaahan")}
                  className={`p-3 rounded-md flex items-center space-x-3 ${
                    isActive("/review")
                      ? "bg-primaryy text-white font-medium"
                      : openDropdown === "penelaahan"
                        ? "bg-primaryy bg-opacity-20"
                        : ""
                  }  hover:bg-primaryy hover:bg-opacity-20 transition-all duration-300 hover:font-medium hover:text-primaryy`}
                >
                  <MapPinCheck />
                  <p>Penelaahan</p>
                  <ChevronDown
                    className={`w-4 h-4 transition-all duration-300 ${openDropdown === "penelaahan" ? "rotate-180" : "rotate-0"}`}
                  />
                </li>
                {openDropdown === "penelaahan" && (
                  <ul className="space-y-3 bg-primaryy bg-opacity-10 p-3 rounded-lg mt-2">
                    <li
                      className={`${
                        isActive("/review/has-been-reviewed") ? "font-bold" : ""
                      } hover:translate-x-2 duration-300 transition-all`}
                    >
                      <Link href="/review/has-been-reviewed">
                        Sudah Ditelaah
                      </Link>
                    </li>
                    <li
                      className={`${
                        isActive("/review/has-not-been-reviewed")
                          ? "font-bold"
                          : ""
                      } hover:translate-x-2 duration-300 transition-all`}
                    >
                      <Link href="/review/has-not-been-reviewed">
                        Belum Ditelaah
                      </Link>
                    </li>
                    <li
                      className={`${
                        isActive("/review/revision") ? "font-bold" : ""
                      } hover:translate-x-2 duration-300 transition-all`}
                    >
                      <Link href="/review/revision">Sudah Direvisi</Link>
                    </li>
                    <li
                      className={`${
                        isActive("/review/declined") ? "font-bold" : ""
                      } hover:translate-x-2 duration-300 transition-all`}
                    >
                      <Link href="/review/declined">Ditolak</Link>
                    </li>
                  </ul>
                )}
              </>
            )}

            {role === "Super Admin" && (
              <>
                <li
                  onClick={() => toggleDropdown("penelaahan")}
                  className={`p-3 rounded-md flex items-center space-x-3 ${
                    isActive("/review")
                      ? "bg-primaryy text-white font-medium"
                      : openDropdown === "penelaahan"
                        ? "bg-primaryy bg-opacity-20"
                        : ""
                  }  hover:bg-primaryy hover:bg-opacity-20 transition-all duration-300 hover:font-medium hover:text-primaryy`}
                >
                  <MapPinCheck />
                  <p>Penelaahan</p>
                  <ChevronDown
                    className={`w-4 h-4 transition-all duration-300 ${openDropdown === "penelaahan" ? "rotate-180" : "rotate-0"}`}
                  />
                </li>
                {openDropdown === "penelaahan" && (
                  <ul className="space-y-3 bg-primaryy bg-opacity-10 p-3 rounded-lg mt-2">
                    <li
                      className={`${
                        isActive("/review/has-been-reviewed") ? "font-bold" : ""
                      } hover:translate-x-2 duration-300 transition-all`}
                    >
                      <Link href="/review/has-been-reviewed">
                        Sudah Ditelaah
                      </Link>
                    </li>
                    <li
                      className={`${
                        isActive("/review/has-not-been-reviewed")
                          ? "font-bold"
                          : ""
                      } hover:translate-x-2 duration-300 transition-all`}
                    >
                      <Link href="/review/has-not-been-reviewed">
                        Belum Ditelaah
                      </Link>
                    </li>
                    <li
                      className={`${
                        isActive("/review/revision") ? "font-bold" : ""
                      } hover:translate-x-2 duration-300 transition-all`}
                    >
                      <Link href="/review/revision">Sudah Direvisi</Link>
                    </li>
                    <li
                      className={`${
                        isActive("/review/declined") ? "font-bold" : ""
                      } hover:translate-x-2 duration-300 transition-all`}
                    >
                      <Link href="/review/declined">Ditolak</Link>
                    </li>
                  </ul>
                )}
                <li
                  onClick={() => toggleDropdown("peran-pengguna")}
                  className={`p-3 rounded-md flex items-center space-x-3 ${
                    isActive("/user")
                      ? "bg-primaryy text-white font-medium"
                      : openDropdown === "peran-pengguna"
                        ? "bg-primaryy bg-opacity-20"
                        : ""
                  }  hover:bg-primaryy hover:bg-opacity-20 transition-all duration-300 hover:font-medium hover:text-primaryy`}
                >
                  <User2Icon className="w-[25px] h-[25px]" />
                  <p className="pr-2">Pengguna</p>
                  <ChevronDown
                    className={`w-4 h-4 transition-all duration-300 ${openDropdown === "peran-pengguna" ? "rotate-180" : "rotate-0"}`}
                  />
                </li>
                {openDropdown === "peran-pengguna" && (
                  <ul className="space-y-3 bg-primaryy bg-opacity-10 p-3 rounded-lg mt-2">
                    <li
                      className={`${
                        isActive("/user/contribution") ? "font-bold" : ""
                      } hover:translate-x-2 duration-300 transition-all`}
                    >
                      <Link href="/user/contributor">Kontributor</Link>
                    </li>
                    <li
                      className={`${
                        isActive("/user/surveyor") ? "font-bold" : ""
                      } hover:translate-x-2 duration-300 transition-all`}
                    >
                      <Link href="/user/surveyor">Surveyor</Link>
                    </li>
                    <li
                      className={`${
                        isActive("/user/admin") ? "font-bold" : ""
                      } hover:translate-x-2 duration-300 transition-all`}
                    >
                      <Link href="/user/admin">Admin</Link>
                    </li>
                  </ul>
                )}
                <li
                  onClick={() => toggleDropdown("master-data")}
                  className={`p-3 rounded-md flex items-center space-x-3 ${
                    isActive("/master-data")
                      ? "bg-primaryy text-white font-medium"
                      : openDropdown === "master-data"
                        ? "bg-primaryy bg-opacity-20"
                        : ""
                  }  hover:bg-primaryy hover:bg-opacity-20 transition-all duration-300 hover:font-medium hover:text-primaryy`}
                >
                  <Database />
                  <p>Master Data</p>
                  <ChevronDown
                    className={`w-4 h-4 transition-all duration-300 ${openDropdown === "master-data" ? "rotate-180" : "rotate-0"}`}
                  />
                </li>
                {openDropdown === "master-data" && (
                  <ul className="space-y-3 bg-primaryy bg-opacity-10 p-3 rounded-lg mt-2">
                    <li
                      className={`${
                        isActive("/master-data/district") ? "font-bold" : ""
                      } hover:translate-x-2 duration-300 transition-all`}
                    >
                      <Link href="/master-data/district">Kecamatan</Link>
                    </li>
                    <li
                      className={`${
                        isActive("/master-data/village") ? "font-bold" : ""
                      } hover:translate-x-2 duration-300 transition-all`}
                    >
                      <Link href="/master-data/village">Desa</Link>
                    </li>
                    <li className="hover:translate-x-2 duration-300 transition-all">
                      <UploadFileJsonDialog route="/master-data/maps/api/create" />
                    </li>
                    <li
                      className={`${
                        isActive("/master-data/manual-book") ? "font-bold" : ""
                      } hover:translate-x-2 duration-300 transition-all`}
                    >
                      <Link href="/master-data/manual-book">Manual Book</Link>
                    </li>
                    <li
                      className={`${
                        isActive("/master-data/term-and-condition")
                          ? "font-bold"
                          : ""
                      } hover:translate-x-2 duration-300 transition-all`}
                    >
                      <Link href="/master-data/term-and-condition">
                        Term & Condition
                      </Link>
                    </li>
                  </ul>
                )}
              </>
            )}
          </ul>
        </>
      ) : (
        <>
          <Link href="/dashboard" className="flex space-x-4">
            <Image
              src="/assets/icons/logo.svg"
              className="w-[40px] h-[60px]"
              width={40}
              height={60}
              alt="logo"
            />
          </Link>
          <ul className="text-primaryy space-y-2 mt-14 font-light cursor-pointer text-[15px]">
            <li
              className={`p-3 rounded-md ${isActive("/dashboard") ? "bg-primaryy text-white" : "bg-transparent"} hover:bg-primaryy hover:bg-opacity-20 transition-all duration-300 hover:font-medium hover:text-primaryy`}
            >
              <Link href="/dashboard">
                <LayoutDashboard />
              </Link>
            </li>
            <li
              className={`p-3 ${isActive("/naming/create") ? "bg-primaryy text-white" : "bg-transparent"} rounded-md flex items-center justify-between hover:bg-primaryy hover:bg-opacity-20 transition-all duration-300 hover:font-medium hover:text-primaryy`}
            >
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
  const [token, setToken] = useState<string | undefined>("");
  const [role, setRole] = useState<string | undefined>("");
  const [dropdown, setDropdown] = useState<string | null>(null);
  const pathname = usePathname();
  const isActive = (path: string) => {
    if (path === "/") {
      return pathname === path;
    }
    return pathname.startsWith(path);
  };
  const toggleDropdown = (dropdownName: string) => {
    setDropdown((prev) => (prev === dropdownName ? null : dropdownName));
  };

  // Check if the route matches and set the dropdown open accordingly
  useEffect(() => {
    if (pathname.startsWith("/review")) {
      setDropdown("penelaahan");
    } else if (pathname.startsWith("/user")) {
      setDropdown("peran-pengguna");
    } else if (pathname.startsWith("/master-data")) {
      setDropdown("master-data");
    }
  }, [pathname]);

  useEffect(() => {
    const tokenn = Cookies.get("token");
    setToken(tokenn);
    if (tokenn) {
      try {
        const decodedToken = jwtDecode<any>(tokenn);

        console.log("Decoded Token:", decodedToken);
        setRole(decodedToken.role);

        // Anda bisa menggunakan data decodedToken di sini
        // contoh: console.log(`User ID: ${decodedToken.userId}`);
      } catch (error) {
        console.error("Invalid token", error);
      }
    } else {
      console.log("No token found in cookies");
    }
  }, []);

  return (
    <aside
      className={`overflow-auto md:hidden flex-1 h-screen ${type === "large" ? "w-[228px]" : "w-[100px]"} bg-[#F6F6F6] fixed p-6 z-50`}
    >
      {type === "large" ? (
        <>
          <Link href="/dashboard" className="flex space-x-4">
            <Image
              src="/assets/icons/logo.svg"
              className="w-[40px] h-[60px]"
              width={40}
              height={60}
              alt="logo"
            />
            <div>
              <h1 className="text-primaryy uppercase text-2xl font-bold">
                sitmap
              </h1>
              <p className="font-light text-sm text-primaryy">Dashboard</p>
            </div>
          </Link>
          <ul className="text-primaryy space-y-2 mt-14 cursor-pointer text-[15px]">
            <li
              className={`p-3 rounded-md flex items-center space-x-3 ${
                isActive("/dashboard")
                  ? "bg-primaryy text-white font-medium"
                  : ""
              }  hover:bg-primaryy hover:bg-opacity-20 transition-all duration-300 hover:font-medium hover:text-primaryy`}
            >
              <LayoutDashboard />
              <Link href="/dashboard">
                <p>Dashboard</p>
              </Link>
            </li>
            <li
              className={`p-3 rounded-md flex items-center space-x-3 ${
                isActive("/naming") ? "bg-primaryy text-white font-medium" : ""
              }  hover:bg-primaryy hover:bg-opacity-20 transition-all duration-300 hover:font-medium hover:text-primaryy`}
            >
              {" "}
              <MapIcon />
              <Link href="/naming">
                <p>Pendataan</p>
              </Link>
            </li>

            {role === "Verifikator" && (
              <>
                <li
                  onClick={() => toggleDropdown("penelaahan")}
                  className={`p-3 rounded-md flex items-center space-x-3 ${
                    isActive("/review")
                      ? "bg-primaryy text-white font-medium"
                      : dropdown === "penelaahan"
                        ? "bg-primaryy bg-opacity-20"
                        : ""
                  }  hover:bg-primaryy hover:bg-opacity-20 transition-all duration-300 hover:font-medium hover:text-primaryy`}
                >
                  <MapPinCheck />
                  <p>Penelaahan</p>
                  <ChevronDown
                    className={`w-4 h-4 transition-all duration-300 ${dropdown === "penelaahan" ? "rotate-180" : "rotate-0"}`}
                  />
                </li>
                {dropdown === "penelaahan" && (
                  <ul className="space-y-3 bg-primaryy bg-opacity-10 p-3 rounded-lg mt-2">
                    <li
                      className={`${
                        isActive("/review/has-been-reviewed") ? "font-bold" : ""
                      } hover:translate-x-2 duration-300 transition-all`}
                    >
                      <Link href="/review/has-been-reviewed">
                        Sudah Ditelaah
                      </Link>
                    </li>
                    <li
                      className={`${
                        isActive("/review/has-not-been-reviewed")
                          ? "font-bold"
                          : ""
                      } hover:translate-x-2 duration-300 transition-all`}
                    >
                      <Link href="/review/has-not-been-reviewed">
                        Belum Ditelaah
                      </Link>
                    </li>
                    <li
                      className={`${
                        isActive("/review/declined") ? "font-bold" : ""
                      } hover:translate-x-2 duration-300 transition-all`}
                    >
                      <Link href="/review/declined">Ditolak</Link>
                    </li>
                  </ul>
                )}
              </>
            )}

            {role === "Super Admin" && (
              <>
                <li
                  onClick={() => toggleDropdown("penelaahan")}
                  className={`p-3 rounded-md flex items-center space-x-3 ${
                    isActive("/review")
                      ? "bg-primaryy text-white font-medium"
                      : dropdown === "penelaahan"
                        ? "bg-primaryy bg-opacity-20"
                        : ""
                  }  hover:bg-primaryy hover:bg-opacity-20 transition-all duration-300 hover:font-medium hover:text-primaryy`}
                >
                  <MapPinCheck />
                  <p>Penelaahan</p>
                  <ChevronDown
                    className={`w-4 h-4 transition-all duration-300 ${dropdown === "penelaahan" ? "rotate-180" : "rotate-0"}`}
                  />
                </li>
                {dropdown === "penelaahan" && (
                  <ul className="space-y-3 bg-primaryy bg-opacity-10 p-3 rounded-lg mt-2">
                    <li
                      className={`${
                        isActive("/review/has-been-reviewed") ? "font-bold" : ""
                      } hover:translate-x-2 duration-300 transition-all`}
                    >
                      <Link href="/review/has-been-reviewed">
                        Sudah Ditelaah
                      </Link>
                    </li>
                    <li
                      className={`${
                        isActive("/review/has-not-been-reviewed")
                          ? "font-bold"
                          : ""
                      } hover:translate-x-2 duration-300 transition-all`}
                    >
                      <Link href="/review/has-not-been-reviewed">
                        Belum Ditelaah
                      </Link>
                    </li>
                    <li
                      className={`${
                        isActive("/review/declined") ? "font-bold" : ""
                      } hover:translate-x-2 duration-300 transition-all`}
                    >
                      <Link href="/review/declined">Ditolak</Link>
                    </li>
                  </ul>
                )}
                <li
                  onClick={() => toggleDropdown("peran-pengguna")}
                  className={`p-3 rounded-md flex items-center space-x-3 ${
                    isActive("/user")
                      ? "bg-primaryy text-white font-medium"
                      : dropdown === "peran-pengguna"
                        ? "bg-primaryy bg-opacity-20"
                        : ""
                  }  hover:bg-primaryy hover:bg-opacity-20 transition-all duration-300 hover:font-medium hover:text-primaryy`}
                >
                  <User2Icon className="w-[25px] h-[25px]" />
                  <p className="pr-2">Pengguna</p>
                  <ChevronDown
                    className={`w-4 h-4 transition-all duration-300 ${dropdown === "peran-pengguna" ? "rotate-180" : "rotate-0"}`}
                  />
                </li>
                {dropdown === "peran-pengguna" && (
                  <ul className="space-y-3 bg-primaryy bg-opacity-10 p-3 rounded-lg mt-2">
                    <li
                      className={`${
                        isActive("/user/contribution") ? "font-bold" : ""
                      } hover:translate-x-2 duration-300 transition-all`}
                    >
                      <Link href="/user/contributor">Kontributor</Link>
                    </li>
                    <li
                      className={`${
                        isActive("/user/surveyor") ? "font-bold" : ""
                      } hover:translate-x-2 duration-300 transition-all`}
                    >
                      <Link href="/user/surveyor">Surveyor</Link>
                    </li>
                    <li
                      className={`${
                        isActive("/user/admin") ? "font-bold" : ""
                      } hover:translate-x-2 duration-300 transition-all`}
                    >
                      <Link href="/user/admin">Admin</Link>
                    </li>
                  </ul>
                )}
                <li
                  onClick={() => toggleDropdown("master-data")}
                  className={`p-3 rounded-md flex items-center space-x-3 ${
                    isActive("/master-data")
                      ? "bg-primaryy text-white font-medium"
                      : dropdown === "master-data"
                        ? "bg-primaryy bg-opacity-20"
                        : ""
                  }  hover:bg-primaryy hover:bg-opacity-20 transition-all duration-300 hover:font-medium hover:text-primaryy`}
                >
                  <Database />
                  <p>Master Data</p>
                  <ChevronDown
                    className={`w-4 h-4 transition-all duration-300 ${dropdown === "master-data" ? "rotate-180" : "rotate-0"}`}
                  />
                </li>
                {dropdown === "master-data" && (
                  <ul className="space-y-3 bg-primaryy bg-opacity-10 p-3 rounded-lg mt-2">
                    <li
                      className={`${
                        isActive("/master-data/district") ? "font-bold" : ""
                      } hover:translate-x-2 duration-300 transition-all`}
                    >
                      <Link href="/master-data/district">Kecamatan</Link>
                    </li>
                    <li
                      className={`${
                        isActive("/master-data/village") ? "font-bold" : ""
                      } hover:translate-x-2 duration-300 transition-all`}
                    >
                      <Link href="/master-data/village">Desa</Link>
                    </li>
                    <li className="hover:translate-x-2 duration-300 transition-all">
                      <UploadFileJsonDialog route="/master-data/maps/api/create" />
                    </li>
                    <li
                      className={`${
                        isActive("/master-data/manual-book") ? "font-bold" : ""
                      } hover:translate-x-2 duration-300 transition-all`}
                    >
                      <Link href="/master-data/manual-book">Manual Book</Link>
                    </li>
                    <li
                      className={`${
                        isActive("/master-data/term-and-condition")
                          ? "font-bold"
                          : ""
                      } hover:translate-x-2 duration-300 transition-all`}
                    >
                      <Link href="/master-data/term-and-condition">
                        Term & Condition
                      </Link>
                    </li>
                  </ul>
                )}
              </>
            )}
          </ul>
        </>
      ) : (
        <>
          <Link href="/dashboard" className="flex space-x-4">
            <Image
              src="/assets/icons/logo.svg"
              className="w-[40px] h-[60px]"
              width={40}
              height={60}
              alt="logo"
            />
          </Link>
          <ul className="text-primaryy space-y-2 mt-14 font-light cursor-pointer text-[15px]">
            <li
              className={`p-3 rounded-md ${isActive("/dashboard") ? "bg-primaryy text-white" : "bg-transparent"} hover:bg-primaryy hover:bg-opacity-20 transition-all duration-300 hover:font-medium hover:text-primaryy`}
            >
              <Link href="/dashboard">
                <LayoutDashboard />
              </Link>
            </li>
            <li
              className={`p-3 ${isActive("/naming/create") ? "bg-primaryy text-white" : "bg-transparent"} rounded-md flex items-center justify-between hover:bg-primaryy hover:bg-opacity-20 transition-all duration-300 hover:font-medium hover:text-primaryy`}
            >
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

export { Sidebar, SidebarMobile };
