import { HamburgerMenuIcon } from "@radix-ui/react-icons";
import { BellIcon, ChevronDown, UserCircle2Icon } from "lucide-react";
import Image from "next/image";

const NavDashboard = () => {
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
            <div className="absolute rounded-full text-[8px] bg-red-500 w-4 h-4 flex items-center justify-center -mt-10 ml-5">
              <p>3</p>
            </div>
          </li>
          <li className="flex space-x-2 items-center">
            <UserCircle2Icon className="w-10 h-10" />
            <p>User</p>
          </li>
        </ul>
      </nav>
      <div className="flex shadow px-10 py-3 justify-between items-center text-primaryy">
        <HamburgerMenuIcon className="w-6 h-6" />
        <div className="flex items-center space-x-3">
          <BellIcon className="w-6 h-6" />
          <div className="flex items-center space-x-2">
            <UserCircle2Icon className="w-6 h-6" />
            <p className="text-sm">User</p>
            <ChevronDown className={`w-4 h-4 transition-all duration-300 `} />
          </div>
        </div>
      </div>
    </>
  );
};

export default NavDashboard;
