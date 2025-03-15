import { MenuOutlined } from "@ant-design/icons";
import { Dropdown, MenuProps } from "antd";
import React from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/player/context/authContext";

export const Header = () => {
  const { isLogin, logout } = useAuth();
  const router = useRouter();

  const items: MenuProps["items"] = [
    {
      key: "1",
      label: "个人中心",
      onClick: () => {
        router.push("/player");
      },
    },
    {
      key: "2",
      danger: true,
      label: "退出登录",
      onClick: () => {
        logout();
      },
    },
  ];

  return (
    <div className="flex items-center h-full">
      <span className="flex-1 text-xl">管理后台</span>
      {isLogin && (
        <Dropdown menu={{ items }} trigger={["click"]}>
          <MenuOutlined />
        </Dropdown>
      )}
    </div>
  );
};
