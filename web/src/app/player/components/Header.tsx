import React from "react";
import { useAuth } from "../context/authContext";
import AppPublicMenu from "@/app/components/AppPublicMenu";
import AppUserMenu from "@/app/components/AppUserMenu";

export const Header = () => {
  const { isLogin } = useAuth();

  return (
    <div className="flex items-center h-full">
      <span className="flex-1 text-xl">个人中心</span>
      {isLogin ? <AppUserMenu /> : <AppPublicMenu />}
    </div>
  );
};
