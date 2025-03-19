import { MenuOutlined } from "@ant-design/icons";
import { Dropdown, MenuProps } from "antd";
import { useRouter } from "next/navigation";
import React from "react";
import useChangePassword from "../player/hooks/useChangePassword";
import useChangeUserinfo from "../player/hooks/useChangeUserInfo";
import { useAuth } from "../player/context/authContext";

function AppUserMenu() {
  const { isLogin, isAdmin, logout } = useAuth();
  const [openChangePassword, changePasswordHolder] = useChangePassword();
  const [openChangeUserinfo, changeUserinfoHolder] = useChangeUserinfo();
  const router = useRouter();

  const items: MenuProps["items"] = [
    {
      key: "edit",
      label: "编辑账号",
      onClick: () => {
        openChangeUserinfo();
      },
    },
    {
      key: "changePassword",
      label: "修改密码",
      onClick: () => {
        openChangePassword();
      },
    },
    {
      key: "logout",
      danger: true,
      label: "退出登录",
      onClick: () => {
        logout();
      },
    },
  ];

  if (isAdmin) {
    items.unshift({
      key: "manage",
      label: "管理后台",
      onClick: () => {
        router.push("/manage");
      },
    });
    items.unshift({
      key: "raid-roster",
      label: "团队编排",
      onClick: () => {
        router.push("/raid-roster");
      },
    });
  }

  items.unshift(
    ...[
      {
        key: "index",
        label: "官网首页",
        onClick: () => {
          router.push("/");
        },
      },
      {
        key: "player",
        label: "个人中心",
        onClick: () => {
          router.push("/player");
        },
      },
    ]
  );

  if (!isLogin) return null;
  return (
    <>
      <Dropdown menu={{ items }} trigger={["click"]}>
        <MenuOutlined />
      </Dropdown>
      {changePasswordHolder}
      {changeUserinfoHolder}
    </>
  );
}

export default AppUserMenu;
