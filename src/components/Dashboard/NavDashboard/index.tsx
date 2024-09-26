import { BellIcon, MailIcon, UserCircle2Icon } from "lucide-react";

const NavDashboard = () => {
  return (
    <nav className="z-10 absolute bg-primaryy w-screen">
      <ul className="flex justify-end text-white items-center space-x-6 py-8 px-10">
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
  );
};

export default NavDashboard;
