import { Menu, MenuProps } from "antd";
import { useRouter, usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";

type MenuItem = Required<MenuProps>["items"][number];

const PATH_TO_KEY: Record<string, string> = {
  "/": "index",
  "/ranking": "ranking",
  "/player": "player",
  "/game": "game",
  "/photo": "photo",
};

function AppPublicMenu() {
  const router = useRouter();
  const pathname = usePathname();
  const [current, setCurrent] = useState("");

  useEffect(() => {
    const key = PATH_TO_KEY[pathname] ?? "index";
    setCurrent(key);
  }, [pathname]);

  const items: MenuItem[] = [
    {
      label: "首页",
      key: "index",
      onClick: () => {
        router.push("/");
      },
    },
    {
      label: "排行榜",
      key: "ranking",
      onClick: () => {
        router.push("/ranking");
      },
    },
    {
      label: "照片墙",
      key: "photo",
      onClick: () => {
        router.push("/photo");
      },
    },
    {
      label: "小游戏",
      key: "game",
      onClick: () => {
        router.push("/game");
      },
    },
    {
      label: "个人中心",
      key: "player",
      onClick: () => {
        router.push("/player");
      },
    },
  ];

  return (
    <Menu
      style={{
        backgroundColor: "transparent",
        border: "none",
      }}
      className="min-w-0"
      selectedKeys={[current]}
      mode="horizontal"
      items={items}
    />
  );
}

export default AppPublicMenu;
