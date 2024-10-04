"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader } from "lucide-react";
import useAuthStore from "store/useAuthStore";

interface ProtectedRouteProps {
  roles?: string[];
  children: React.ReactNode;
}

const ProtectedRoute = ({ children, roles }: ProtectedRouteProps) => {
  const { user, isInitialized } = useAuthStore((state) => ({
    user: state.user,
    isInitialized: state.isInitialized,
  }));
  const router = useRouter();

  useEffect(() => {
    if (isInitialized) {
      if (!user) {
        const pathBeforeLogin = window.location.pathname;
        sessionStorage.setItem("pathBeforeLogin", pathBeforeLogin);
        router.replace("/login");
      } else if (roles && !roles.includes(user.role)) {
        router.replace("/");
      }
    }
  }, [user, router, roles, isInitialized]);

  if (!isInitialized) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="animate-spin" />
      </div>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;
