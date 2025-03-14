import { MenuOutlined } from "@ant-design/icons";
import { Dropdown, MenuProps } from "antd";
import React from "react";
import { useAuth } from "../context";
import useChangePassword from "../hooks/useChangePassword";
import useChangeUserinfo from "../hooks/useChangeUserinfo";

export const Header = () => {
  const { isLogin, logout } = useAuth();
  const [openChangePassword, changePasswordHolder] = useChangePassword();
  const [openChangeUserinfo, changeUserinfoHolder] = useChangeUserinfo();

  const items: MenuProps["items"] = [
    {
      key: "1",
      label: "编辑账号",
      onClick: () => {
        openChangeUserinfo();
      },
    },
    {
      key: "2",
      label: "修改密码",
      onClick: () => {
        openChangePassword();
      },
    },
    {
      key: "3",
      danger: true,
      label: "退出登录",
      onClick: () => {
        logout();
      },
    },
  ];

  return (
    <div className="flex items-center h-full">
      <span className="flex-1 text-xl">个人中心</span>
      {isLogin && (
        <Dropdown menu={{ items }} trigger={["click"]}>
          <MenuOutlined />
        </Dropdown>
      )}
      {changePasswordHolder}
      {changeUserinfoHolder}
    </div>
  );
};
