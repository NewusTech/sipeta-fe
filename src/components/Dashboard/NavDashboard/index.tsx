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
import { useEffect, useState } from "react";
import Link from "next/link";
import Cookies from "js-cookie";
import { usePathname, useRouter } from "next/navigation";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import NotifikasiWebiste from "@/components/Notification";
import { NotificationsType } from "types/types";
import { jwtDecode } from "jwt-decode";
import { io, Socket } from "socket.io-client";

interface JwtPayload {
  userId: string;
}

const NavDashboard = () => {
  let socket: Socket;
  const pathName = usePathname();
  const [auth, setAuth] = useState<string>();
  const [currentPath, setCurrentPath] = useState(pathName);
  const [decoded, setDecoded] = useState<JwtPayload | null>(null);
  const [notifications, setNotifications] = useState<NotificationsType[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [open, setOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(false);

  const [token, setToken] = useState<string | undefined>("");
  const [role, setRole] = useState<string | undefined>("");

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
    setDecoded(null);
  };

  useEffect(() => {
    const authen = Cookies.get("token");

    setAuth(authen);
  }, []);

  useEffect(() => {
    const auth = Cookies.get("token");

    let socket: Socket | null = null;

    if (auth) {
      try {
        const decodedToken = jwtDecode<JwtPayload>(auth);

        socket = io(`${process.env.NEXT_PUBLIC_API_URL_MPP_GOOGLE}`);

        // Dengarkan event dari server
        socket.on("UpdateStatus", (pesansocket: any) => {
          if (pesansocket.iduser == decodedToken?.userId) {
            fetchNotifications(currentPage);
          }
        });

        setDecoded(decodedToken);
      } catch (error) {
        console.error("Invalid token", error);
      }
    }

    // Cleanup ketika komponen di-unmount
    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, [pathName]);

  const fetchNotifications = async (page: number) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/notifications?page=${page}&limit=10`,
        {
          headers: {
            Authorization: `Bearer ${Cookies.get("token")}`,
          },
        }
      );
      const data = await response.json();
      setNotifications(data?.data);
      setTotalPages(Math.ceil(data?.pagination?.totalCount / 10));
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    }
  };

  useEffect(() => {
    const auth = Cookies.get("token");
    if (auth) {
      fetchNotifications(currentPage);
    }
  }, [currentPage]);

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
          <Popover>
            <PopoverTrigger>
              <li className="relative">
                <BellIcon />
                {notifications?.some(
                  (notification) => notification.isopen === 0
                ) && (
                  <span className="absolute rounded-full text-[8px] bg-red-500 w-4 h-4 flex items-center justify-center -mt-8 ml-3"></span>
                )}
              </li>
            </PopoverTrigger>
            <PopoverContent className="min-w-[500px] bg-neutral-50 mr-5 border border-primary-900 shadow-lg rounded-lg max-h-[550px] overflow-y-scroll">
              <div className="w-full flex flex-col overflow-y-scroll gap-y-3 verticalScroll max-h-screen">
                <div className="w-full flex flex-col gap-y-3">
                  <div className="w-full border-b border-neutral-900">
                    <h3 className="text-neutral-900 font-semibold text-[20px]">
                      Notifikasi
                    </h3>
                  </div>
                  {notifications?.map((notification, i) => (
                    <NotifikasiWebiste key={i} notification={notification} />
                  ))}
                </div>

                <div className="flex justify-between mt-4 px-2">
                  <button
                    className="px-4 py-2 bg-primary-700 text-white rounded disabled:opacity-50"
                    onClick={() => setCurrentPage((prevPage) => prevPage - 1)}
                    disabled={currentPage <= 1}
                  >
                    Previous
                  </button>
                  <span className="self-center text-neutral-900">
                    Page {currentPage} of {totalPages}
                  </span>
                  <button
                    className="px-4 py-2 bg-primary-700 text-white rounded disabled:opacity-50"
                    onClick={() => setCurrentPage((prevPage) => prevPage + 1)}
                    disabled={currentPage >= totalPages}
                  >
                    Next
                  </button>
                </div>
              </div>
            </PopoverContent>
          </Popover>
          <li
            className="flex space-x-2 items-center cursor-pointer"
            onClick={toggleDropdown2}
          >
            <UserCircle2Icon className="w-10 h-10" />
            <p>{role}</p>
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
