import React from "react";
import { useAuth } from "../context/authContext";
import AppPublicMenu from "@/app/components/AppPublicMenu";
import AppUserMenu from "@/app/components/AppUserMenu";
import AppTitle from "@/app/components/AppTitle";

export const Header = () => {
  const { isLogin } = useAuth();

  return (
    <div className="flex items-center h-full max-w-[600px] mx-auto">
      <AppTitle title="个人中心" subTitle="" />
      {isLogin ? <AppUserMenu /> : <AppPublicMenu />}
    </div>
  );
};
